export default class LoginController {
  constructor(router, auth, userModel, loginView) {
    this.router = router;
    this.auth = auth;
    this.userModel = userModel;
    this.loginView = loginView;

    this.lms = this.loginView.getDomRefs();

    this.lms.loginFormLm.addEventListener('submit', this.loginUser.bind(this));
  }

  loginUser(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const loginData = {};
    let wasFetchAborted = false;

    formData.forEach((value, key) => {
      loginData[key] = value;
    });

    this.loginView.updateSubmitBtn('Loading...');

    this.userModel.handleUserLogin(JSON.stringify(loginData))
      .then(data => {
        this.auth.loginClient(data);
        this.router.navigateTo('/');
      })
      .catch(error => {
        if (error.name === 'AbortError') {
          wasFetchAborted = true;
          console.warn('Request aborted due to navigation change');
          return;
        }
        
        console.error(error.message);
        this.loginView.updateErrorMessage(error.message);
      })
      .finally(() => {
        if (wasFetchAborted) return;
        this.loginView.updateSubmitBtn('Register');
      });
  }
}
export default class RegisterController {
  constructor(router, userModel, registerView) {
    this.router = router;
    this.userModel = userModel
    this.registerView = registerView;

    // Get DOM references
    this.lms = this.registerView.getRegisterLms();

    // Attach events
    this.lms.registerFormLm.addEventListener('submit', this.registerUser.bind(this));
  }

  registerUser(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const registerData = {};
    let wasFetchAborted = false;

    formData.forEach((value, key) => {
      registerData[key] = value;
    });

    this.registerView.updateSubmitBtn('Loading...');

    this.userModel.handleUserRegistration(JSON.stringify(registerData))
      .then(() => {
        this.router.navigateTo('/login');
      })
      .catch(error => {
        if (error.name === 'AbortError') {
          wasFetchAborted = true;
          console.warn('Request aborted due to navigation change');
          return;
        }

        console.error(error.message);
        this.registerView.clearErrorMessages(error.data?.errors);
      })
      .finally(() => {
        if (wasFetchAborted) return;
        this.registerView.updateSubmitBtn('Register');
      });
  }
}
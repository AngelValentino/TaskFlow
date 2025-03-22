export default class LoginController {
  constructor(router, auth, userModel, loginView) {
    this.router = router;
    this.auth = auth;
    this.userModel = userModel;
    this.loginView = loginView;

    this.activeRequest = false;

    this.errors = {
      email: null,
      password: null
    };

    this.lms = this.loginView.getDomRefs();

    this.lms.loginFormLm.addEventListener('submit', this.loginUser.bind(this));
    this.addValidationEventsOnInputChange();
  }

  addValidationEventsOnInputChange() {
    this.lms.loginFormInputLms.forEach(input => {
      input.addEventListener('input', this.handleValidation.bind(this));
    })
  }

  getPasswordValidationError(username) {
    if (username.length <= 0) {
      return 'Password is required.';
    }

    return false;
  }

  getEmailValidationError(email) {
    if (email.length <= 0) {
      return 'Email address is required.';
    }

    return false;
  }

  handleValidation(e) {
    if (e.target.tagName !== 'INPUT') return;

    const input = e.target;
    const value = input.value.trim();

    switch (input.name) {
      case 'email':
        this.errors.email = this.getEmailValidationError(value);
        break;

      case 'password':
        this.errors.password = this.getPasswordValidationError(value);
        break;
    }

    console.log(this.errors);
    this.loginView.toggleSubmitBtn(this.errors);
  }

  loginUser(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const loginData = {};
    let wasFetchAborted = false;

    formData.forEach((value, key) => {
      loginData[key] = value;
    });

    if (this.activeRequest) {
      console.warn('login fetch request active');
      this.loginView.updateErrorMessage('Your request is being processed. Please wait a moment.');
      return;
    }

    this.activeRequest = true;
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
        this.activeRequest = false;
        if (wasFetchAborted) return;
        this.loginView.updateSubmitBtn('Log in');
      });
  }
}
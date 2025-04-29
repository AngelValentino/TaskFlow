export default class LoginController {
  constructor(router, auth, userModel, loginView, utils, authFormHandler) {
    this.router = router;
    this.auth = auth;
    this.userModel = userModel;
    this.loginView = loginView;
    this.utils = utils;
    this.authFormHandler = authFormHandler;

    this.activeRequest = false;

    this.errors = {
      email: null,
      password: null
    };

    this.lms = this.loginView.getDomRefs();
  }

  init() {
    this.lms.formLm.addEventListener('submit', this.loginUser.bind(this));
    this.addValidationEventsOnInputChange();
    this.lms.togglePasswordBtn.addEventListener('click', this.authFormHandler.handlePasswordToggle.bind(this.authFormHandler, [ this.lms.passwordInputLm ]));
  }

  addValidationEventsOnInputChange() {
    this.lms.loginFormInputLms.forEach(input => {
      input.addEventListener('input', this.handleValidation.bind(this));
    });
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

    this.loginView.toggleSubmitBtn(this.errors);
  }

  loginUser(e) {
    e.preventDefault();
    const loginData = this.utils.getFormData(e.target);
    let wasFetchAborted = false;

    if (this.activeRequest) {
      this.loginView.updateErrorMessage('Your request is being processed. Please wait a moment.');
      return;
    }

    this.activeRequest = true;
    const loadingTimId = this.utils.handleLoading(
      this.loginView.updateSubmitBtn.bind(this.loginView, 'Loading...')
    );

    this.userModel.handleUserLogin(JSON.stringify(loginData))
      .then(data => {
        this.auth.loginClient(data);
        this.router.navigateTo('/');
      })
      .catch(error => {
        if (error.name === 'AbortError') {
          wasFetchAborted = true;
          return;
        }

        this.loginView.updateErrorMessage(error.message);
        console.error(this.utils.formatErrorMessage(error));
      })
      .finally(() => {
        clearTimeout(loadingTimId);
        this.activeRequest = false;
        if (wasFetchAborted) return;
        this.loginView.updateSubmitBtn('Log in');
      });
  }
}
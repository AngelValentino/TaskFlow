export default class RegisterController {
  constructor(router, userModel, registerView, utils, authFormHandler) {
    this.router = router;
    this.userModel = userModel
    this.registerView = registerView;
    this.utils = utils;
    this.authFormHandler = authFormHandler;

    this.activeRequest = false;

    this.errors = {
      username: null,
      email: null,
      password: null,
      repeated_password: null,
      terms: null
    };

    this.wasBlurred = {
      username: false,
      email: false,
      password: false,
      repeated_password: false
    };
    
    this.lms = this.registerView.getDomRefs();
  }

  init() {
    this.lms.formLm.addEventListener('submit', this.registerUser.bind(this));
    this.lms.formLm.addEventListener('blur', this.handleValidationOnBlur.bind(this), true);
    this.authFormHandler.addValidationEventOnInputChange(
      this.lms.formInputLms,
      this.errors,
      this.wasBlurred,
      this.lms.confirmPasswordInputLm,
      this.lms.passwordInputLm,
      this.lms.submitBtn,
      this.registerView.renderErrorMessages.bind(this.registerView),
    );
    this.lms.togglePasswordBtns.forEach(btn => {
      btn.addEventListener('click', this.authFormHandler.handlePasswordToggle.bind(this.authFormHandler, [this.lms.passwordInputLm, this.lms.confirmPasswordInputLm]));
    });
  }

  handleValidationOnBlur(e) {
    this.authFormHandler.handleAuthValidationOnBlur(
      e,
      this.errors,
      this.wasBlurred,
      this.lms.confirmPasswordInputLm,
      this.lms.passwordInputLm,
      this.lms.submitBtn,
      this.registerView.renderErrorMessages.bind(this.registerView)
    )
  }

  registerUser(e) {
    e.preventDefault();
    const registerData = this.utils.getFormData(e.target);

    if (this.activeRequest) {
      this.registerView.renderGeneralErrorMessage('Your request is being processed. Please wait a moment.');
      return;
    }

    this.activeRequest = true;
    const loadingTimId = this.utils.handleLoading(
      this.utils.updateSubmitBtn.bind(this.utils, 'Loading', this.lms.submitBtnTextLm)
    );

    this.userModel.handleUserRegistration(JSON.stringify(registerData))
      .then(() => {
        this.router.navigateTo('/login');
      })
      .catch(error => {
        if (error.name === 'AbortError') {
          return;
        }

        if (error.data) {
          this.registerView.renderGeneralErrorMessage('');
          this.registerView.renderErrorMessages(error.data.errors);
        } 
        else {
          this.registerView.renderErrorMessages();
          this.registerView.renderGeneralErrorMessage(error.message);
        }

        console.error(this.utils.formatErrorMessage(error));
      })
      .finally(() => {
        clearTimeout(loadingTimId);
        this.activeRequest = false;
        this.utils.updateSubmitBtn('Register', this.lms.submitBtnTextLm);
      });
  }
}
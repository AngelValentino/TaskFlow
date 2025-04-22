export default class ResetPasswordController {
  constructor(resetPasswordView, resetPasswordModel, utils, router, authFormHandler) {
    this.resetPasswordView = resetPasswordView;
    this.resetPasswordModel = resetPasswordModel;
    this.utils = utils;
    this.router = router;
    this.activeRequest = false;
    this.authFormHandler = authFormHandler;

    this.errors = {
      password: null,
      repeated_password: null
    };

    this.wasBlurred = {
      password: false,
      repeated_password: false
    };

    this.lms = this.resetPasswordView.getDomRefs();
  }

  init() {
    this.lms.formLm.addEventListener('submit', this.resetUserPassword.bind(this));
    this.lms.formLm.addEventListener('blur', this.handleValidationOnBlur.bind(this), true);
    this.authFormHandler.addValidationEventOnInputChange(
      this.lms.formInputLms,
      this.errors,
      this.wasBlurred,
      this.lms.confirmPasswordInputLm,
      this.lms.passwordInputLm,
      this.resetPasswordView.renderErrorMessages.bind(this.resetPasswordView),
      this.resetPasswordView.toggleSubmitBtn.bind(this.resetPasswordView)
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
      this.resetPasswordView.renderErrorMessages.bind(this.resetPasswordView),
      this.resetPasswordView.toggleSubmitBtn.bind(this.resetPasswordView)
    )
  }

  resetUserPassword(e) {
    e.preventDefault();
    const registerData = this.utils.getFormData(e.target);
    const params = new URLSearchParams(window.location.search);
    registerData.token = params.get('token');
    let wasFetchAborted = false;

    if (this.activeRequest) {
      this.resetPasswordView.updateErrorMessage('Your request is being processed. Please wait a moment.');
      return;
    }

    this.activeRequest = true;
    const loadingTimId = this.utils.handleLoading(
      this.resetPasswordView.updateSubmitBtn.bind(this.resetPasswordView, 'Loading...')
    );

    this.resetPasswordModel.handleResetUserPassword(JSON.stringify(registerData))
      .then(() => {
        this.router.navigateTo('/login');
      })
      .catch(error => {
        if (error.name === 'AbortError') {
          wasFetchAborted = true;
          return;
        }

        if (error.data) {
          console.error(error.data.errors);
          this.resetPasswordView.updateErrorMessage('');
          this.resetPasswordView.renderErrorMessages(error.data.errors);
        } 
        else {
          this.resetPasswordView.renderErrorMessages();
          this.resetPasswordView.updateErrorMessage(error.message);
        }

        console.error(this.utils.formatErrorMessage(error));
      })
      .finally(() => {
        clearTimeout(loadingTimId);
        this.activeRequest = false;
        if (wasFetchAborted) return;
        this.resetPasswordView.updateSubmitBtn('Reset password');
      });
  }
}
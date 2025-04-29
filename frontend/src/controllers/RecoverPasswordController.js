export default class RecoverPasswordController {
  constructor(recoverPasswordView, recoverPasswordModel, utils, authFormHandler) {
    this.recoverPasswordView = recoverPasswordView;
    this.recoverPasswordModel = recoverPasswordModel;
    this.utils = utils;
    this.authFormHandler = authFormHandler;
    this.errors = {
      email: null
    }
    this.activeRequest = false;
    this.lms = this.recoverPasswordView.getDomRefs();
  }

  init() {
    this.lms.emailInputLm.addEventListener('input', this.handleValidation.bind(this));
    this.lms.formLm.addEventListener('submit', this.sendRecoverPasswordEmail.bind(this));
  }

  getEmailValidationError(email) {
    if (email.length <= 0) {
      return 'Email address is required.';
    }

    return false;
  }

  handleValidation(e) {
    const value = e.target.value.trim();
    this.errors.email = this.authFormHandler.getEmailValidationError(value);
    this.authFormHandler.toggleSubmitBtn(this.errors, this.lms.submitBtn);
  }

  sendRecoverPasswordEmail(e) {
    e.preventDefault();
    const email = this.recoverPasswordView.getEmailValue();
    let wasFetchAborted = false;

    if (this.activeRequest) {
      this.recoverPasswordView.updateErrorMessage('Your request is being processed. Please wait a moment.');
      return;
    }

    this.activeRequest = true;
    const loadingTimId = this.utils.handleLoading(
      this.recoverPasswordView.updateSubmitBtn.bind(this.recoverPasswordView, 'Loading...')
    );

    this.recoverPasswordModel.handleSendRecoverPasswordEmail(email)
      .then(data => {
        this.recoverPasswordView.updateErrorMessage('');
        this.recoverPasswordView.updateMessage(data.message);
      })
      .catch(error => {
        if (error.name === 'AbortError') {
          wasFetchAborted = true;
          return;
        }

        this.recoverPasswordView.updateMessage('');
        this.recoverPasswordView.updateErrorMessage(error.message);
        
        console.error(this.utils.formatErrorMessage(error));
      })
      .finally(() => {
        clearTimeout(loadingTimId);
        this.activeRequest = false;
        if (wasFetchAborted) return;
        this.recoverPasswordView.updateSubmitBtn('Send email');
      });
  }
}
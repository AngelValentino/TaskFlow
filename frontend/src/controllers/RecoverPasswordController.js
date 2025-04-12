export default class RecoverPasswordController {
  constructor(recoverPasswordView, recoverPasswordModel, utils) {
    this.recoverPasswordView = recoverPasswordView;
    this.recoverPasswordModel = recoverPasswordModel;
    this.utils = utils;
    this.errors = {
      email: null
    }
    this.activeRequest = false;

    this.lms = this.recoverPasswordView.getDomRefs();
    this.lms.emailInputLm.addEventListener('input', this.handleValidation.bind(this));
    this.lms.recoverPasswordFormLm.addEventListener('submit', this.sendRecoverPasswordEmail.bind(this));
  }

  getEmailValidationError(email) {
    if (email.length <= 0) {
      return 'Email address is required.';
    }

    return false;
  }

  handleValidation(e) {
    const value = e.target.value.trim();
    this.errors.email = this.getEmailValidationError(value);
    this.recoverPasswordView.toggleSubmitBtn(this.errors);
  }

  sendRecoverPasswordEmail(e) {
    e.preventDefault();
    const email = this.recoverPasswordView.getEmailValue();
    let wasFetchAborted = false;

    if (this.activeRequest) {
      console.warn('Recover password fetch request active');
      this.recoverPasswordView.updateErrorMessage('Your request is being processed. Please wait a moment.');
      return;
    }

    this.activeRequest = true;
    const loadingTimId = this.utils.handleLoading(
      this.recoverPasswordView.updateSubmitBtn.bind(this.recoverPasswordView, 'Loading...')
    );

    this.recoverPasswordModel.handleSendRecoverPasswordEmail(email)
      .then(data => {
        console.log(data.message);
        this.recoverPasswordView.updateErrorMessage('');
        this.recoverPasswordView.updateMessage(data.message);
      })
      .catch(error => {
        if (error.name === 'AbortError') {
          wasFetchAborted = true;
          console.warn('Request aborted due to navigation change');
          return;
        }

        console.error(error.message);
        this.recoverPasswordView.updateMessage('');
        this.recoverPasswordView.updateErrorMessage(error.message);
      })
      .finally(() => {
        clearTimeout(loadingTimId);
        this.activeRequest = false;
        if (wasFetchAborted) return;
        this.recoverPasswordView.updateSubmitBtn('Send email');
      });
  }
}
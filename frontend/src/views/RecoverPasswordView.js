export default class RecoverPasswordView {
  constructor(authFormHandler) {
    this.authFormHandler = authFormHandler;
    this.lms = {
      formLm: document.getElementById('recover-password-form'),
      emailInputLm: document.getElementById('recover-password-form__email-input'),
      formErrorLm: document.getElementById('recover-password-form__error'),
      formMessageLm: document.getElementById('recover-password-form__message'),
      submitBtn: document.getElementById('auth-form__submit-btn'),
      submitBtnText: document.getElementById('auth-form__submit-btn-text'),
    };
  }

  getDomRefs() {
    return this.lms;
  }

  getEmailValue() {
    return this.lms.emailInputLm.value.trim();
  }

  updateErrorMessage(error) {
    this.authFormHandler.updateFormMessage(this.lms.formErrorLm, error);
  }

  updateMessage(message) {
    this.authFormHandler.updateFormMessage(this.lms.formMessageLm, message);
  }
}
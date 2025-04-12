export default class RecoverPasswordView {
  constructor(authFormHandler) {
    this.authFormHandler = authFormHandler;
    this.lms = {
      recoverPasswordFormLm: document.getElementById('recover-password-form'),
      emailInputLm: document.getElementById('recover-password-form__email-input'),
      recoverPasswordErrorLm: document.getElementById('recover-password-form__error'),
      recoverPasswordMessageLm: document.getElementById('recover-password-form__message'),
      submitBtn: document.getElementById('recover-password-form__submit-btn')
    };
  }

  getDomRefs() {
    return this.lms;
  }

  getEmailValue() {
    return this.lms.emailInputLm.value.trim();
  }

  updateErrorMessage(error) {
    this.authFormHandler.updateFormMessage(this.lms.recoverPasswordErrorLm, error);
  }

  updateMessage(message) {
    this.authFormHandler.updateFormMessage(this.lms.recoverPasswordMessageLm, message);
  }

  toggleSubmitBtn(errors) {
    const isValid = Object.values(errors).every(error => error === false);
    this.lms.submitBtn.disabled = !isValid;
  }

  updateSubmitBtn(text) {
    this.lms.submitBtn.innerText = text;
  }
}
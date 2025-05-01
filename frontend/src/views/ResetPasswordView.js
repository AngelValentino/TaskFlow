export default class ResetPasswordView {
  constructor(authFormHandler) {
    this.authFormHandler = authFormHandler;
    this.lms = {
      formLm: document.getElementById('reset-password-form'),
      passwordErrorLm: document.getElementById('reset-password-form__password-error'),
      confirmPasswordErrorLm: document.getElementById('reset-password-form__repeated-password-error'),
      confirmPasswordInputLm: document.getElementById('reset-password-form__repeated-password-input'),
      passwordInputLm: document.getElementById('reset-password-form__password-input'),
      formErrorLm: document.getElementById('reset-password-form__error'),
      submitBtn: document.getElementById('auth-form__submit-btn'),
      submitBtnText: document.getElementById('auth-form__submit-btn-text'),
      togglePasswordBtns: document.querySelectorAll('.auth-form__toggle-password-btn')
    }
    this.lms.formInputLms = this.lms.formLm.querySelectorAll('input');
  }

  getDomRefs() {
    return this.lms;
  }

  setPasswordError(message) {
    this.authFormHandler.setFormError(message, this.lms.passwordErrorLm, this.lms.passwordInputLm);
  }

  setRepeatedPasswordError(message) {
    this.authFormHandler.setFormError(message, this.lms.confirmPasswordErrorLm, this.lms.confirmPasswordInputLm);
  }

  renderErrorMessages(errors = {}) {
    this.setPasswordError(errors.password);
    this.setRepeatedPasswordError(errors.repeated_password);
  }

  updateErrorMessage(error) {
    this.authFormHandler.updateFormMessage(this.lms.formErrorLm, error);
  }
}
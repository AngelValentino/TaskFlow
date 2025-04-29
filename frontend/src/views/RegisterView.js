export default class RegisterView {
  constructor(authFormHandler) {
    this.authFormHandler = authFormHandler;
    this.lms = {
      formLm: document.getElementById('register-form'),
      usernameErrorLm: document.getElementById('username-error'),
      emailErrorLm: document.getElementById('email-error'),
      passwordErrorLm: document.getElementById('password-error'),
      submitBtn: document.getElementById('register-form__submit-btn'),
      usernameInputLm: document.getElementById('register-form__username-input'),
      emailInputLm: document.getElementById('register-form__email-input'),
      passwordInputLm: document.getElementById('register-form__password-input'),
      confirmPasswordInputLm: document.getElementById('register-form__confirm-password-input'),
      confirmPasswordErrorLm: document.getElementById('confirm-password-error'),
      generalErrorLm: document.getElementById('register-form__general-error'),
      togglePasswordBtns: document.querySelectorAll('.auth-form__toggle-password-btn')
    };
    this.lms.formInputLms = this.lms.formLm.querySelectorAll('input');
  }

  getDomRefs() {
    return this.lms;
  }

  setUsernameError(message) {
    this.authFormHandler.setFormError(message, this.lms.usernameErrorLm, this.lms.usernameInputLm);
  }

  setEmailError(message) {
    this.authFormHandler.setFormError(message, this.lms.emailErrorLm, this.lms.emailInputLm);
  }

  setPasswordError(message) {
    this.authFormHandler.setFormError(message, this.lms.passwordErrorLm, this.lms.passwordInputLm);
  }

  setRepeatedPasswordError(message) {
    this.authFormHandler.setFormError(message, this.lms.confirmPasswordErrorLm, this.lms.confirmPasswordInputLm);
  }

  renderErrorMessages(errors = {}) {
    this.setUsernameError(errors.username);
    this.setEmailError(errors.email);
    this.setPasswordError(errors.password);
    this.setRepeatedPasswordError(errors.repeated_password);
    this.renderGeneralErrorMessage(errors.terms);
  }

  renderGeneralErrorMessage(message) {
    this.lms.generalErrorLm.innerText = message;
  }

  toggleSubmitBtn(errors) {
    const isValid = Object.values(errors).every(error => error === false);
    this.lms.submitBtn.disabled = !isValid;
  }

  updateSubmitBtn(text) {
    this.lms.submitBtn.innerText = text;
  }
}
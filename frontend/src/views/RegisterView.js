export default class RegisterView {
  constructor() {
    this.lms = {
      registerFormLm: document.getElementById('register-form'),
      usernameErrorLm: document.getElementById('username-error'),
      emailErrorLm: document.getElementById('email-error'),
      passwordErrorLm: document.getElementById('password-error'),
      submitBtn: document.getElementById('register-form__submit-btn'),
      usernameInputLm: document.getElementById('register-form__username-input'),
      emailInputLm: document.getElementById('register-form__email-input'),
      passwordInputLm: document.getElementById('register-form__password-input'),
      repeatPasswordInputLm: document.getElementById('register-form__repeat-password-input'),
      confirmPasswordErrorLm: document.getElementById('confirm-password-error'),
      generalErrorLm: document.getElementById('register-form__general-error'),
    };
    this.lms.registerFormInputLms = this.lms.registerFormLm.querySelectorAll('input');
  }

  getDomRefs() {
    return this.lms;
  }

  setError(message, errorLm, inputLm) {
    if (!message) {
      inputLm.classList.remove('error');
      errorLm.textContent = '';
    } 
    else {
      inputLm.classList.add('error');
      errorLm.textContent = message;
    }
  }

  setUsernameError(message) {
    this.setError(message, this.lms.usernameErrorLm, this.lms.usernameInputLm);
  }

  setEmailError(message) {
    this.setError(message, this.lms.emailErrorLm, this.lms.emailInputLm);
  }

  setPasswordError(message) {
    this.setError(message, this.lms.passwordErrorLm, this.lms.passwordInputLm);
  }

  setRepeatedPasswordError(message) {
    this.setError(message, this.lms.confirmPasswordErrorLm, this.lms.repeatPasswordInputLm);
  }

  renderErrorMessages(errors = {}) {
    this.setUsernameError(errors.username);
    this.setEmailError(errors.email);
    this.setPasswordError(errors.password);
    this.setRepeatedPasswordError(errors.repeated_password);
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
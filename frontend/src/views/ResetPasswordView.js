export default class ResetPasswordView {
  constructor() {
    this.lms = {
      formLm: document.getElementById('reset-password-form'),
      passwordErrorLm: document.getElementById('reset-password-form__password-error'),
      repeatedPasswordErrorLm: document.getElementById('reset-password-form__repeated-password-error'),
      repeatedPasswordInputLm: document.getElementById('reset-password-form__repeated-password-input'),
      passwordInputLm: document.getElementById('reset-password-form__password-input'),
      formErrorLm: document.getElementById('reset-password-form__error'),
      submitBtn: document.getElementById('reset-password-form__submit-btn')
    }
    this.lms.formInputLms = this.lms.formLm.querySelectorAll('input');
  }

  getDomRefs() {
    return this.lms;
  }

  setError(message, errorLm, inputLm) {
    if (!message) {
      inputLm.classList.remove('error');
      errorLm.textContent = '';
      errorLm.classList.remove('active');
    } 
    else {
      inputLm.classList.add('error');
      errorLm.textContent = message;
      errorLm.classList.add('active');
    }
  }

  setPasswordError(message) {
    this.setError(message, this.lms.passwordErrorLm, this.lms.passwordInputLm);
  }

  setRepeatedPasswordError(message) {
    this.setError(message, this.lms.repeatedPasswordErrorLm, this.lms.repeatedPasswordInputLm);
  }

  renderErrorMessages(errors = {}) {
    this.setPasswordError(errors.password);
    this.setRepeatedPasswordError(errors.repeated_password);
  }

  toggleSubmitBtn(errors) {
    const isValid = Object.values(errors).every(error => error === false);
    this.lms.submitBtn.disabled = !isValid;
  }

  updateSubmitBtn(text) {
    this.lms.submitBtn.innerText = text;
  }

  updateErrorMessage(error) {
    if (error) {
      this.lms.formErrorLm.textContent = error;
      this.lms.formErrorLm.classList.add('active');
    }
    else {
      this.lms.formErrorLm.textContent = '';
      this.lms.formErrorLm.classList.remove('active');
    }
  }
}
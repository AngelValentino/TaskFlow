export default class LoginView {
  constructor() {
    this.lms = {
      loginFormLm: document.getElementById('login-form'),
      loginErrorLm: document.getElementById('login-form__error'),
      submitBtn: document.getElementById('login-form__submit-btn')
    };
    this.lms.loginFormInputLms = this.lms.loginFormLm.querySelectorAll('input');
  }

  getDomRefs() {
    return this.lms;
  }

  updateErrorMessage(error) {
    this.lms.loginErrorLm.textContent = error;
  }

  toggleSubmitBtn(errors) {
    const isValid = Object.values(errors).every(error => error === false);
    this.lms.submitBtn.disabled = !isValid;
  }

  updateSubmitBtn(text) {
    this.lms.submitBtn.innerText = text;
  }
}
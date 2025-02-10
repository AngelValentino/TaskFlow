export default class LoginView {
  constructor() {
    this.lms = {
      loginFormLm: document.getElementById('login-form'),
      loginErrorLm: document.getElementById('login-error'),
      submitBtn: document.getElementById('login-form__submit-btn')
    };
  }

  getDomRefs() {
    return this.lms;
  }

  updateErrorMessage(error) {
    this.lms.loginErrorLm.textContent = error;
  }

  updateSubmitBtn(text) {
    this.lms.submitBtn.innerText = text;
  }
}
export default class RegisterView {
  constructor() {
    this.lms = {
      registerFormLm: document.getElementById('register-form'),
      usernameErrorLm: document.getElementById('username-error'),
      emailErrorLm: document.getElementById('email-error'),
      passwordErrorLm: document.getElementById('password-error'),
      submitBtn: document.getElementById('register-form__submit-btn')
    };
  }

  getRegisterLms() {
    return this.lms;
  }

  clearErrorMessages(errors = {}) {
    this.lms.usernameErrorLm.textContent = errors?.username || '';
    this.lms.emailErrorLm.textContent = errors?.email || '';
    this.lms.passwordErrorLm.textContent = errors?.password || '';
  }

  updateSubmitBtn(text) {
    this.lms.submitBtn.innerText = text;
  }
}
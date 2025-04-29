export default class LoginView {
  constructor(authFormHandler) {
    this.authFormHandler = authFormHandler;
    this.lms = {
      formLm: document.getElementById('login-form'),
      formErrorLm: document.getElementById('login-form__error'),
      submitBtn: document.getElementById('login-form__submit-btn'),
      togglePasswordBtn: document.getElementById('auth-form__toggle-password-btn'),
      passwordInputLm: document.getElementById('login-form__password-input')
    };
    this.lms.loginFormInputLms = this.lms.formLm.querySelectorAll('input');
  }

  getDomRefs() {
    return this.lms;
  }

  updateErrorMessage(error) {
    this.authFormHandler.updateFormMessage(this.lms.formErrorLm, error);
  }

  toggleSubmitBtn(errors) {
    const isValid = Object.values(errors).every(error => error === false);
    this.lms.submitBtn.disabled = !isValid;
  }

  updateSubmitBtn(text) {
    this.lms.submitBtn.innerText = text;
  }
}
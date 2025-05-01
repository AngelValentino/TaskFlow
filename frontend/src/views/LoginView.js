export default class LoginView {
  constructor(authFormHandler) {
    this.authFormHandler = authFormHandler;
    this.lms = {
      formLm: document.getElementById('login-form'),
      formErrorLm: document.getElementById('login-form__error'),
      submitBtn: document.getElementById('auth-form__submit-btn'),
      submitBtnText: document.getElementById('auth-form__submit-btn-text'),
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
}
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
    if (error) {
      this.lms.loginErrorLm.textContent = error;
      this.lms.loginErrorLm.classList.add('active');
    }
    else {
      this.lms.loginErrorLm.textContent = '';
      this.lms.loginErrorLm.classList.remove('active');
    }
  }

  toggleSubmitBtn(errors) {
    const isValid = Object.values(errors).every(error => error === false);
    this.lms.submitBtn.disabled = !isValid;
  }

  updateSubmitBtn(text) {
    this.lms.submitBtn.innerText = text;
  }
}
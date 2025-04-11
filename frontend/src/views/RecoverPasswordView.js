export default class RecoverPasswordView {
  constructor() {
    this.lms = {
      recoverPasswordFormLm: document.getElementById('recover-password-form'),
      emailInputLm: document.getElementById('recover-password-form__email-input'),
      recoverPasswordErrorLm: document.getElementById('recover-password-form__error'),
      recoverPasswordMessageLm: document.getElementById('recover-password-form__message'),
      submitBtn: document.getElementById('recover-password-form__submit-btn')
    };
  }

  getDomRefs() {
    return this.lms;
  }

  getEmailValue() {
    return this.lms.emailInputLm.value.trim();
  }

  updateErrorMessage(error) {
    if (error) {
      this.lms.recoverPasswordErrorLm.textContent = error;
      this.lms.recoverPasswordErrorLm.classList.add('active');
    }
    else {
      this.lms.recoverPasswordErrorLm.textContent = '';
      this.lms.recoverPasswordErrorLm.classList.remove('active');
    }
  }

  updateMessage(message) {
    if (message) {
      this.lms.recoverPasswordMessageLm.textContent = message;
      this.lms.recoverPasswordMessageLm.classList.add('active');
    }
    else {
      this.lms.recoverPasswordMessageLm.textContent = '';
      this.lms.recoverPasswordMessageLm.classList.remove('active');
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
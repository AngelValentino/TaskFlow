export default class ResetPasswordController {
  constructor(resetPasswordView, resetPasswordModel, utils, router) {
    this.resetPasswordView = resetPasswordView;
    this.resetPasswordModel = resetPasswordModel;
    this.utils = utils;
    this.router = router;
    this.activeRequest = false;

    this.errors = {
      password: null,
      repeated_password: null
    };

    this.wasBlurred = {
      password: false,
      repeated_password: false
    };

    this.lms = this.resetPasswordView.getDomRefs();
    this.lms.formLm.addEventListener('submit', this.resetUserPassword.bind(this));
    this.lms.formLm.addEventListener('blur', this.handleValidationOnBlur.bind(this), true);
    this.addValidationEventOnInputChange()
  }

  handleValidationOnBlur(e) {
    if (e.target.tagName !== 'INPUT') return;
    this.wasBlurred[e.target.name] = true;
    this.handleValidation(e);
  }

  addValidationEventOnInputChange() {
    this.lms.formInputLms.forEach(input => {
      input.addEventListener('input', e => {
        // Only validate if input has been blurred before
        if (this.wasBlurred[e.target.name]) {
          this.handleValidation(e);
        }

        if (e.target.name === 'terms') {
          console.log('terms')
          this.handleValidation(e)
        }
      });
    });
  }

  getPasswordValidationError(password) {
    if (password.length <= 0) {
      return 'Password is required.';
    }
    else if (password.length < 8) {
      return 'Password must be at least 8 characters long.';
    }
    else if (password.length > 72) {
      return 'Password cannot exceed 72 characters.';
    }

    return false;
  }

  getRepeatedPasswordValidationError(repeatedPassword) {
    if (repeatedPassword.length <= 0 && this.errors.repeated_password !== null) {
      return 'You must confirm your password';
    }
    else if (repeatedPassword !== this.lms.passwordInputLm.value && this.errors.repeated_password !== null) {
      return 'The passwords entered do not match.';
    }
    
    return false;
  }

  handleValidation(e) {
    if (e.target.tagName !== 'INPUT') return;

    const input = e.target;
    const value = input.value.trim();

    switch (input.name) {
      case 'password':
        this.errors.password = this.getPasswordValidationError(value);
        this.errors.repeated_password = this.getRepeatedPasswordValidationError(this.lms.repeatedPasswordInputLm.value);
        break;

      case 'repeated_password':
        console.log('repeated password validation')
        this.errors.repeated_password = this.getRepeatedPasswordValidationError(value);
        break
    }

    this.resetPasswordView.renderErrorMessages(this.errors);
    this.resetPasswordView.toggleSubmitBtn(this.errors);
  }

  resetUserPassword(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const registerData = {};
    let wasFetchAborted = false;

    formData.forEach((value, key) => {
      registerData[key] = value;
    });
    const params = new URLSearchParams(window.location.search);
    registerData.token = params.get('token');

    if (this.activeRequest) {
      console.warn('register request is already active');
      return;
    }

    this.activeRequest = true;
    const loadingTimId = this.utils.handleLoading(
      this.resetPasswordView.updateSubmitBtn.bind(this.resetPasswordView, 'Loading...')
    );

    
    this.resetPasswordModel.handleResetUserPassword(JSON.stringify(registerData))
      .then(() => {
        this.router.navigateTo('/login');
      })
      .catch(error => {
        if (error.name === 'AbortError') {
          wasFetchAborted = true;
          console.warn('Request aborted due to navigation change');
          return;
        }

        if (error.data) {
          console.error(error.data.errors);
          this.resetPasswordView.updateErrorMessage('');
          this.resetPasswordView.renderErrorMessages(error.data.errors);
        } 
        else {
          this.resetPasswordView.renderErrorMessages();
          this.resetPasswordView.updateErrorMessage(error.message);
        }

        console.error(error);
      })
      .finally(() => {
        clearTimeout(loadingTimId);
        this.activeRequest = false;
        if (wasFetchAborted) return;
        this.resetPasswordView.updateSubmitBtn('Reset password');
      });
  }
}
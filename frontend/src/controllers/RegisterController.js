export default class RegisterController {
  constructor(router, userModel, registerView) {
    this.router = router;
    this.userModel = userModel
    this.registerView = registerView;

    this.errors = {
      username: null,
      email: null,
      password: null,
      repeated_password: null,
      terms: null
    };

    // Track if each field has been blurred at least once
    this.wasBlurred = {
      username: false,
      email: false,
      password: false,
      repeated_password: false
    };
    
    this.lms = this.registerView.getDomRefs();

    this.lms.registerFormLm.addEventListener('submit', this.registerUser.bind(this));
    this.lms.registerFormLm.addEventListener('blur', this.handleValidationOnBlur.bind(this), true);
    this.addValidatonEventOnInputChange();
  }

  handleValidationOnBlur(e) {
    if (e.target.tagName !== 'INPUT') return;
    this.wasBlurred[e.target.name] = true;
    this.handleValidation(e);
  }

  addValidatonEventOnInputChange() {
    this.lms.registerFormInputLms.forEach(input => {
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

  getUsernameValidationError(username) {
    if (username.length <= 0) {
      return 'Username is required.';
    }
    else if (username.length > 20) {
      return 'Username cannot exceed 20 characters.';
    }

    return false;
  }

  getEmailValidationError(email) {
    if (email.length <= 0) {
      return 'Email address is required.';
    }
    else if (email.length > 255) {
      return 'Email cannot exceed 255 characters.';
    }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return 'Enter a valid email address.';
    }

    return false;
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

  getTermsValidationError(termsCheckbox) {
    if (!termsCheckbox.checked) {
      return 'You must accept terms and conditions in order to register.';
    }

    return false;
  }

  handleValidation(e) {
    if (e.target.tagName !== 'INPUT') return;

    const input = e.target;
    const value = input.value.trim();

    switch (input.name) {
      case 'username':
        this.errors.username = this.getUsernameValidationError(value);
        break;

      case 'email':
        this.errors.email = this.getEmailValidationError(value);
        break;

      case 'password':
        this.errors.password = this.getPasswordValidationError(value);
        this.errors.repeated_password = this.getRepeatedPasswordValidationError(this.lms.repeatPasswordInputLm.value);
        break;

      case 'repeated_password':
        console.log('repeated password validation')
        this.errors.repeated_password = this.getRepeatedPasswordValidationError(value);
        break

      case 'terms':
        this.errors.terms = this.getTermsValidationError(e.target);
    }

    this.registerView.renderErrorMessages(this.errors);
    this.registerView.toggleSubmitBtn(this.errors);
  }

  registerUser(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const registerData = {};
    let wasFetchAborted = false;

    formData.forEach((value, key) => {
      registerData[key] = value;
    });

    this.registerView.updateSubmitBtn('Loading...');

    this.userModel.handleUserRegistration(JSON.stringify(registerData))
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
          this.registerView.renderErrorMessages(error.data.errors);
        } 
        else {
          this.registerView.renderGeneralErrorMessage(error.message);
        }

        console.error(error);
      })
      .finally(() => {
        if (wasFetchAborted) return;
        this.registerView.updateSubmitBtn('Register');
      });
  }
}
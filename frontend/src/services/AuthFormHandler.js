export default class AuthFormHandler {
  addValidationEventOnInputChange(
    formInputLms, 
    errors, 
    wasBlurred,
    confirmPasswordInputLm, 
    passwordInputLm,
    renderErrorMessages,
    toggleSubmitBtn
  ) {
    formInputLms.forEach(input => {
      input.addEventListener('input', e => {
        // Only validate if input has been blurred before
        if (wasBlurred[e.target.name]) {
          this.handleAuthFormValidation(e, errors, confirmPasswordInputLm, passwordInputLm, renderErrorMessages, toggleSubmitBtn);
        }

        if (e.target.name === 'terms') {
          console.log('terms')
          this.handleAuthFormValidation(e, errors, confirmPasswordInputLm, passwordInputLm, renderErrorMessages, toggleSubmitBtn);
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

  getRepeatedPasswordValidationError(repeatedPassword, password, confirmPasswordError) {
    if (repeatedPassword.length <= 0 && confirmPasswordError !== null) {
      return 'You must confirm your password';
    }
    else if (repeatedPassword !== password && confirmPasswordError !== null) {
      return 'The passwords entered do not match.';
    }
    if (confirmPasswordError === null) {
      return null;
    }
    
    return false;
  }

  getTermsValidationError(termsCheckbox) {
    if (!termsCheckbox.checked) {
      return 'You must accept terms and conditions in order to register.';
    }

    return false;
  }

  handleAuthFormValidation(e, errors, confirmPasswordInputLm, passwordInputLm, renderErrorMessages, toggleSubmitBtn) {
    if (e.target.tagName !== 'INPUT') return;

    const input = e.target;
    const value = input.value.trim();

    switch (input.name) {
      case 'username':
        errors.username = this.getUsernameValidationError(value);
        break;

      case 'email':
        errors.email = this.getEmailValidationError(value);
        break;

      case 'password':
        errors.password = this.getPasswordValidationError(value);
        errors.repeated_password = this.getRepeatedPasswordValidationError(confirmPasswordInputLm.value, passwordInputLm.value, errors.repeated_password);
        break;

      case 'repeated_password':
        errors.repeated_password = this.getRepeatedPasswordValidationError(value, passwordInputLm.value);
        break

      case 'terms':
        errors.terms = this.getTermsValidationError(e.target);
    }

    console.log(errors)

    renderErrorMessages(errors);
    toggleSubmitBtn(errors);
  }

  handleAuthValidationOnBlur(
    e,
    errors,
    wasBlurred,
    confirmPasswordInputLm,
    passwordInputLm,
    renderErrorMessages,
    toggleSubmitBtn
  ) {
    if (e.target.tagName !== 'INPUT') return;
    wasBlurred[e.target.name] = true;

    this.handleAuthFormValidation(
      e,
      errors,
      confirmPasswordInputLm,
      passwordInputLm,
      renderErrorMessages,
      toggleSubmitBtn
    )
  }

  updateFormMessage(messageLm, message) {
    if (message) {
      messageLm.textContent = message;
      messageLm.classList.add('active');
    }
    else {
      messageLm.textContent = '';
      messageLm.classList.remove('active');
    }
  }

  setFormError(message, errorLm, inputLm) {
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
}
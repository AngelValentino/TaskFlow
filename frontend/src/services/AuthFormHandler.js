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

  togglePassword(inputElement, toggleButton) {
    inputElement.type = inputElement.type === 'password' ? 'text' : 'password';
  
    toggleButton.innerHTML = inputElement.type === 'password' 
      ? `   
        <svg aria-hidden="true" role="presentation" focusable="false" class="auth-form__toggle-password-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path fill="currentColor" d="M11.83 9L15 12.16V12a3 3 0 0 0-3-3zm-4.3.8l1.55 1.55c-.05.21-.08.42-.08.65a3 3 0 0 0 3 3c.22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53a5 5 0 0 1-5-5c0-.79.2-1.53.53-2.2M2 4.27l2.28 2.28l.45.45C3.08 8.3 1.78 10 1 12c1.73 4.39 6 7.5 11 7.5c1.55 0 3.03-.3 4.38-.84l.43.42L19.73 22L21 20.73L3.27 3M12 7a5 5 0 0 1 5 5c0 .64-.13 1.26-.36 1.82l2.93 2.93c1.5-1.25 2.7-2.89 3.43-4.75c-1.73-4.39-6-7.5-11-7.5c-1.4 0-2.74.25-4 .7l2.17 2.15C10.74 7.13 11.35 7 12 7" />
        </svg>
      `
      : `
        <svg aria-hidden="true" role="presentation" focusable="false" class="auth-form__toggle-password-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path fill="currentColor" d="M12 9a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3m0 8a5 5 0 0 1-5-5a5 5 0 0 1 5-5a5 5 0 0 1 5 5a5 5 0 0 1-5 5m0-12.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5" />
        </svg>
      `;
    
    toggleButton.setAttribute('aria-label', inputElement.type === 'password' ? 'Show password.' : 'Hide password');
    toggleButton.title = inputElement.type === 'password' ? 'Show password' : 'Hide password';
  }

  handlePasswordToggle(passwordInputLms) {    
    passwordInputLms.forEach(input => {
      this.togglePassword(input, input.nextElementSibling);
    });
  }
}
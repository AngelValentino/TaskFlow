import AuthFormSubmitBtn from "../../../components/AuthFormSubmitBtn.js";

export default class RegisterUserForm {
  static getHtml() {
    const authFormSubmitBtn = AuthFormSubmitBtn.getHtml({ btnText: 'Register' });

    return `
      <form id="register-form" class="register-form">
        <p class="register-form__welcome-message">Welcome to TaskFlow! Ready to take your productivity to the next level? Sign up to start organizing, planning, and accomplishing your goals one task at a time.</p>
        <div class="register-form__input-label-container">
          <label class="register-form__username-label auth-form__label" for="register-form__username-input">Username</label>
          <div class="register-form__input-error-container">
            <input required placeholder="Up to 20 characters" autocomplete="username" class="register-form__username-input auth-form__input" id="register-form__username-input" type="text" name="username">
            <p id="username-error" class="register-form__input-error-message"></p>
          </div>
        </div>
        <div class="register-form__input-label-container">
          <label class="register-form__email-label auth-form__label" for="register-form__email-input">Email address</label>
          <div class="register-form__input-error-container">
            <input required placeholder="Email address" autocomplete="email" class="register-form__email-input auth-form__input" id="register-form__email-input" type="email" name="email">
            <p id="email-error" class="register-form__input-error-message"></p>  
          </div>
        </div>
        <div class="register-form__input-label-container">
          <label class="register-form__password-label auth-form__label" for="register-form__password-input">Password</label>
          <div class="register-form__input-error-container">
            <div class="auth-form__toggle-input-container">
              <input required placeholder="At least 8 characters" class="register-form__password-input auth-form__input toggle" id="register-form__password-input" type="password" name="password" autocomplete="new-password">
              <button type="button" title="Show password" aria-label="Show password." class="auth-form__toggle-password-btn">
                <svg aria-hidden="true" role="presentation" focusable="false" class="auth-form__toggle-password-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M11.83 9L15 12.16V12a3 3 0 0 0-3-3zm-4.3.8l1.55 1.55c-.05.21-.08.42-.08.65a3 3 0 0 0 3 3c.22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53a5 5 0 0 1-5-5c0-.79.2-1.53.53-2.2M2 4.27l2.28 2.28l.45.45C3.08 8.3 1.78 10 1 12c1.73 4.39 6 7.5 11 7.5c1.55 0 3.03-.3 4.38-.84l.43.42L19.73 22L21 20.73L3.27 3M12 7a5 5 0 0 1 5 5c0 .64-.13 1.26-.36 1.82l2.93 2.93c1.5-1.25 2.7-2.89 3.43-4.75c-1.73-4.39-6-7.5-11-7.5c-1.4 0-2.74.25-4 .7l2.17 2.15C10.74 7.13 11.35 7 12 7" />
                </svg>
              </button>
            </div>
            <p id="password-error" class="register-form__input-error-message"></p>
          </div>
        </div>
        <div class="register-form__input-label-container">
          <label class="register-form__repeat-password-label auth-form__label" for="register-form__confirm-password-input">Confirm password</label>
          <div class="register-form__input-error-container">
            <div class="auth-form__toggle-input-container">
              <input required placeholder="At least 8 characters" class="register-form__confirm-password-input auth-form__input toggle" id="register-form__confirm-password-input" type="password" name="repeated_password" autocomplete="new-password">
              <button type="button" title="Show password" aria-label="Show password." class="auth-form__toggle-password-btn">
                <svg aria-hidden="true" role="presentation" focusable="false" class="auth-form__toggle-password-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M11.83 9L15 12.16V12a3 3 0 0 0-3-3zm-4.3.8l1.55 1.55c-.05.21-.08.42-.08.65a3 3 0 0 0 3 3c.22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53a5 5 0 0 1-5-5c0-.79.2-1.53.53-2.2M2 4.27l2.28 2.28l.45.45C3.08 8.3 1.78 10 1 12c1.73 4.39 6 7.5 11 7.5c1.55 0 3.03-.3 4.38-.84l.43.42L19.73 22L21 20.73L3.27 3M12 7a5 5 0 0 1 5 5c0 .64-.13 1.26-.36 1.82l2.93 2.93c1.5-1.25 2.7-2.89 3.43-4.75c-1.73-4.39-6-7.5-11-7.5c-1.4 0-2.74.25-4 .7l2.17 2.15C10.74 7.13 11.35 7 12 7" />
                </svg>
              </button>
            </div>
            <p id="confirm-password-error" class="register-form__input-error-message"></p>
          </div>
        </div>
        <div class="register-form__terms-and-conditions">
          <input required name="terms" id="register-form__terms-and-conditions-checkbox" type="checkbox"></input>
          <label for="register-form__terms-and-conditions-checkbox">
            I acknowledge and accept the terms and conditions of the <a class="register-form__terms-and-conditions-link slide-in-and-out underline no-wrap fixed-height" href="assets/documents/taskflow-terms-and-conditions.pdf" download>TaskFlow Account Agreement</a> and agree to the <a class="register-form__terms-and-conditions-link slide-in-and-out underline no-wrap fixed-height" href="assets/documents/taskflow-terms-and-conditions.pdf" download>privacy policy</a>. I understand that creating an account constitutes acceptance of these terms.
          </label>
        </div>
        <p id="register-form__general-error" class="register-form__general-error"></p>
        <div class="register-form__submit-btn-container">
          ${authFormSubmitBtn}
        </div>
      </form>
    `;
  }
}
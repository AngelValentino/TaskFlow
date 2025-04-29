export default class LoginUserForm {
  static getHtml() {
    return `
      <form id="login-form" class="auth-form">
        <div class="auth-form__inputs-container">
          <h2 class="auth-form__welcome-message">Welcome back again to endless productivity!</h2>
          <label class="auth-form__email-label auth-form__label" for="login-form__email-input">Email</label>
          <input required placeholder="Email address" autocomplete="email" class="auth-form__email-input auth-form__input" id="login-form__email-input" type="email" name="email">
          <label class="auth-form__password-label auth-form__label" for="login-form__password-input">Password</label>
          <div class="auth-form__toggle-input-container">
            <input required placeholder="Password" class="auth-form__password-input auth-form__input toggle" id="login-form__password-input" type="password" name="password" autocomplete="current-password">
            <button type="button" title="Show password" aria-label="Show password." class="auth-form__toggle-password-btn" id="auth-form__toggle-password-btn">
              <svg aria-hidden="true" role="presentation" focusable="false" class="auth-form__toggle-password-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path fill="currentColor" d="M11.83 9L15 12.16V12a3 3 0 0 0-3-3zm-4.3.8l1.55 1.55c-.05.21-.08.42-.08.65a3 3 0 0 0 3 3c.22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53a5 5 0 0 1-5-5c0-.79.2-1.53.53-2.2M2 4.27l2.28 2.28l.45.45C3.08 8.3 1.78 10 1 12c1.73 4.39 6 7.5 11 7.5c1.55 0 3.03-.3 4.38-.84l.43.42L19.73 22L21 20.73L3.27 3M12 7a5 5 0 0 1 5 5c0 .64-.13 1.26-.36 1.82l2.93 2.93c1.5-1.25 2.7-2.89 3.43-4.75c-1.73-4.39-6-7.5-11-7.5c-1.4 0-2.74.25-4 .7l2.17 2.15C10.74 7.13 11.35 7 12 7" />
              </svg>
            </button>
          </div>
        </div>
        <p id="login-form__error" class="auth-form__error"></p>  
        <div class="auth-form__submit-btn-container">
          <button id="login-form__submit-btn" class="auth-form__submit-btn" type="submit" disabled>log in</button>
        </div>
      </form>
    `;
  }
}
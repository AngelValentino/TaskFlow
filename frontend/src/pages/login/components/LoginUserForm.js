export default class LoginUserForm {
  static getHtml() {
    return `
      <form id="login-form" class="auth-form">
        <div class="auth-form__inputs-container">
          <h2 class="auth-form__welcome-message">Welcome back again to endless productivity!</h2>
          <label class="auth-form__email-label auth-form__label" for="login-form__email-input">Email</label>
          <input required placeholder="Email address" autocomplete="email" class="auth-form__email-input auth-form__input" id="login-form__email-input" type="email" name="email">
          <label class="auth-form__password-label auth-form__label" for="login-form__password-input">Password</label>
          <input required placeholder="Password" class="auth-form__password-input auth-form__input" id="login-form__password-input" type="password" name="password" autocomplete="current-password">
        </div>
        <p id="login-form__error" class="auth-form__error"></p>  
        <div class="auth-form__submit-btn-container">
          <button id="login-form__submit-btn" class="auth-form__submit-btn" type="submit" disabled>log in</button>
        </div>
      </form>
    `;
  }
}
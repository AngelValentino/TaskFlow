export default class ResetPasswordForm {
  static getHtml() {
    return `
      <form id="reset-password-form" class="auth-form">
        <div class="auth-form__inputs-container">
          <h2 class="auth-form__welcome-message">Reset your TaskFlow account password</h2>
          <label class="auth-form__password-label" for="login-form__password-input">Password</label>
          <input required placeholder="At least 8 characters" class="auth-form__password-input" id="reset-password-form__password-input" type="password" name="password" autocomplete="current-password">
          <label class="auth-form__password-label" for="login-form__password-input">Confirm password</label>
          <input required placeholder="At least 8 characters" class="auth-form__password-input" id="reset-password-form__password-input" type="password" name="confirm_password" autocomplete="current-password">
        </div>
        <p id="reset-password-form__error" class="auth-form__error"></p>  
        <div class="auth-form__submit-btn-container">
          <button id="reset-password-form__submit-btn" class="auth-form__submit-btn" type="submit" disabled>Reset password</button>
        </div>
      </form>
    `;
  }
}
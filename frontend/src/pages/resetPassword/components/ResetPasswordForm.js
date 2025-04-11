export default class ResetPasswordForm {
  static getHtml() {
    return `
      <form id="reset-password-form" class="auth-form">
        <div class="auth-form__inputs-container">
          <h2 class="auth-form__welcome-message">Reset your TaskFlow account password</h2>
          <label class="auth-form__password-label" for="reset-password-form__password-input">Password</label>
          <input required placeholder="At least 8 characters" class="auth-form__password-input auth-form__input" id="reset-password-form__password-input" type="password" name="password" autocomplete="current-password">
          <p id="reset-password-form__password-error" class="auth-form__input-error"></p>  
          <label class="auth-form__password-label" for="reset-password-form__repeated-password-input">Confirm password</label>
          <input required placeholder="At least 8 characters" class="auth-form__password-input auth-form__input" id="reset-password-form__repeated-password-input" type="password" name="repeated_password" autocomplete="current-password">
          <p id="reset-password-form__repeated-password-error" class="auth-form__input-error"></p>  
        </div>
        <p id="reset-password-form__error" class="auth-form__error"></p>  
        <div class="auth-form__submit-btn-container">
          <button id="reset-password-form__submit-btn" class="auth-form__submit-btn" type="submit" disabled>Reset password</button>
        </div>
      </form>
    `;
  }
}
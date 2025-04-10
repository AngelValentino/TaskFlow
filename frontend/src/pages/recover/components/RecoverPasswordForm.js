export default class RecoverPasswordForm {
  static getHtml() {
    return `
      <form id="recover-password-form" class="auth-form">
        <div class="auth-form__inputs-container">
          <h2 class="auth-form__welcome-message">Remember your TaskFlow account password</h2>
          <label class="auth-form__email-label" for="login-form__email-input">Email</label>
          <input required placeholder="Email address" autocomplete="email" class="auth-form__email-input" id="recover-password-form__email-input" type="email" name="email">
        </div>
        <p id="recover-password-form__error" class="auth-form__error"></p>  
        <div class="auth-form__submit-btn-container">
          <button id="recover-password-form__submit-btn" class="auth-form__submit-btn" type="submit" disabled>Send email</button>
        </div>
      </form>
    `;
  }
}
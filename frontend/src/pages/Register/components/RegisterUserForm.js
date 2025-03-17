export default class RegisterUserForm {
  static getHtml() {
    return `
      <div class="register-view-container">
        <h1 class="register-view-title">Create a TaskFlow account</h1>
        <form id="register-form" class="register-form">
          <p class="register-form__welcome-message">Welcome to TaskFlow! Ready to take your productivity to the next level? Sign up to start organizing, planning, and accomplishing your goals one task at a time.</p>
        
          <div class="register-form__input-label-container">
            <label class="register-form__username-label" for="register-form__username-input">Username</label>
            <div class="register-form__input-container">
              <input required placeholder="Up to 20 characters" autocomplete="username" class="register-form__username-input" id="register-form__username-input" type="text" name="username">
              <p id="username-error" class="register-form__input-error-message"></p>
            </div>
          </div>

          <div class="register-form__input-label-container">
            <label class="register-form__email-label" for="register-form__email-input">Email address</label>
            <div class="register-form__input-container">
              <input required placeholder="Email address" autocomplete="email" class="register-form__email-input" id="register-form__email-input" type="email" name="email">
              <p id="email-error" class="register-form__input-error-message"></p>  
            </div>
          </div>

          <div class="register-form__input-label-container">
            <label class="register-form__password-label" for="register-form__password-input">Password</label>
            <div class="register-form__input-container">
              <input required placeholder="At least 8 characters" class="register-form__password-input" id="register-form__password-input" type="password" name="password" autocomplete="new-password">
              <p id="password-error" class="register-form__input-error-message"></p>
            </div>
          </div>

          <div class="register-form__input-label-container">
            <label class="register-form__repeat-password-label" for="register-form__repeat-password-input">Confirm password</label>
            <div class="register-form__input-container">
              <input required placeholder="At least 8 characters" class="register-form__repeat-password-input" id="register-form__repeat-password-input" type="password" name="repeated_password" autocomplete="new-password">
              <p id="confirm-password-error" class="register-form__input-error-message"></p>
            </div>
          </div>

          <div class="register-form__terms-and-conditions">
            <input required name="terms" id="register-form__terms-and-conditions-checkbox" type="checkbox"></input>
            <label for="register-form__terms-and-conditions-checkbox">
              I acknowledge and accept the terms and conditions of the TaskFlow Account Agreement and agree to the privacy policy. I understand that creating an account constitutes acceptance of these terms.
            </lablel>
          </div>

          <p id="register-form__general-error" class="register-form__general-error"></p>

          <div class="register-form__submit-btn-container">
            <button id="register-form__submit-btn" class="register-form__submit-btn" type="submit" disabled>Register</button>
          </div>
        </form>
        <div class="login-account-container">
          <p class="login-account-message">Already have an account?</p>
          <a href="/login" class="login-account-link" data-link>Log into your TaskFlow account</a>
        </div>
      </div>
    `;
  }
}
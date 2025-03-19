export default class LoginUserForm {
  static getHtml() {
    return `
      <div class="login-view-container">
        <h1 class="login-view-title">TaskFlow Account</h1>
        <form id="login-form" class="login-form">
          <div class="login-form__inputs-container">
            <h2 class="login-form__welcome-message">Welcome back again to endless productivity!</h2>
            <label class="login-form__email-label" for="login-form__email-input">Email</label>
            <input placeholder="Email address" autocomplete="email" class="login-form__email-input" id="login-form__email-input" type="email" name="email">
            <label class="login-form__password-label" for="login-form__password-input">Password</label>
            <input placeholder="Password" class="login-form__password-input" id="login-form__password-input" type="password" name="password" autocomplete="current-password">
          </div>
          <p id="login-form__error" class="login-form__error"></p>  
          <div class="login-form__submit-btn-container">
            <button id="login-form__submit-btn" class="login-form__submit-btn" type="submit" disabled>log in</button>
          </div>
        </form>
        <div class="create-new-account-container">
          <p class="create-new-account-message">Don't have an account?</p>
          <a href="/register" class="create-new-account-link" data-link>Create a TaskFlow Account</a>
        </div>
      </div>
    `;
  }
}
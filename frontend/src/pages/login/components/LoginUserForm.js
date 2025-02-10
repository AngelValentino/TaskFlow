export default class LoginUserForm {
  static getHtml() {
    return `
      <form id="login-form" class="login-form">
        <label class="login-form__email-label" for="login-form__email-input">Email</label>
        <input autocomplete="email" class="login-form__email-input" id="login-form__email-input" type="email" name="email">

        <label class="login-form__password-label" for="login-form__password-input">Password</label>
        <input class="login-form__password-input" id="login-form__password-input" type="password" name="password">

        <div id="login-error" class="error-message"></div>  
        
        <button id="login-form__submit-btn" class="login-form__submit-btn" type="submit">login</button
      </form>
    `;
  }
}
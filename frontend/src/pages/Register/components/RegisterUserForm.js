export default class RegisterUserForm {
  static getHtml() {
    return `
      <form id="register-form" class="register-form">
        <label class="register-form__username-label" for="register-form__username-input">Username</label>
        <input autocomplete="username" class="register-form__username-input" id="register-form__username-input" type="text" name="username">
        <div id="username-error" class="error-message"></div>

        <label class="register-form__email-label" for="register-form__email-input">Email</label>
        <input autocomplete="email" class="register-form__email-input" id="register-form__email-input" type="email" name="email">
        <div id="email-error" class="error-message"></div>  

        <label class="register-form__password-label" for="register-form__password-input">Password</label>
        <input class="register-form__password-input" id="register-form__password-input" type="password" name="password">
        <div id="password-error" class="error-message"></div>

        <label class="register-form__repeat-password-label" for="register-form__repeat-password-input">Repeat password</label>
        <input class="register-form__repeat-password-input" id="register-form__repeat-password-input" type="password" name="repeated-password">

        <button id="register-form__submit-btn" class="register-form__submit-btn" type="submit">Register</button
      </form>
    `;
  }
}
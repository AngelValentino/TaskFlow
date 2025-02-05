import AbstractView from "./AbstractView.js";
import Header from "../components/Header.js";

export default class RegisterView extends AbstractView {
  constructor() {
    super();
  }

  async getHtml() {
    const header = new Header().getHtml();
    
    return `
      ${header}
      <main>
        <form id="register-form" class="register-form">
          <label class="register-form__username-label" for="register-form__username-input">Username</label>
          <input class="register-form__username-input" id="register-form__username-input" type="text" name="username">
        
          <label class="register-form__email-label" for="register-form__email-input">Email</label>
          <input class="register-form__email-input" id="register-form__email-input" type="email" name="email">
            
          <label class="register-form__password-label" for="register-form__password-input">Password</label>
          <input class="register-form__password-input" id="register-form__password-input" type="password" name="password">

          <button class="register-form__submit-btn" type="submit">Register</button
        </form>

        <div id="response-message"></div>
      </main>
    `;
  }
}
import Header from "../../layouts/Header.js";
import RegisterUserForm from "./components/RegisterUserForm.js";

export default class RegisterPage {
  static getHtml() {
    const header = Header.getHtml({ returnBackHome: true });
    const registerUserForm = RegisterUserForm.getHtml();

    return `
      ${header}
      <main class="register-view">
        ${registerUserForm}
      </main>
    `;
  }
}
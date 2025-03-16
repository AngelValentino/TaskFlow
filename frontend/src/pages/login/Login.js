import Header from "../../layouts/Header.js";
import LoginUserForm from "./components/LoginUserForm.js";

export default class LoginPage {
  static getHtml() {
    const header = Header.getHtml();
    const loginUserForm = LoginUserForm.getHtml();

    return `
      ${header}
      <main class="login-view">
        ${loginUserForm}
      </main>
    `;
  }
}
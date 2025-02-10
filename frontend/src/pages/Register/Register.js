import Header from "../../layouts/Header.js";
import RegisterUserForm from "./components/RegisterUserForm.js";

export default class RegisterPage {
  static getHtml() {
    const header = Header.getHtml();
    const registerUserForm = RegisterUserForm.getHtml();

    return `
      ${header}
      <main>
        ${registerUserForm}
      </main>
    `;
  }
}
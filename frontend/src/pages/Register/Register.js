import Header from "../../layouts/Header.js";
import RegisterUserForm from "./components/RegisterUserForm.js";
import AuthRedirect from "../../components/AuthRedirect.js";
import '../../styles/register.css';

export default class RegisterPage {
  static getHtml() {
    const header = Header.getHtml({ returnBackHome: true });
    const registerUserForm = RegisterUserForm.getHtml();
    const authRedirect = AuthRedirect.getHtml({
      message: 'Already have an account?',
      linkMessage: 'Log into your TaskFlow account',
      linkHref: '/login'
    });

    return `
      ${header}
      <main class="register-view auth-view">
        <div class="register-view-container">
          <h1 class="auth-view-title">Create a TaskFlow account</h1>
          ${registerUserForm}
          ${authRedirect}
        </div>
      </main>
    `;
  }
}
import Header from "../../layouts/Header.js";
import LoginUserForm from "./components/LoginUserForm.js";
import AuthRedirect from "../../components/AuthRedirect.js";
import '../../styles/login.css';

export default class LoginPage {
  static getHtml() {
    const header = Header.getHtml({ returnBackHome: true });
    const loginUserForm = LoginUserForm.getHtml();
    const authRedirect = AuthRedirect.getHtml({
      message: "Don't have an account?",
      linkMessage: 'Create a TaskFlow Account',
      linkHref: '/register'
    });

    return `
      ${header}
      <main class="auth-view">
        <div class="auth-view-container">
          <h1 class="auth-view-title">TaskFlow Account</h1>
          ${loginUserForm}
          <a class="login-view__recover-password-link" href="/recover-password" data-link>Forgot your password?</a>
          ${authRedirect}
        </div>
      </main>
    `;
  }
}
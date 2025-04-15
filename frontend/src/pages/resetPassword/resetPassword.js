import ResetPasswordForm from "./components/ResetPasswordForm.js";
import AuthRedirect from '../../components/AuthRedirect.js';

export default class ResetPasswordPage {
  static getHtml() {
    const resetPasswordForm = ResetPasswordForm.getHtml();
    const authRedirect = AuthRedirect.getHtml({
      message: "Oops! Didn't mean to end up here?",
      linkMessage: 'Head back home',
      linkHref: '/'
    });

    return `
      <main class="auth-view">
        <div class="auth-view-container">
          <h1 class="auth-view-title">Recover TaskFlow Account</h1>
          ${resetPasswordForm}
          ${authRedirect}
        </div>
      </main>
    `;
  }
}
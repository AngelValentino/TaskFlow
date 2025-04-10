import RecoverPasswordForm from './components/RecoverPasswordForm.js';
import AuthRedirect from '../../components/AuthRedirect.js';

export default class RecoverPage {
  static getHtml() {
    const recoverPasswordForm = RecoverPasswordForm.getHtml();
    const authRedirect = AuthRedirect.getHtml({
      message: "Oops! Didn't mean to end up here?",
      linkMessage: 'Head back home',
      linkHref: '/'
    });

    return `
      <main class="auth-view">
        <div class="auth-view-container">
          <h1 class="auth-view-title">Recover TaskFlow Account</h1>
          ${recoverPasswordForm}
          ${authRedirect}
        </div>
      </main>
    `;
  }
}
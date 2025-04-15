import '../styles/logout.css';

export default class LogoutPage {
  static getHtml() {
    return `
      <main class="logout-view">
        <p id="logout-message" class="logout-message">Logging out, please wait...</p>
        <p class="return-home-message">You may <a class="return-home-link" href="/" data-link>return home</a>.</p>
      </main>
    `;
  }
}
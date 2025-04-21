import '../styles/logout.css';

export default class LogoutPage {
  static getHtml() {
    return `
      <main class="logout-view">
        <p id="logout-message" class="logout-message">Logging out, please wait...</p>
        <p class="return-home-message">You may <a class="logout-return-home-link slide-in-and-back underline fixed-height" href="/" data-link>return home</a>.</p>
      </main>
    `;
  }
}
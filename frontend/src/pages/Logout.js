export default class LogoutPage {
  static getHtml() {
    return `
      <main>
        <p id="logout-message" class="logout-message">Logging out, please wait...</p>
      </main>
    `;
  }
}
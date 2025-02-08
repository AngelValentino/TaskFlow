import Header from "../layouts/Header.js";

export default class LoginPage {
  static getHtml() {
    const header = Header.getHtml();

    return `
      ${header}
      <main>
        <h1>Login view</h1>
        <p>Welcome to the Login!</p>
      </main>
    `;
  }
}
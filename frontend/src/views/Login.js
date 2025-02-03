import AbstractView from "./AbstractView.js";
import Header from "../components/Header.js";

export default class LoginView extends AbstractView {
  constructor() {
    super();
  }

  async getHtml() {
    const header = new Header().getHtml();

    return `
      ${header}
      <main>
        <h1>Login view</h1>
        <p>Welcome to the Login!</p>
      </main>
    `;
  }
}
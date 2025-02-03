import AbstractView from "./AbstractView.js";
import Header from "../components/Header.js";

export default class RegisterView extends AbstractView {
  constructor() {
    super();
  }

  async getHtml() {
    const header = new Header().getHtml();
    
    return `
      ${header}
      <main>
        <h1>Register view</h1>
        <p>Welcome to the Register!</p>
      </main>
    `;
  }
}
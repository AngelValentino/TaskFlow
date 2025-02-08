import Header from "../layouts/Header.js";

export default class DashboardPage {
  static getHtml() {
    const header = Header.getHtml();

    return `
      ${header}
      <main>
        <h1>Dashboard view</h1>
        <p>Welcome to the Dashboard!</p>
      </main>
    `;
  }
}
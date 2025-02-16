import Auth from "../services/Auth.js";

//TODO Check if user is still logged in by checking refresh token validity
//TODO And just logout client without making another fetch request

export default class Header {
  static auth = new Auth();

  static getGuestUserLinks() {
    return `
      <li>
        <a class="navbar__link" href="/" data-link>Dashboard</a>
      </li>
      <div class="navbar__auth-links-container">
        <li>
          <a class="navbar__link" href="/register" data-link>Register</a>
        </li>
        <li>
          <a class="navbar__link" href="/login" data-link>Login</a>
        </li>
      </div>
    `;
  }

  static getLoggedUserLinks() {
    const username = localStorage.getItem('username');

    return `
      <li>
        <a class="navbar__link" href="/" data-link>Dashboard</a>
      </li>
      <div class="navbar__auth-links-container">
        <p class="navbar__greeting-message">Hello ${username}!</p>
        <li>
          <a class="navbar__link navbar__logout-btn" href="/logout" data-link>Logout</a>
        </li>
      <div>

    `;
  }

  static getHtml() {
    return `
      <header>
        <nav class="navbar">
          <ul class="navbar__links-list">
            ${Header.auth.isClientLogged() ? Header.getLoggedUserLinks() : Header.getGuestUserLinks()}
          </ul>
        </nav>
      </header>
    `;
  }
}
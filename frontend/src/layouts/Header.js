export default class Header {
  static getHtml() {
    return `
      <header>
        <nav class="navbar">
          <ul class="navbar__links-list">
            <li>
              <a class="navbar__link" href="/" data-link>Dashboard</a>
            </li>
            <li>
              <a class="navbar__link" href="/register" data-link>Register</a>
            </li>
            <li>
              <a class="navbar__link" href="/login" data-link>Login</a>
            </li>
            <li>
              <a class="navbar__link navbar__logout-btn" href="/logout" data-link>Logout</a>
            </li>
          </ul>
        </nav>
      </header>
    `;
  }
}
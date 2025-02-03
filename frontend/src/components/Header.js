export default class Header {
  getHtml() {
    return `
      <header>
        <nav>
          <ul>
            <li><a href="/" data-link>Dashboard</a></li>
            <li><a href="/register" data-link>Register</a></li>
            <li><a href="/login" data-link>Log In</a></li>
          </ul>
        </nav>
      </header>
    `;
  }
}
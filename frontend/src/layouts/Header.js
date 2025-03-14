import Auth from "../services/Auth.js";

//TODO Check if user is still logged in by checking refresh token validity
//TODO And just logout client without making another fetch request

export default class Header {
  static auth = new Auth();


  static getHtml() {
    return `
      <header>
        <nav>
          <button aria-label="Open user menu." title="Open user menu" class="user-menu-btn" id="user-menu-btn">
            <svg aria-hidden="true" focusable="false" class="user-menu-btn-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path fill="currentColor" d="M17.06 13c-1.86 0-3.42 1.33-3.82 3.1c-.95-.41-1.82-.3-2.48-.01C10.35 14.31 8.79 13 6.94 13C4.77 13 3 14.79 3 17s1.77 4 3.94 4c2.06 0 3.74-1.62 3.9-3.68c.34-.24 1.23-.69 2.32.02c.18 2.05 1.84 3.66 3.9 3.66c2.17 0 3.94-1.79 3.94-4s-1.77-4-3.94-4M6.94 19.86c-1.56 0-2.81-1.28-2.81-2.86s1.26-2.86 2.81-2.86c1.56 0 2.81 1.28 2.81 2.86s-1.25 2.86-2.81 2.86m10.12 0c-1.56 0-2.81-1.28-2.81-2.86s1.25-2.86 2.81-2.86s2.82 1.28 2.82 2.86s-1.27 2.86-2.82 2.86M22 10.5H2V12h20zm-6.47-7.87c-.22-.49-.78-.75-1.31-.58L12 2.79l-2.23-.74l-.05-.01c-.53-.15-1.09.13-1.29.64L6 9h12l-2.44-6.32z" />
            </svg>
          </button>

          <ul class="user-menu" id="user-menu">
            <li>
              <a id="user-menu__login-link" class="user-menu__link" href="/login" data-link>
                <svg aria-hidden="true" focusable="false" class="user-menu__link-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M1.5 4v1.5c0 4.15 2.21 7.78 5.5 9.8V20h15v-2c0-2.66-5.33-4-8-4h-.25C9 14 5 10 5 5.5V4m9 0a4 4 0 0 0-4 4a4 4 0 0 0 4 4a4 4 0 0 0 4-4a4 4 0 0 0-4-4" />
                </svg>
                Log in
              </a>
            </li>
            <li>
              <a class="user-menu__link" href="/register" data-link>
                <svg aria-hidden="true" focusable="false" class="user-menu__link-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M15 14c-2.67 0-8 1.33-8 4v2h16v-2c0-2.67-5.33-4-8-4m-9-4V7H4v3H1v2h3v3h2v-3h3v-2m6 2a4 4 0 0 0 4-4a4 4 0 0 0-4-4a4 4 0 0 0-4 4a4 4 0 0 0 4 4" />
                </svg>
                Register
              </a>
            </li>
          </ul>
        </nav>
      </header>
    `;
  }
}
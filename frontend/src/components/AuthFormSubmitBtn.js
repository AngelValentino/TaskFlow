import ThreeDotsLoader from "./ThreeDotsLoader.js";

export default class AuthFormSubmitBtn {
  static getHtml({btnText = 'Log in'} = {}) {
    const threeDotsLoader = ThreeDotsLoader.getHtml();

    return `
      <button id="auth-form__submit-btn" class="auth-form__submit-btn" type="submit" disabled>
        <span id="auth-form__submit-btn-text" class="login-form__submit-btn-text">${btnText}</span>
        ${threeDotsLoader}
      </button>
    `;
  }
}
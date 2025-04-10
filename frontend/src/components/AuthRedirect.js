export default class AuthRedirect {
  static getHtml({
    message = '',
    linkMessage = '',
    linkHref = ''
  } = {}) {
    return `
      <div class="auth-redirect">
        <p class="auth-redirect__message">${message}</p>
        <a href="${linkHref}" class="auth-redirect__link" data-link>${linkMessage}</a>
      </div>
    `
  }
}
import '../styles/notFound.css';

export default class NotFound {
  static getHtml() {
    return `
      <main class="not-found-view">
        <div class="not-found-container">
          <h1 class="not-found-title">404</h1>
          <p class="not-found-message">Oops! We couldn't find this page</p>
          <p class="not-found-message-description">The page you're looking for doesn't exist or has been moved.</p>
          <a class="not-found-return-link" href="/" data-link>Return back home<a/>
        </div>
      </main>
    `;
  }
}
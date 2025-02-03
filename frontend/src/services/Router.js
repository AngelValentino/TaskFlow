export default class Router {
  constructor() {
    this.routes = [];
    this.init();
  }

  // Adds a route
  addRoute(path, view) {
    this.routes.push({ path, view });
  }

  // Initializes the router and checks for matching route
  init() {
    window.addEventListener('popstate', () => this.dispatch());  // Listen for back/forward navigation
    this.setupLinkNavigation();
  }

  // Route matching and rendering logic
  dispatch() {
    const { route } = this.routes
      .map(route => {
        return {
          route,
          isMatch: location.pathname === route.path
        };
      })
      .find(route => route.isMatch) || {};

    if (!route) {
      this.handleNotFound();
      return;
    }

    route.view();
  }

  // Handle rendering for a 404 not found
  handleNotFound() {
    const appLm = document.getElementById('App');
    appLm.innerHTML = `
      <h1>404</h1>
      <p>Resource not found</p>
    `;
  }

  // Utility method to navigate to a new URL
  navigateTo(url) {
    history.pushState(null, null, url);
    this.dispatch();
  }

  // Set up event listener for links with the 'data-link' attribute
  setupLinkNavigation() {
    document.body.addEventListener('click', e => {
      if (e.target.matches('[data-link]')) {
        e.preventDefault();
        this.navigateTo(e.target.href);
      }
    });
  }
}

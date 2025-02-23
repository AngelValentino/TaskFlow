export default class Router {
  constructor() {
    if (Router.instance) return Router.instance; // Prevents multiple instances
    this.routes = [];
    this.init();
    this.appLm = document.getElementById('App');
    this.abortController = new AbortController();
    Router.instance = this; // Store the instance
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
    const formerView = this.appLm.dataset.view

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

    // Update current view
    this.appLm.dataset.view = route.path;
    const currentView = this.appLm.dataset.view;

    // Avoid rendering the same view
    if (formerView === currentView) return;

    // Before navigating to the new view, cancel any active fetch
    this.abortActiveFetch();
  
    route.view();
  }

  // Handle rendering for a 404 not found
  handleNotFound() {
    this.appLm.innerHTML = `
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

  getNewAbortSignal() {
    this.abortController = new AbortController(); 
  }

  abortActiveFetch() {
    if (!this.abortController.signal.aborted) {
      this.abortController.abort();
    }
  }

  getAbortSignal() {
    this.getNewAbortSignal();
    return this.abortController.signal;
  }
}

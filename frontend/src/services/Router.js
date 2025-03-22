export default class Router {
  constructor(modalHandler) {
    if (Router.instance) return Router.instance; // Prevents multiple instances
    this.routes = [];
    this.init();
    this.appLm = document.getElementById('App');
    this.abortControllers = {};
    this.modalHandler = modalHandler;
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
    document.body.className = '';

    this.modalHandler.clearRemainingDocumentBodyEvents();

    // Before navigating to the new view, cancel any active fetch
    this.abortActiveFetches();
  
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
      const link = e.target.closest('[data-link]');
      
      if (link) {
        e.preventDefault();
        e.stopPropagation();
        this.navigateTo(link.href);
      }
    });
  }

  setNewAbortSignal(fetchKey) {
    this.abortControllers[fetchKey] = new AbortController()
  }

  abortActiveFetches() {
    console.log(this.abortControllers)
    Object.values(this.abortControllers).forEach(controller => {
      if (!controller.signal.aborted) {
        console.log('aborted fetch')
        controller.abort();
      }
    });
  }

  getAbortSignal(fetchKey) {
    this.setNewAbortSignal(fetchKey);
    console.log(this.abortControllers)
    return this.abortControllers[fetchKey].signal;
  }
}

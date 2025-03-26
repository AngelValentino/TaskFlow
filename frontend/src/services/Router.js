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

    let matchedRoute = this.routes.find(route => location.pathname === route.path);
    
    if (!matchedRoute) {
      matchedRoute = this.routes.find(route => route.path === '*');
    }

    if (!matchedRoute) {
      console.warn('Routing error: No matching route found, and no 404 route is defined.');
      return;
    }

    // Update current view
    this.appLm.dataset.view = matchedRoute.path;
    const currentView = this.appLm.dataset.view;

    // Avoid rendering the same view
    if (formerView === currentView) {
      console.warn('Same route navigation detected, skipping re-render.')
      return;
    };
   
    document.body.className = '';
    this.modalHandler.clearRemainingDocumentBodyEvents();
    this.abortActiveFetches();
  
    matchedRoute.view();
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

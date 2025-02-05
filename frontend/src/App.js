import DashboardView from "./views/Dashboard.js";
import RegisterView from "./views/Register.js";
import LoginView from "./views/Login.js";
import Router from './services/Router.js';

document.addEventListener('DOMContentLoaded', () => {
  // Instantiate Router class
  const router = new Router();
  const appLm = document.getElementById('App');

  // Add routes
  router.addRoute('/', () => {
    const view = new DashboardView();

    view.getHtml()
      .then(html => {
        appLm.innerHTML = html;
      })
      .catch(error => console.error('Error fetching HTML:', error));
  });

  router.addRoute('/register', () => {
    const view = new RegisterView();

    view.getHtml()
      .then(html => {
        appLm.innerHTML = html;
      })
      .catch(error => console.error('Error fetching HTML:', error));
  });

  router.addRoute('/login', () => {
    const view = new LoginView();

    view.getHtml()
      .then(html => {
        appLm.innerHTML = html;
      })
      .catch(error => console.error('Error fetching HTML:', error));
  });

  // Dispatch to the correct route
  router.dispatch();
});

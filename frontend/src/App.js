import DashboardPage from "./pages/Dashboard.js";
import RegisterPage from "./pages/Register.js";
import LoginPage from "./pages/Login.js";
import Router from './services/Router.js';
import Auth from "./services/Auth.js";
import RegisterController from "./controllers/registerController.js";
import RegisterView from "./views/RegisterView.js";

document.addEventListener('DOMContentLoaded', () => {
  // Instantiate Router class
  const router = new Router();
  const appLm = document.getElementById('App');

  // Add routes
  router.addRoute('/', () => {
    appLm.innerHTML = DashboardPage.getHtml();
  });

  router.addRoute('/register', () => {
    appLm.innerHTML = RegisterPage.getHtml()
    const auth = new Auth(router);
    const registerView = new RegisterView();
    new RegisterController(router, auth, registerView);
  });

  router.addRoute('/login', () => {
    // TODO Add basic login functionality
    appLm.innerHTML = LoginPage.getHtml();
  });

  // Dispatch to the correct route
  router.dispatch();
});

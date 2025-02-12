import DashboardPage from "./pages/Dashboard.js";
import RegisterPage from "./pages/Register/Register.js";
import LoginPage from "./pages/login/Login.js";
import Router from './services/Router.js';
import Auth from "./services/Auth.js";
import RegisterController from "./controllers/registerController.js";
import RegisterView from "./views/RegisterView.js";
import LoginView from "./views/LoginView.js";
import LoginController from "./controllers/LoginController.js";
import LogoutPage from "./pages/Logout.js";
import LogoutController from "./controllers/LogoutController.js";
import UserModel from "./models/UserModel.js";

document.addEventListener('DOMContentLoaded', () => {
  const router = new Router();
  const appLm = document.getElementById('App');

  // Add routes
  router.addRoute('/', () => {
    appLm.innerHTML = DashboardPage.getHtml();
  });

  router.addRoute('/register', () => {
    appLm.innerHTML = RegisterPage.getHtml();
    const userModel = new UserModel(router);
    const registerView = new RegisterView();
    new RegisterController(router, userModel, registerView);
  });

  router.addRoute('/login', () => {
    appLm.innerHTML = LoginPage.getHtml();
    const auth = new Auth(router);
    const userModel = new UserModel(router);
    const loginView = new LoginView;
    new LoginController(router, auth, userModel, loginView);
  });

  router.addRoute('/logout', () => {
    appLm.innerHTML = LogoutPage.getHtml();
    const auth = new Auth(router);
    const userModel = new UserModel(router);
    new LogoutController(router, auth, userModel);
  });

  // Dispatch to the correct route
  router.dispatch();
});

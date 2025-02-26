import DashboardPage from "./pages/dashboard/Dashboard.js";
import RegisterPage from "./pages/register/Register.js";
import LoginPage from "./pages/login/Login.js";
import Router from './services/Router.js';
import Auth from "./services/Auth.js";
import RegisterController from "./controllers/RegisterController.js";
import RegisterView from "./views/RegisterView.js";
import LoginView from "./views/LoginView.js";
import LoginController from "./controllers/LoginController.js";
import LogoutPage from "./pages/Logout.js";
import LogoutController from "./controllers/LogoutController.js";
import UserModel from "./models/UserModel.js";
import TaskManagerView from "./views/TaskManagerView.js";
import TaskManagerController from "./controllers/TaskManagerController.js";
import ModalHandler from "./services/ModalHandler.js";
import TaskModel from "./models/TaskModel.js";
import TokenHandler from "./services/TokenHandler.js";
import ModalView from "./views/ModalView.js";

document.addEventListener('DOMContentLoaded', () => {
  const router = new Router;
  const appLm = document.getElementById('App');

  // Add routes
  router.addRoute('/', () => {
    appLm.innerHTML = DashboardPage.getHtml();

    // TODO Add values to edit modal form
    // TODO Update task fetch request with optional values
    // TODO Add confirm modal in case user discards edit

    // TODO Refactor task manger and modals css selector names 
    // TODO Decide whether to add the functionality to abort the fetch request at modal close, 
    // TODO it may confuse users even more that actually not aborting the fetch

    // Task manager
    const auth = new Auth;
    const userModel = new UserModel(router);
    const modalHandler = new ModalHandler;
    const modalView = new ModalView(modalHandler);
    const taskManagerView = new TaskManagerView(modalHandler, modalView);
    const tokenHandler = new TokenHandler(router, userModel, auth);
    const taskModel = new TaskModel(router, auth, tokenHandler);

    new TaskManagerController(taskManagerView, taskModel, auth, modalView);
  });

  router.addRoute('/register', () => {
    appLm.innerHTML = RegisterPage.getHtml();
    const userModel = new UserModel(router);
    const registerView = new RegisterView;
    new RegisterController(router, userModel, registerView);
  });

  router.addRoute('/login', () => {
    appLm.innerHTML = LoginPage.getHtml();
    const auth = new Auth;
    const userModel = new UserModel(router);
    const loginView = new LoginView;
    new LoginController(router, auth, userModel, loginView);
  });

  router.addRoute('/logout', () => {
    appLm.innerHTML = LogoutPage.getHtml();
    const auth = new Auth;
    const userModel = new UserModel(router);
    new LogoutController(router, auth, userModel);
  });

  // Dispatch to the correct route
  router.dispatch();
});

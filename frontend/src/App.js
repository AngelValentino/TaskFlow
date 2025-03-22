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
import Utils from "./services/Utils.js";
import QuoteMachineController from "./controllers/QuoteMachineController.js";
import QuoteModel from "./models/QuoteModel.js";
import QuoteMachineView from "./views/QuoteMachineView.js";
import ThemeHandler from "./services/ThemeHandler.js";
import PomodoroTimerController from "./controllers/PomodoroTimerController.js";
import PomodoroTimerView from "./views/PomodoroTimerView.js";
import UserMenuView from "./views/UserMenuView.js";
import UserMenuController from "./controllers/UserMenuController.js";
import LogoutView from "./views/LogoutView.js";
import LoadHandler from "./services/LoadHandler.js";

document.addEventListener('DOMContentLoaded', () => {
  const modalHandler = new ModalHandler;
  const router = new Router(modalHandler);
  const utils = new Utils;
  const appLm = document.getElementById('App');
  const loadHandler = new LoadHandler;

  // TODO Refactor and finish application

  // Add routes
  router.addRoute('/', () => {
    appLm.innerHTML = DashboardPage.getHtml();
    loadHandler.blurLoadImages();
    const themeHandler = new ThemeHandler(utils);
    themeHandler.setRandomTheme();

    // User menu
    const userMenuView = new UserMenuView(modalHandler);
    new UserMenuController(userMenuView);

    // Task manager
    const auth = new Auth;
    const userModel = new UserModel(router, auth);
    const modalView = new ModalView(modalHandler, utils, loadHandler);
    const taskManagerView = new TaskManagerView(modalHandler, modalView, utils, loadHandler);
    const tokenHandler = new TokenHandler(router, userModel, auth);
    const taskModel = new TaskModel(router, auth, tokenHandler);
    new TaskManagerController(taskManagerView, taskModel, auth, modalView, utils);
  
    // Quote machine
    const quoteModel = new QuoteModel(utils, router);
    const quoteMachineView = new QuoteMachineView(utils);
    new QuoteMachineController(quoteModel, quoteMachineView, utils, themeHandler, taskManagerView);
  
    // Pomodoro Timer
    const pomodoroTimerView = new PomodoroTimerView(utils);
    new PomodoroTimerController(pomodoroTimerView, taskManagerView);
  });

  router.addRoute('/register', () => {
    appLm.innerHTML = RegisterPage.getHtml();
    document.body.classList.add('register-view');
    
    const modalHandler = new ModalHandler;

    // User menu
    const userMenuView = new UserMenuView(modalHandler);
    new UserMenuController(userMenuView);

    const userModel = new UserModel(router);
    const registerView = new RegisterView;
    new RegisterController(router, userModel, registerView);
  });

  router.addRoute('/login', () => {
    appLm.innerHTML = LoginPage.getHtml();
    document.body.classList.add('login-view');

    const modalHandler = new ModalHandler;

    // User menu
    const userMenuView = new UserMenuView(modalHandler);
    new UserMenuController(userMenuView)

    const auth = new Auth;
    const userModel = new UserModel(router);
    const loginView = new LoginView;
    new LoginController(router, auth, userModel, loginView);
  });

  router.addRoute('/logout', () => {
    appLm.innerHTML = LogoutPage.getHtml();
    const auth = new Auth;
    const userModel = new UserModel(router);
    const logoutView = new LogoutView;
    new LogoutController(router, auth, userModel, logoutView);
  });

  // Dispatch to the correct route
  router.dispatch();
});

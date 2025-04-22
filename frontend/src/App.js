import DashboardPage from "./pages/dashboard/Dashboard.js";
import RegisterPage from "./pages/register/Register.js";
import LoginPage from "./pages/login/Login.js";
import RecoverPage from './pages/recover/Recover.js';
import ResetPasswordPage from './pages/resetPassword/resetPassword.js';
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
import UserMenuModel from './models/UserMenuModel.js';
import RecoverPasswordController from './controllers/RecoverPasswordController.js';
import LogoutView from "./views/LogoutView.js";
import LoadHandler from "./services/LoadHandler.js";
import TimerModel from "./models/TimerModel.js";
import NotFoundPage from "./pages/NotFound.js";
import EnhancedTaskView from './pages/enhancedTaskView/EnhancedTaskView.js';
import RecoverPasswordView from './views/RecoverPasswordView.js';
import RecoverPasswordModel from './models/RecoverPasswordModel.js';
import ResetPasswordView from './views/ResetPasswordView.js';
import ResetPasswordController from './controllers/ResetPasswordController.js';
import ResetPasswordModel from './models/ResetPasswordModel.js';
import AuthFormHandler from './services/AuthFormHandler.js';

import './styles/main.css';
import './styles/modal.css';
import './styles/reset.css';
import './styles/auth.css';

document.addEventListener('DOMContentLoaded', () => {
  const modalHandler = new ModalHandler;
  const router = new Router(modalHandler);
  const utils = new Utils;
  const appLm = document.getElementById('App');
  const loadHandler = new LoadHandler;
  const auth = new Auth;
  const themeHandler = new ThemeHandler(utils);

  let deviceUUID = sessionStorage.getItem('deviceUUID');
  if (!deviceUUID) {
    // New UUID generated and saved in sessionStorage
    deviceUUID = utils.getRandomUUID();
    sessionStorage.setItem('deviceUUID', deviceUUID);
  }

  // Webpack's fast optimized build can skip the loader, adding a delay allows the client to see it
  setTimeout(() => {
    loadHandler.hidePageLoader();
  });
  loadHandler.preloadDashboardBlurImages();
  themeHandler.setRandomTheme();

  // Add routes
  router.addRoute('/', () => {
    appLm.innerHTML = DashboardPage.getHtml();

    // User menu
    const userMenuModel = new UserMenuModel;
    const userMenuView = new UserMenuView(modalHandler, userMenuModel, utils);
    const userMenuController = new UserMenuController(userMenuView, auth, router);
    userMenuController.init();

    // Task manager
    const userModel = new UserModel(router, auth, utils);
    const modalView = new ModalView(modalHandler, utils, loadHandler);
    const taskManagerView = new TaskManagerView(modalHandler, modalView, utils, loadHandler, router, auth);
    const tokenHandler = new TokenHandler(router, userModel, auth);
    const taskModel = new TaskModel(router, auth, tokenHandler, utils);
    const taskManagerController = new TaskManagerController(taskManagerView, taskModel, auth, modalView, utils);
    taskManagerController.init();
  
    // Quote machine
    const quoteModel = new QuoteModel(utils, router);
    const quoteMachineView = new QuoteMachineView(utils);
    const quoteMachineController = new QuoteMachineController(quoteModel, quoteMachineView, utils, themeHandler, taskManagerView);
    quoteMachineController.init();
  
    // Pomodoro Timer
    const pomodoroTimerView = new PomodoroTimerView;
    const timeModel = new TimerModel(pomodoroTimerView, utils);
    const pomodoroTimerController = new PomodoroTimerController(pomodoroTimerView, taskManagerView, timeModel);
    pomodoroTimerController.init();
  });

  router.addRoute('/tasks', () => {
    appLm.innerHTML = EnhancedTaskView.getHtml();

    // User menu
    const userMenuModel = new UserMenuModel;
    const userMenuView = new UserMenuView(modalHandler, userMenuModel, utils);
    const userMenuController = new UserMenuController(userMenuView, auth, router);
    userMenuController.init();

    // Task manager
    const userModel = new UserModel(router, auth, utils);
    const modalView = new ModalView(modalHandler, utils, loadHandler);
    const taskManagerView = new TaskManagerView(modalHandler, modalView, utils, loadHandler, router, auth);
    const tokenHandler = new TokenHandler(router, userModel, auth);
    const taskModel = new TaskModel(router, auth, tokenHandler, utils);
    const taskManagerController = new TaskManagerController(taskManagerView, taskModel, auth, modalView, utils, true);
    taskManagerController.init();
  });

  router.addRoute('/register', () => {
    appLm.innerHTML = RegisterPage.getHtml();
    document.body.classList.add('register-view');
    document.body.classList.add('auth-view');

    // User menu
    const userMenuModel = new UserMenuModel;
    const userMenuView = new UserMenuView(modalHandler, userMenuModel, utils);
    const userMenuController = new UserMenuController(userMenuView, auth, router);
    userMenuController.init();

    // Register
    const authFormHandler = new AuthFormHandler;
    const userModel = new UserModel(router, auth, utils);
    const registerView = new RegisterView(authFormHandler);
    const registerController = new RegisterController(router, userModel, registerView, utils, authFormHandler);
    registerController.init();
  });

  router.addRoute('/login', () => {
    appLm.innerHTML = LoginPage.getHtml();
    document.body.classList.add('auth-view');

    // User menu
    const userMenuModel = new UserMenuModel;
    const userMenuView = new UserMenuView(modalHandler, userMenuModel, utils);
    const userMenuController = new UserMenuController(userMenuView, auth, router);
    userMenuController.init();

    // Login
    const authFormHandler = new AuthFormHandler;
    const userModel = new UserModel(router, auth, utils);
    const loginView = new LoginView(authFormHandler);
    const loginController = new LoginController(router, auth, userModel, loginView, utils);
    loginController.init();
  });

  router.addRoute('/logout', () => {
    appLm.innerHTML = LogoutPage.getHtml();
    document.body.classList.add('logout-view');
    document.body.classList.add('auth-view');

    const userModel = new UserModel(router, auth, utils);
    const logoutView = new LogoutView;
    const logoutController = new LogoutController(router, auth, userModel, logoutView, utils);
    logoutController.init();
  });

  router.addRoute('/recover-password', () => {
    appLm.innerHTML = RecoverPage.getHtml();
    document.body.classList.add('auth-view');
    
    const authFormHandler = new AuthFormHandler;
    const recoverPasswordModel = new RecoverPasswordModel(router, utils);
    const recoverPasswordView = new RecoverPasswordView(authFormHandler);
    const recoverPasswordController = new RecoverPasswordController(recoverPasswordView, recoverPasswordModel, utils);
    recoverPasswordController.init();
  });

  router.addRoute('/reset-password', () => {
    appLm.innerHTML = ResetPasswordPage.getHtml();
    document.body.classList.add('auth-view');

    const authFormHandler = new AuthFormHandler;
    const resetPasswordModel = new ResetPasswordModel(router, utils);
    const resetPasswordView = new ResetPasswordView(authFormHandler);
    const resetPasswordController = new ResetPasswordController(resetPasswordView, resetPasswordModel, utils, router, authFormHandler);
    resetPasswordController.init();
  });

  router.addRoute('*', () => {
    appLm.innerHTML = NotFoundPage.getHtml();
  });

  // Dispatch to the correct route
  router.dispatch();
});

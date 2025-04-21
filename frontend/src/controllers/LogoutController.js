export default class LogoutController {
  constructor(router, auth, userModel, logoutView, utils) {
    this.router = router;
    this.auth = auth;
    this.userModel = userModel;
    this.logoutView = logoutView;
    this.utils = utils;
  }

  init() {
    this.logoutUser();
  }

  logoutUser() {
    this.userModel.handleUserLogout()
      .then(() => {
        this.auth.logoutClient();
        this.router.navigateTo('/');
      })
      .catch(error => {
        this.logoutView.updateLogoutMessage(error.message, true);
        console.error(this.utils.formatErrorMessage(error));
      });
  }
}
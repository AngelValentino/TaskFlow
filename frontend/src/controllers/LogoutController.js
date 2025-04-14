export default class LogoutController {
  constructor(router, auth, userModel, logoutView) {
    this.router = router;
    this.auth = auth;
    this.userModel = userModel;
    this.logoutView = logoutView;
  }

  init() {
    this.logoutUser();
  }

  logoutUser() {
    this.userModel.handleUserLogout()
      .then(() => {
        this.auth.logoutClient();
        console.log('logout successful');
        this.router.navigateTo('/');
      })
      .catch(error => {
        this.logoutView.updateLogoutMessage(error.message, true);
        console.error(error);
      });
  }
}
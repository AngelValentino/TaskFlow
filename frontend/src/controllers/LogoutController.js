export default class LogoutController {
  constructor(router, auth, userModel, logoutView) {
    this.router = router;
    this.auth = auth;
    this.userModel = userModel;
    this.logoutView = logoutView;

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
        if (error.name === 'AbortError') {
          console.warn('Request aborted due to navigation change');
          return;
        }

        this.logoutView.updateLogoutMessage(error.message, true);
        console.error(error);
      });
  }
}
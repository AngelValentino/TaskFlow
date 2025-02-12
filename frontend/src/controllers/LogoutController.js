export default class LogoutController {
  constructor(router, auth, userModel) {
    this.router = router;
    this.auth = auth;
    this.userModel = userModel;

    this.logoutUser();
  }

  logoutUser() {
    this.userModel.handleUserLogout()
      .then(() => {
        this.auth.logoutClient();
        console.log('logout successful');
      })
      .catch(error => {
        if (error.name === 'AbortError') {
          console.warn('Request aborted due to navigation change');
          return;
        }

        console.error(error);
      })
      .then(() => {
        this.router.navigateTo('/');
      });
  }
}
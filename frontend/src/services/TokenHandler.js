export default class TokenHandler {
  constructor(router, userModel, auth) {
    this.router = router;
    this.userModel = userModel;
    this.auth = auth;
  }

  async handleRefreshAccessToken() {
    const refreshToken = localStorage.getItem('refreshToken');

    const response = await fetch('http://taskflow-api.com/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: refreshToken }),
      signal: this.router.getAbortSignal()
    });

    // If the user aborts the request before the new refresh token is set, they will be logged out during future interactions.
    // This happens because the current refresh token will not be in the whitelist, as the API does not yet handle aborted requests.
    // Consequently, the client handles logout, but the access token remains in the database without being cleared.

    if (!response.ok) {
      // Logout user
      await this.userModel.handleUserLogout();
      this.auth.logoutClient();
      throw new Error('Refresh token has expired or is no longer valid, logging out user.');
    }

    const data = await response.json();
    this.auth.loginClient(data);
  }
}
export default class TokenHandler {
  constructor(router, userModel, auth) {
    this.router = router;
    this.userModel = userModel;
    this.auth = auth;
    this.isRefreshingToken = false;
    this.refreshTokenQueue = [];
  }

  async handleRefreshAccessToken() {
    const refreshToken = localStorage.getItem('refreshToken');

    // If a refresh is already in progress, queue the new request
    if (this.isRefreshingToken) {
      return new Promise((resolve, reject) => {
        this.refreshTokenQueue.push({ resolve, reject });
      });
    }

    // Mark that the refresh process is running
    this.isRefreshingToken = true;

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
      const errorMessage = await this.userModel.handleUserLogout(false);
      const error = new Error(errorMessage);
      console.log(error)
      // Reject queued promises and return
      this.processTokenQueue(error);
      throw error;
    }

    const data = await response.json();
    this.auth.loginClient(data);

    // Process any queued refresh token requests
    this.processTokenQueue(null, data);

    // Reset the lock flag after the refresh process is done
    this.isRefreshingToken = false;
  }

  processTokenQueue(error, data) {
    // Process all the queued promises (resolve or reject them)
    this.refreshTokenQueue.forEach(promise => {
      if (error) {
        promise.reject(error);  // Reject the promise if there was an error
      } 
      else {
        promise.resolve(data);  // Resolve the promise with the new data
      }
    });

    // Clear the queue after processing all promises
    this.refreshTokenQueue = [];
  }
}
import config from "../config";

export default class UserModel {
  constructor(auth, fetchHandler = null) {
    this.auth = auth;
    this.fetchHandler = fetchHandler;
  }
  
  setFetchHandler(fetchHandler) {
    this.fetchHandler = fetchHandler;
  }

  async handleUserRegistration(formData) {
    const endpoint = config.apiUrl + '/register';
    await this.fetchHandler.handleFetchRequest(
      endpoint,
      {
        method: 'POST',
        body: formData
      },
      `We couldn't register your user data into our storage. Please try again later.`
    );
  }

  async handleUserLogin(formData) {
    const endpoint = config.apiUrl + '/login';
    return await this.fetchHandler.handleFetchRequest(
      endpoint,
      {
        method: 'POST',
        body: formData
      },
      `We couldn't login into your account. Please try again later.`,
      true
    );
  }

  async handleUserLogout(throwErrors = true) {
    const endpoint = config.apiUrl + '/logout';
    const response = await this.fetchHandler.fetchRequest(
      endpoint,
      {
        method: 'POST',
        body: JSON.stringify({
          token: localStorage.getItem('refreshToken') 
        })
      }
    );

    // Rate limited
    if (response.status === 429) {
      if (throwErrors) {
        throw new Error(`Oops! Error ${response.status}: Rate limit exceeded. Please try again later, refresh the page or clear browser history.`);
      } 
      else {
        return {
          success: false,
          message: `Oops! Error ${response.status}: Rate limit exceeded. Please try again later, refresh the page or clear browser history. `
        }
      }
    }

    if (response.status === 401) {
      const error = await response.json();
      if (error.message === 'Token has expired.') {
        this.auth.logoutClient();

        if (!throwErrors) {
          // If this request is triggered from the TokenHandler, we should inform the user that their session has expired,
          // this allows the user to manually refresh the page and log out of the application
          return {
            success: false,
            message: 'Oops! Refresh token has expired or is no longer valid. Please try again later, refresh the page or clear browser history.'
          }
        }
        // In cases where we don't need to throw an error (like when auto-logging out), 
        // we don't need to throw an error. The user will be automatically redirected to the home page after logout
        return;
      }
    }

    // Handle logout failure without logging out the user to avoid accidental logouts
    // due to server errors or potential tampering.
    if (!response.ok) {
      if (throwErrors) {
        throw new Error(`Oops! Error ${response.status}: We couldn't log you out from the app. Please try again later, refresh the page or clear browser history.`);
      } 
      else {
        return { 
          success: false,
          message: `Oops! Error ${response.status}: We couldn't log you out from the app. Please try again later, refresh the page or clear browser history.`
        };
      }
    }

    return { success: true };
  }
}
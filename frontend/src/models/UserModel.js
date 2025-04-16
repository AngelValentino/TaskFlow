export default class UserModel {
  constructor(router, auth, utils) {
    this.router = router;
    this.auth = auth;
    this.utils = utils;
  }

  async handleUserRegistration(formData) {
    const endpoint = 'http://taskflow-api.com/register';

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: formData,
      signal: this.router.getAbortSignal(this.utils.formatFetchRequestKey('POST', endpoint))
    });

    // Rate limited
    if (response.status === 429) {
      const error = await response.json();
      throw new Error(`Oops! Error ${response.status}: ${error.message}`);
    }

    // Validation error
    if (response.status === 422) {
      const errorData = await response.json();
      const error = new Error('Validation error occurred');
      error.data = errorData; // Attach the full error data
      throw error;
    }

    // API error
    if (!response.ok) {
      throw new Error(`Oops! Error ${response.status}: We couldn't register your user data into our storage. Please try again later.`);
    }
  }

  async handleUserLogin(formData) {
    const endpoint = 'http://taskflow-api.com/login';

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: formData,
      signal: this.router.getAbortSignal(this.utils.formatFetchRequestKey('POST', endpoint))
    });

    // Rate limited
    if (response.status === 429) {
      const error = await response.json();
      throw new Error(`Oops! Error ${response.status}: ${error.message}`);
    }

    if (response.status === 400 || response.status === 401) {
      const error = await response.json();
      throw new Error(error.message);
    }

    if (!response.ok) {
      throw new Error(`Oops! Error ${response.status}: We couldn't login into your account. Please try again later.`);
    }

    return await response.json();
  }

  async handleUserLogout(throwErrors = true) {
    const endpoint = 'http://taskflow-api.com/logout';

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({
        token: localStorage.getItem('refreshToken') 
      })
    });

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
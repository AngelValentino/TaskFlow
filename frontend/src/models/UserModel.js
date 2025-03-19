export default class UserModel {
  constructor(router) {
    this.router = router
  }

  async handleUserRegistration(formData) {
    const response = await fetch('http://taskflow-api.com/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: formData,
      signal: this.router.getAbortSignal()
    });

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

    const data = await response.json();
    return data;
  }

  async handleUserLogin(formData) {
    const response = await fetch('http://taskflow-api.com/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: formData,
      signal: this.router.getAbortSignal()
    });

    if (response.status === 400 || response.status === 401) {
      const error = await response.json();
      throw new Error(error.message);
    }

    if (!response.ok) {
      throw new Error(`Oops! Error ${response.status}: We couldn't login into your account. Please try again later.`);
    }

    const data = await response.json();
    return data;
  }

  async handleUserLogout() {
    const response = await fetch('http://taskflow-api.com/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token: localStorage.getItem('refreshToken')
      }),
      signal: this.router.getAbortSignal()
    });

    if (response.status === 401) {
      // If the refresh token has expired, just logout the client
      // Any logout request will throw errors as the token is no longer valid
      const error = await response.json();
      if (error.message === 'Token has expired.') {
        console.warn('Expired refresh token.');
        return;
      }
    }

    if (!response.ok) {
      throw new Error(`Couldn't properly logout the user, try again later`);
    }
  }
}
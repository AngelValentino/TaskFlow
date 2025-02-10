export default class Auth {
  constructor(router) {
    this.router = router
  }

  async handleUserRegistration(formData) {
    const response = await fetch('http://localhost/taskflow-api/register', {
      method: 'POST',
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
      throw new Error(`Couldn't properly register the user, try again later`);
    }

    const data = await response.json();
    return data;
  }

  async handleUserLogin(formData) {
    const response = await fetch('http://localhost/taskflow-api/login', {
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
      throw new Error(`Couldn't properly login the user, try again later`);
    }

    const data = await response.json();
    return data;
  }

  async handleUserLogout() {
    const response = await fetch('http://localhost/taskflow-api/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token: localStorage.getItem('refreshToken')
      })
    });

    if (!response.ok) {
      throw new Error(`Couldn't properly logout the user, try again later`);
    }
  }

  logoutClient() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('username');
  }
}
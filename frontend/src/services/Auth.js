export default class Auth {
  username = '';

  getUsername() {
    return this.username;
  }

  async handleUserRegistration(formData) {
    const response = await fetch('http://localhost/taskflow-api/register', {
      method: 'POST',
      body: formData
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

  async handleUserLogin() {

  }

  async handleRefreshToken() {

  }
}
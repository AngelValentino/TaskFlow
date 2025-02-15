export default class TaskModel {
  constructor(router, auth) {
    this.router = router;
    this.auth = auth;
  }

  //TODO Refactor logic refresh token logic to be later reusable on all of the task requests
  //TODO Handle error validation
  //TODO Validate due_date in API
  //TODO Trim inputs in API
  async handleRefreshAccessToken() {
    const refreshToken = localStorage.getItem('refreshToken');

    const response = await fetch('http://localhost/taskflow-api/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({token: refreshToken})
    });

    if (!response.ok) {
      // TODO Send fetch request to logout user
      this.auth.logoutClient();
      throw new Error('Refresh token has expired or is invalid, logout user');
    }

    const data = await response.json();
    this.auth.loginClient(data);
  }

  async handleSubmitTask(formData) {
    const response = await fetch('http://localhost/taskflow-api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
      },
      body: formData,
      signal: this.router.getAbortSignal()
    });

    if (response.status === 400) {
      const error = await response.json();
      throw new Error(error.message);
    }

    // Handle Unauthorized errors (401)
    if (response.status === 401) {
      const error = await response.json();
      if (error.message === 'Invalid signature.') {
        console.warn('Invalid signature, that is a nono, go away hacker')
        throw new Error(error.message);
      }
      else if (error.message === 'Token has expired.') {
        console.warn('Access token has expired getting a new one')
        await this.handleRefreshAccessToken();
        console.warn('Access token was correctly refreshed');

        const response = await fetch('http://localhost/taskflow-api/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
          },
          body: formData,
          signal: this.router.getAbortSignal()
        });

        // Handle Validation errors (422)
        if (response.status === 422) {
          const errorData = await response.json();
          const error = new Error('Validation error occurred');
          error.data = errorData; // Attach the full error data
          throw error;
        }

        // API error
        if (!response.ok) {
          throw new Error(`Couldn't properly submit the task, try again later`);
        }

        console.warn('properly updated task after token refersh')
      }

      return
    }


    // Handle Validation errors (422)
    if (response.status === 422) {
      const errorData = await response.json();
      const error = new Error('Validation error occurred');
      error.data = errorData; // Attach the full error data
      throw error;
    }

    // API error
    if (!response.ok) {
      throw new Error(`Couldn't properly submit the task, try again later`);
    }
  }
}
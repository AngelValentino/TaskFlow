export default class TaskModel {
  constructor(router, auth, tokenHandler) {
    this.router = router;
    this.auth = auth;
    this.tokenHandler = tokenHandler;
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

    // Handle Bad Request (400)
    if (response.status === 400) {
      const error = await response.json();
      throw new Error(error.message);
    }

    // Handle Unauthorized errors (401)
    if (response.status === 401) {
      const error = await response.json();

      if (error.message === 'Token has expired.') {
        await this.tokenHandler.handleRefreshAccessToken(); // Get new refresh token
        
        // Retry the initial request
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

        return; // The new request was successful, stop further error handling
      }
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
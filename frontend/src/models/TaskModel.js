export default class TaskModel {
  constructor(router, auth, tokenHandler) {
    this.router = router;
    this.auth = auth;
    this.tokenHandler = tokenHandler;
  }

  addTaskToLocalStorage(taskData) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    taskData.id = Date.now();
    tasks.push(taskData);
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  getTasksFromLocalStorage() {
    return JSON.parse(localStorage.getItem('tasks')) || [];
  }

  async handleSubmitTask(taskData) {
    const response = await fetch('http://taskflow-api.com/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
      },
      body: taskData,
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
        const response = await fetch('http://taskflow-api.com/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
          },
          body: taskData,
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
          throw new Error(`Couldn't properly submit the task, try again later.`);
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
      throw new Error(`Couldn't properly submit the task, try again later.`);
    }
  }

  async handleGetAllTasks() {
    const response = await fetch('http://taskflow-api.com/tasks?sort_by=due_date', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
      },
      signal: this.router.getAbortSignal()
    });

    // Handle Bad Request (400)
    if (response.status === 400) {
      const error = await response.json();
      throw new Error(error.message);
    }

    if (response.status === 401) {
      const error = await response.json();

      if (error.message === 'Token has expired.') {
        await this.tokenHandler.handleRefreshAccessToken(); // Get new refresh token
        
        // Retry the initial request
        const response = await fetch('http://taskflow-api.com/tasks?sort_by=due_date', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
          },
          signal: this.router.getAbortSignal()
        });

        // Handle Bad Request (400)
        if (response.status === 400) {
          const error = await response.json();
          throw new Error(error.message);
        }

        // API error
        if (!response.ok) {
          throw new Error(`Couldn't properly get all the tasks, try again later.`);
        }

        return await response.json(); // The new request was successful, stop further error handling and return data
      }
    }

    if (!response.ok) {
      throw new Error(`Couldn't properly get all the tasks, try again later.`);
    }

    return await response.json(); // The new request was successful, stop further error handling and return data
  }

  async handleDeleteTask(taskId) {
    const response = await fetch('http://taskflow-api.com/tasks/' + taskId, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
      },
      signal: this.router.getAbortSignal()
    });

    // Handle Bad Request (400)
    if (response.status === 400) {
      const error = await response.json();
      throw new Error(error.message);
    }

    if (response.status === 401) {
      const error = await response.json();

      if (error.message === 'Token has expired.') {
        await this.tokenHandler.handleRefreshAccessToken(); // Get new refresh token
        
        // Retry the initial request
        const response = await fetch('http://taskflow-api.com/tasks/' + taskId, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
          },
          signal: this.router.getAbortSignal()
        });

        // Handle Bad Request (400)
        if (response.status === 400) {
          const error = await response.json();
          throw new Error(error.message);
        }

        // API error
        if (!response.ok) {
          throw new Error(`Couldn't properly delete the task, try again later.`);
        }

        return await response.json(); // The new request was successful, stop further error handling and return data
      }
    }

    // API error
    if (!response.ok) {
      throw new Error(`Couldn't properly delete the task, try again later.`);
    }
  }
}
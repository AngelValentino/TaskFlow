export default class TaskModel {
  constructor(router, auth, tokenHandler) {
    this.router = router;
    this.auth = auth;
    this.tokenHandler = tokenHandler;
    this.baseEndpointUrl = 'http://taskflow-api.com/tasks';
    this.customErrorHandlers = {
      422: async (response) => {
        const errorData = await response.json();
        const error = new Error('Validation error occurred');
        error.data = errorData;
        throw error;
      }
    }
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

  async fetchRequest(apiUrl, options) {
    return await fetch(apiUrl, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
      },
      signal: this.router.getAbortSignal() // TODO This needs review, works just at change view
    });
  }

  async handleAuthFetchRequest(apiUrl, options, returnData = false, errorMessage = 'Failed API connection.', errorHandlers = null) {
    let response = await this.fetchRequest(apiUrl, options);

    // Checks if token has expired (401)
    if (response.status === 401) {
      const error = await response.json();

      // Get new refresh token and retry initial request
      if (error.message === 'Token has expired.') {
        await this.tokenHandler.handleRefreshAccessToken(); 
        response = await this.fetchRequest(apiUrl, options);
      }
    }

    // Custom staus errors
    if (errorHandlers && errorHandlers[response.status]) {
      await errorHandlers[response.status](response);
    }

    // Generic status error
    if (!response.ok) {
      throw new Error(errorMessage);
    }

    return returnData ? await response.json() : null;
  }

  async handleSubmitTask(taskData) {
    await this.handleAuthFetchRequest(
      this.baseEndpointUrl,
      {
        method: 'POST',
        body: taskData
      },
      false,
      `Couldn't properly submit the task, try again later.`,
      this.customErrorHandlers
    );
  }

  async handleGetAllTasks() {
    return await this.handleAuthFetchRequest(
      `${this.baseEndpointUrl}?sort_by=due_date`,
      {
        method: 'GET'
      },
      true,
      `Couldn't properly get all the tasks, try again later.`,
    );
  }

  async handleGetAllTasksCount(completed) {
    const completedQueryParam = completed !== undefined ? '&completed=' + completed : '';

    return await this.handleAuthFetchRequest(
      `${this.baseEndpointUrl}?counter=true${completedQueryParam}`,
      {
        method: 'GET'
      },
      true,
      `Couldn't properly get the task count, try again later.`,
    );
  }

  async handleDeleteTask(taskId) {
    await this.handleAuthFetchRequest(
      `${this.baseEndpointUrl}/${taskId}`,
      {
        method: 'DELETE'
      },
      false,
      `Couldn't properly delete the task, try again later.`
    );
  }

  async handleDeleteAllTasks() {
    await this.handleAuthFetchRequest(
      this.baseEndpointUrl,
      {
        method: 'DELETE'
      },
      false,
      `Couldn't properly delete all the tasks, try again later.`
    );
  }

  async handleCompleteTask(taskId) {
    await this.handleAuthFetchRequest(
      `${this.baseEndpointUrl}/${taskId}`,
      {
        method: 'PATCH',
        body: JSON.stringify({
          is_completed: true
        })
      },
      false,
      `Couldn't properly complete the task, try again later.`
    );
  }

  async handleEditTask(taskId, editedTaskData) {
    return await this.handleAuthFetchRequest(
      `${this.baseEndpointUrl}/${taskId}`,
      {
        method: 'PATCH',
        body: editedTaskData
      },
      true,
      `Couldn't properly update the task, try again later.`,
      this.customErrorHandlers
    );
  }
}
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
    taskData.is_completed = false;
    taskData.completed_at = null;
    console.log(taskData)
    tasks.push(taskData);
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  getTasksFromLocalStorage(completed, targetValue) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    if (targetValue) {
      tasks = tasks.filter(task => task.title.toLowerCase().includes(targetValue.trim().toLowerCase()));
    }
    
    if (completed === undefined) {
      return tasks;
    } 
    else if (completed === false) {
      return tasks.filter(task => task.is_completed === false);
    } 
    else if (completed === true) {
      return tasks.filter(task => task.is_completed === true);
    }
  }

  getTaskCountFromLocalStorage(completed) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    if (completed === undefined) {
      return tasks.length;
    } 
    else if (completed === false) {
      return tasks.reduce((count, task) => {
        return task.is_completed === false ? count + 1 : count;
      }, 0);
    } 
    else if (completed === true) {
      return tasks.reduce((count, task) => {
        return task.is_completed === true ? count + 1 : count;
      }, 0);
    }
  }

  deleteAllTasksFromLocalStorage(completed) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    if (completed === undefined) {
      tasks.length = 0;
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    else if (completed === false) {
      const completedTasks = tasks.filter(task => task.is_completed === true);
      localStorage.setItem('tasks', JSON.stringify(completedTasks));
    } 
    else if (completed === true) {
      const activeTasks = tasks.filter(task => task.is_completed === false);
      localStorage.setItem('tasks', JSON.stringify(activeTasks));
    }
  }

  editTaskFromLocalStorage(taskId, editedTaskData) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Step 2: Find the task to be edited by matching taskId
    const matchedTaskIndex = tasks.findIndex(task => String(task.id) === taskId);

    // Step 3: If the task is found, update it with the new data
    if (matchedTaskIndex !== -1) {
      if (editedTaskData.description === '') {
        editedTaskData.description = null;
      }
      tasks[matchedTaskIndex] = { ...tasks[matchedTaskIndex], ...editedTaskData };
    } 
    else {
      console.error('Task not found');
      return;
    }

    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  completeTaskFromLocalStorage(taskId) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const currentDate = new Date();
    const formattedCurrentDate = currentDate.toISOString().split('T')[0];

    // Step 2: Find the task to be edited by matching taskId
    const matchedTaskIndex = tasks.findIndex(task => String(task.id) === taskId);

    // Step 3: If the task is found, update it with the new data
    if (matchedTaskIndex !== -1) {
      tasks[matchedTaskIndex].is_completed = true;
      tasks[matchedTaskIndex].completed_at = formattedCurrentDate;
    } 
    else {
      console.error('Task not found');
      return;
    }

    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  deleteTaskFromLocalStorage(taskId) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    const matchedTaskIndex = tasks.findIndex(task => String(task.id) === taskId);

    if (matchedTaskIndex !== -1) {
      tasks.splice(matchedTaskIndex, 1);
    } 
    else {
      console.error('Task not found');
      return;
    }

    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  async fetchRequest(apiUrl, options) {
    console.log(options.method + apiUrl);
    const methodsWithBody = ['POST', 'PUT', 'PATCH'];

    return await fetch(apiUrl, {
      ...options,
      headers: {
        ...(methodsWithBody.includes(options.method) ? { 'Content-Type': 'application/json' } : {}),
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
      },
      signal: this.router.getAbortSignal(options.method + apiUrl)
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
      throw new Error(`Oops! Error ${response.status}: ${errorMessage}`);
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
      `We couldn't submit your task. Please try again later.`,
      this.customErrorHandlers
    );
  }

  async handleGetAllTasks(completed, targetValue) {
    const params = new URLSearchParams();
    if (completed !== undefined) params.append('completed', completed);
    if (targetValue) params.append('title', targetValue);
    const queryString = params.toString() ? `?${params.toString()}` : '';

    return await this.handleAuthFetchRequest(
      `${this.baseEndpointUrl}${queryString}`,
      {
        method: 'GET'
      },
      true,
      `We couldn't get all of your tasks. Please try again later.`,
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
      `We couldn't get your task count. Please try again later.`,
    );
  }

  async handleDeleteTask(taskId) {
    await this.handleAuthFetchRequest(
      `${this.baseEndpointUrl}/${taskId}`,
      {
        method: 'DELETE'
      },
      false,
      `We couldn't delete your task. Please try again later.`
    );
  }

  async handleDeleteAllTasks(completed) {
    const completedQueryParam = completed !== undefined ? '?completed=' + completed : '';

    await this.handleAuthFetchRequest(
      this.baseEndpointUrl + completedQueryParam,
      {
        method: 'DELETE'
      },
      false,
      `We couldn't delete all your tasks. Please try again later.`
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
      `We couldn't complete your task. Please try again later.`
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
      `We couldn't update your task. Please try again later.`,
      this.customErrorHandlers
    );
  }
}
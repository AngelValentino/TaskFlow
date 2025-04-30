import config from "../config";

export default class TaskModel {
  constructor(fetchHandler) {
    this.fetchHandler = fetchHandler;
    this.baseEndpointUrl = config.apiUrl + '/tasks';
  }

  addTaskToLocalStorage(taskData) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    taskData.id = Date.now();
    taskData.is_completed = false;
    taskData.completed_at = null;
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

  async handleSubmitTask(taskData) {
    await this.fetchHandler.handleAuthFetchRequest(
      this.baseEndpointUrl,
      {
        method: 'POST',
        body: taskData
      },
      false,
      `We couldn't submit your task. Please try again later.`
    );
  }

  async handleGetAllTasks(completed, targetValue) {
    const params = new URLSearchParams();
    if (completed !== undefined) params.append('completed', completed);
    if (targetValue) params.append('title', targetValue);
    const queryString = params.toString() ? `?${params.toString()}` : '';

    return await this.fetchHandler.handleAuthFetchRequest(
      `${this.baseEndpointUrl}${queryString}`,
      {
        method: 'GET'
      },
      true,
      `We couldn't get all of your tasks. Please try again later.`,
    );
  }

  async handleGetAllTasksCount(completed, isEnhancedTaskManager) {
    const completedQueryParam = completed !== undefined ? '&completed=' + completed : '';

    return await this.fetchHandler.handleAuthFetchRequest(
      `${this.baseEndpointUrl}?counter=true${completedQueryParam}`,
      {
        method: 'GET'
      },
      true,
      isEnhancedTaskManager ? 'enhancedTaskManagerError' : `We couldn't get your task count. Please try again later.`
    );
  }

  async handleDeleteTask(taskId) {
    await this.fetchHandler.handleAuthFetchRequest(
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

    await this.fetchHandler.handleAuthFetchRequest(
      this.baseEndpointUrl + completedQueryParam,
      {
        method: 'DELETE'
      },
      false,
      `We couldn't delete all your tasks. Please try again later.`
    );
  }

  async handleCompleteTask(taskId) {
    await this.fetchHandler.handleAuthFetchRequest(
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
    return await this.fetchHandler.handleAuthFetchRequest(
      `${this.baseEndpointUrl}/${taskId}`,
      {
        method: 'PATCH',
        body: editedTaskData
      },
      false,
      `We couldn't update your task. Please try again later.`
    );
  }
}
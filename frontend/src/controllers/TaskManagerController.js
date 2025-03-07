export default class TaskManagerController {
  constructor(taskManagerView, taskModel, auth, modalView, utils) {
    this.taskManagerView = taskManagerView;
    this.taskModel = taskModel;
    this.auth = auth;
    this.modalView = modalView;
    this.utils = utils;

    this.lms = this.taskManagerView.getDomRefs();

    this.lms.addTaskPromptFormLm.addEventListener('submit', this.submitTask.bind(this));

    this.lms.addTaskBtn.addEventListener('click', this.toggleAddTaskPrompt.bind(this));
    this.lms.searchTaskBtn.addEventListener('click', this.toggleSearchTaskPrompt.bind(this));
    this.lms.clearAllTasksBtn.addEventListener('click', this.handleClearAllTasks.bind(this));
    this.lms.tasksContainerLm.addEventListener('click', this.handleTaskAction.bind(this));
    this.lms.taskManagerTabListLm.addEventListener('click', this.handleSwitchTab.bind(this));
    
    this.taskManagerView.toggleActiveTab(null, localStorage.getItem('currentActiveTabId') || 'task-manger__all-tasks-tab-btn');
    this.getAllTasks();
    this.getActiveTasksCount();
  }

  getTaskId(e) {
    const strId = e.target.closest('.task-manager__task').id;
    const match = strId.match(/-(\d+)$/);
    return match ? match[1] : null;
  }

  handleSwitchTab(e) {
    const clickedTab = e.target.closest('.task-manager__tab-btn');
    if (clickedTab) {
      if (clickedTab.id === localStorage.getItem('currentActiveTabId')) {
        console.log('same tab')
        return;
      }

      this.taskManagerView.toggleActiveTab(clickedTab);
      this.getAllTasks();
    }
  }

  getTitleError(title) {
    if (!title) {
      return 'Title field is required.';
    } 
    else if (title.length > 75) {
      return 'Title must be less than or equal to 75 characters.';
    }

    return null;
  }

  getDueDateError(dueDate) {
    if (!dueDate) {
      return 'Due date field is required.';
    } 
    else if (!this.validateDueDate(dueDate)) {
      return 'Due date must be in YYYY-MM-DD format and also be valid.';
    }

    return null;
  }

  getDescriptionError(description) {
    if (description && description.length > 500) {
      return 'Description must be less than or equal to 500 characters.';
    }

    return null;
  }

  validateDueDate(date) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(date)) return false;
    const parsedDate = new Date(date);
    console.log(parsedDate.getTime())
    return !isNaN(parsedDate.getTime());
  }

  getValidationErrors(taskData) {
    return {
      title: this.getTitleError(taskData.title),
      due_date: this.getDueDateError(taskData.due_date),
      description: this.getDescriptionError(taskData.description)
    };
  }

  submitTaskToLocalStorage(taskData) {
    const errors = this.getValidationErrors(taskData);

    if (Object.values(errors).some(val => val !== null)) {
      this.taskManagerView.renderAddTaskPromptErrors(errors);
      return;
    }

    this.taskModel.addTaskToLocalStorage(taskData);
    this.taskManagerView.resetAddTaskForm();
    this.getActiveTasksCount();
    this.getAllTasks();
    return;
  }

  submitTask(e) {
    e.preventDefault();
    const taskData = this.utils.getFormData(
      e.target, 
      (value, key) => key === 'description' && value === '' ? null : value
    );

    console.log(taskData)

    if (parseInt(localStorage.getItem('taskCount')) >= 2) {
      this.modalView.openInfoModal(
        this.taskManagerView.resetAddTaskForm.bind(this.taskManagerView),
        'infoMaxTasks',
        false
      )
      return;
    }

    // Manage anonymous users task submit
    if (!this.auth.isClientLogged()) {
      console.warn('User is not logged in, submit task to localStorage');
      this.submitTaskToLocalStorage(taskData);
      return;
    }

    let wasFetchAborted = false;
    // Manage logged in users task submit
    this.taskManagerView.updateAddTodoPromptSubmitBtn('Loading...');
    
    this.taskModel.handleSubmitTask(JSON.stringify(taskData))
      .then(() => {
        this.taskManagerView.resetAddTaskForm();
        this.getAllTasks();
        this.getActiveTasksCount();
      })
      .catch(error => {
        if (error.name === 'AbortError') {
          wasFetchAborted = true;
          console.warn('Request aborted due to navigation change');
          return;
        }

        if (error.data) {
          console.error(error.data.errors);
          this.taskManagerView.renderAddTaskPromptErrors(error.data.errors);
        } 
        else {
          this.taskManagerView.clearAddTaskPromptErrors();
          this.taskManagerView.renderGeneralAddTaskPromptError(error);
        }

        console.error(error);
      })
      .finally(() => {
        if (wasFetchAborted) return;
        this.taskManagerView.updateAddTodoPromptSubmitBtn('Add new task');
      });
  }

  getAllTasks(returnFocusHandler) {
    // Manage anonymous users task render
    if (!this.auth.isClientLogged()) {
      const tasks = this.taskModel.getTasksFromLocalStorage(this.utils.getActiveTabFilterParam());
      console.log(tasks)
      this.taskManagerView.generateTasks(tasks);
      return;
    }

    // Manage logged in users task render
    let wasFetchAborted = false;
    this.lms.tasksContainerLm.innerText = 'Loading...';

    this.taskModel.handleGetAllTasks(this.utils.getActiveTabFilterParam())
      .then(data => {
        console.log(data)
        this.taskManagerView.generateTasks(data);
        if (returnFocusHandler) returnFocusHandler();
      })
      .catch(error => {
        if (error.name === 'AbortError') {
          wasFetchAborted = true;
          console.warn('Request aborted due to navigation change');
          return;
        }

        this.lms.tasksContainerLm.innerText = error.message;
        console.error(error.message);
      })
      .finally(() => {
        if (wasFetchAborted) return;
      });
  }

  getActiveTasksCount() {
    // Manage anonymous users task count
    if (!this.auth.isClientLogged()) {
      console.warn('User is not logged in, get count from localStorage');
      const count = this.taskModel.getTaskCountFromLocalStorage(false);
      localStorage.setItem('taskCount', count);
      this.taskManagerView.renderTaskCount(count);
      return;
    }

    // Manage logged in users task count
    this.taskManagerView.updateTaskCountLm('Loading...');
    
    this.taskModel.handleGetAllTasksCount(false)
      .then(count => {
        localStorage.setItem('taskCount', count);
        this.taskManagerView.renderTaskCount(count);
      })
      .catch(error => {
        if (error.name === 'AbortError') {
          console.warn('Request aborted due to navigation change');
          return;
        }

        this.taskManagerView.updateTaskCountLm(error.message);
        console.error(error);
      });
  }

  deleteTask(taskId, closeConfirmModalHandler) {
    if (!this.auth.isClientLogged()) {
      console.warn(`task with id:${taskId} deleted`);
      this.taskModel.deleteTaskFromLocalStorage(taskId);
      this.getAllTasks();
      this.getActiveTasksCount();
      this.taskManagerView.focusAddTaskBtn();
      return;
    }

    this.modalView.lms.confirmModalBtnsContainerLm.innerHTML = 'Loading...';

    this.taskModel.handleDeleteTask(taskId)
      .then(() => {
        console.warn(`task with id:${taskId} deleted`);
        this.modalView.lms.confirmModalBtnsContainerLm.innerHTML = 'Task was successfully deleted.';
        const timId = setTimeout(() => {
          closeConfirmModalHandler();
          console.warn('closed confirm modal after successful delete')
          this.taskManagerView.focusAddTaskBtn();
        }, 500);
        this.modalView.timIds.closeConfirmModalAfterFetch = timId;
        this.getAllTasks();
        this.getActiveTasksCount();
      })
      .catch(error => {
        if (error.name === 'AbortError') {
          console.warn('Request aborted due to navigation change');
          return;
        }

        this.modalView.lms.confirmModalBtnsContainerLm.innerHTML = error.message;
      });
  }

  deleteAllTasks(closeConfirmModalHandler, completed) {
    // Manage anonymous users all task delete
    if (!this.auth.isClientLogged()) {
      console.warn('user is not logged in, delete all tasks from local storage');
      this.taskModel.deleteAllTasksFromLocalStorage(completed);
      this.getAllTasks();
      this.getActiveTasksCount();
      return;
    }
    
    // Manage logged in users all task delete
    this.modalView.updateConfirmModalBtnsContainer(null, 'Loading...');
    this.modalView.lms.confirmModalDeleteOptionsContainerLm.style.display = 'none';

    this.taskModel.handleDeleteAllTasks(completed)
      .then(() => {
        console.warn(`all tasks deleted`);
        this.modalView.updateConfirmModalBtnsContainer(completed);

        const timId = setTimeout(() => {
          closeConfirmModalHandler();
          console.warn('closed confirm modal after successful delete');
        }, 500);
        this.modalView.timIds.closeConfirmModalAfterFetch = timId;
        
        this.getAllTasks();
        this.getActiveTasksCount();
      })
      .catch(error => {
        if (error.name === 'AbortError') {
          console.warn('Request aborted due to navigation change');
          return;
        }

        this.modalView.updateConfirmModalBtnsContainer(null, error.message);
        console.error(error);
      });
  }

  handleClearAllTasks() {
    if (parseInt(localStorage.getItem('taskCount')) === 0) {
      this.modalView.openInfoModal(
        null,
        'InfoEmptyTaskList',
        false
      );
      return;
    }

    this.modalView.openConfirmModal(
      this.deleteAllTasks.bind(this),
      this.auth.isClientLogged(),
      'confirmDeleteAllTasks'
    );
  }

  completeTask(taskId, closeConfirmModalHandler) {
    if (!this.auth.isClientLogged()) {
      this.taskModel.completeTaskFromLocalStorage(taskId);
      console.warn(`task with id:${taskId} was completed`);
      this.getAllTasks();
      this.getActiveTasksCount();
      this.taskManagerView.focusAddTaskBtn();
      return;
    }

    this.modalView.lms.confirmModalBtnsContainerLm.innerHTML = 'Loading...';

    this.taskModel.handleCompleteTask(taskId)
      .then(() => {
        console.warn(`task with id:${taskId} was completed`);
        this.modalView.lms.confirmModalBtnsContainerLm.innerHTML = 'Task was successfully completed.';
        const timId = setTimeout(() => {
          closeConfirmModalHandler();
          console.warn('closed confirm modal after successful task completion')
          this.taskManagerView.focusAddTaskBtn();
        }, 500);
        this.modalView.timIds.closeConfirmModalAfterFetch = timId;
        this.getAllTasks(this.taskManagerView.focusAddTaskBtn.bind(this.taskManagerView));
        this.getActiveTasksCount();
      })
      .catch(error => {
        if (error.name === 'AbortError') {
          console.warn('Request aborted due to navigation change');
          return;
        }

        this.modalView.lms.confirmModalBtnsContainerLm.innerHTML = error.message;
      });
  }

  editTaskFromLocalStorage(taskId, editedTaskData, closeEditModalHandler) {
    const errors = this.getValidationErrors(editedTaskData);

    if (Object.values(errors).some(val => val !== null)) {
      this.modalView.renderEditTaskFormErrors(errors);
      return;
    }

    this.taskModel.editTaskFromLocalStorage(taskId, editedTaskData);
    console.warn(`task with id:${taskId} was updated from local storage`);
    closeEditModalHandler();
    this.getAllTasks();
    this.taskManagerView.returnFocusToEditTaskBtn(taskId);
  }

  editTask(taskId, editedTaskData, closeEditModalHandler) {
    console.log('task id: ' + taskId);
    console.log(editedTaskData);

    if (!this.auth.isClientLogged()) {
      this.editTaskFromLocalStorage(taskId, editedTaskData, closeEditModalHandler);
      return;
    }

    let wasFetchAborted = false;

    this.modalView.lms.editModalFormSubmitBtn.innerText = 'Loading...';

    this.taskModel.handleEditTask(taskId, JSON.stringify(editedTaskData))
      .then(rowsUpdated => {
        console.log(rowsUpdated)
        console.warn(`task with id:${taskId} was updated`);
        closeEditModalHandler();
        console.warn('closed edit modal after successful task update');
        this.getAllTasks(this.taskManagerView.returnFocusToEditTaskBtn.bind(this.taskManagerView, taskId));
      })
      .catch(error => {
        if (error.name === 'AbortError') {
          wasFetchAborted = true;
          console.warn('Request aborted due to navigation change');
          return;
        }

        if (error.data) {
          console.error(error.data.errors);
          this.modalView.renderEditTaskFormErrors(error.data.errors);
        } 
        else {
          this.modalView.clearEditTaskFormErrors();
          this.modalView.renderGeneralEditTaskFormError(error);
        }

        console.error(error.message);
      })
      .finally(() => {
        if (wasFetchAborted) return;
        this.modalView.lms.editModalFormSubmitBtn.innerText = 'Edit task';
      });
  }

  handleTaskAction(e) {
    if (e.target.closest('.task-manager__complete-task-btn')) {
      const taskId = this.getTaskId(e);
      console.log(taskId);

      this.modalView.openConfirmModal(
        this.completeTask.bind(this, taskId),
        this.auth.isClientLogged(),
        'confirmComplete',
        false,
        false
      );
    } 
    else if (e.target.closest('.task-manager__edit-task-btn')) {
      const taskId = this.getTaskId(e);
      console.log(taskId);

      const taskLm = document.getElementById(e.target.closest('.task-manager__task').id)

      const taskData = {
        title: taskLm.querySelector('.task-manager__task-title').innerText,
        due_date: taskLm.querySelector('.task-manger__task-due-date').getAttribute('datetime'),
        description: taskLm.querySelector('.task-manager__task-desc')?.innerHTML || ''
      };

      this.modalView.openEditModal(
        taskData, 
        this.editTask.bind(this, taskId),
        false,
        taskId
      );
    } 
    else if (e.target.closest('.task-manager__delete-task-btn')) {
      const taskId = this.getTaskId(e);
      console.log(taskId);

      this.modalView.openConfirmModal(
        this.deleteTask.bind(this, taskId),
        this.auth.isClientLogged(),
        'confirmDeleteTask',
        false,
        false
      );
    }
  }

  toggleAddTaskPrompt() {
    if (this.lms.addTaskPromptLm.classList.contains('active')) {
      this.taskManagerView.confirmDiscardPromptData();
    } 
    else {
      if (this.lms.searchTaskPromptLm.classList.contains('active')) {
        this.taskManagerView.closeSearchTaskPrompt();
      }
      this.taskManagerView.openAddTaskPrompt();
    }
  }

  toggleSearchTaskPrompt() {
    if (this.lms.searchTaskPromptLm.classList.contains('active')) {
      this.taskManagerView.closeSearchTaskPrompt();
    } 
    else {
      // Check if add task form has been edited
      if (this.utils.isFormPopulated(this.lms.addTaskPromptFormLm)) {
        this.taskManagerView.confirmDiscardPromptData();
        return;
      }
      
      if (this.lms.addTaskPromptLm.classList.contains('active')) {
        this.taskManagerView.closeAddTaskPrompt();
      }
      this.taskManagerView.openSearchTaskPrompt();      
    }
  }
}
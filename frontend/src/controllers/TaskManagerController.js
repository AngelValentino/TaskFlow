export default class TaskManagerController {
  constructor(taskManagerView, taskModel, auth, modalView) {
    this.taskManagerView = taskManagerView;
    this.taskModel = taskModel;
    this.auth = auth;
    this.modalView = modalView

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

  submitTask(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const taskData = {};
    let wasFetchAborted = false;

    formData.forEach((value, key) => {
      taskData[key] = value;
    });

    if (!this.auth.isClientLogged()) {
      console.warn('User is not logged in, insert in localStorage');
      this.taskModel.addTaskToLocalStorage(taskData);
      this.taskManagerView.resetAddTaskForm();
      this.getAllTasks();
      return;
    }

    this.lms.submitTaskBtn.innerText = 'Loading...';
    console.log(taskData);
    this.taskModel.handleSubmitTask(JSON.stringify(taskData))
      .then(() => {
        console.log('task submitted');
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

        console.error(error.message);
        if (error.data) console.error(error.data?.errors);
      })
      .finally(() => {
        if (wasFetchAborted) return;
        this.lms.submitTaskBtn.innerText = 'Add new task';
      });
  }

  getAllTasks() {
    if (!this.auth.isClientLogged()) {
      console.warn('User is not logged in, get tasks from localStorage');
      const tasks = this.taskModel.getTasksFromLocalStorage();
      this.taskManagerView.generateTasks(tasks);
      return;
    }

    let wasFetchAborted = false;
    this.lms.tasksContainerLm.innerText = 'Loading...';

    this.taskModel.handleGetAllTasks(this.taskManagerView.getActiveTabFilterParam())
      .then(data => {
        this.taskManagerView.generateTasks(data);
      })
      .catch(error => {
        if (error.name === 'AbortError') {
          wasFetchAborted = true;
          console.warn('Request aborted due to navigation change');
          return;
        }

        console.error(error.message);
      })
      .finally(() => {
        if (wasFetchAborted) return;
      });
  }

  getActiveTasksCount() {
    if (!this.auth.isClientLogged()) {
      console.warn('User is not logged in, get count from localStorage');
      return;
    }

    this.lms.taskManagerTaskCountLm.innerText = 'Loading...'
    
    this.taskModel.handleGetAllTasksCount(false)
      .then(count => {
        console.log(count)
        if (count === 0) {
          this.lms.taskManagerTaskCountLm.innerText = 'No tasks left';
        } 
        else if (count === 1) {
          this.lms.taskManagerTaskCountLm.innerText = count + ' task left';
        } 
        else {
          this.lms.taskManagerTaskCountLm.innerText = count + ' tasks left';
        }
      })
      .catch(error => {
        if (error.name === 'AbortError') {
          console.warn('Request aborted due to navigation change');
          return;
        }

        console.error(error);
        this.lms.taskManagerTaskCountLm.innerText = error
      });
  }

  deleteTask(taskId, closeConfirmModalHandler) {
    this.modalView.lms.confirmModalBtnsContainerLm.innerHTML = 'Loading...';

    this.taskModel.handleDeleteTask(taskId)
      .then(() => {
        console.warn(`task with id:${taskId} deleted`);
        this.modalView.lms.confirmModalBtnsContainerLm.innerHTML = 'Task was successfully deleted.';
        const timId = setTimeout(() => {
          closeConfirmModalHandler();
          console.warn('closed confirm modal after successful delete')
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

  deleteAllTasks(closeConfirmModalHandler, completed = undefined) {
    this.modalView.lms.confirmModalBtnsContainerLm.innerHTML = 'Loading...';

    this.taskModel.handleDeleteAllTasks(completed)
      .then(() => {
        console.warn(`all tasks deleted`);
        if (completed === undefined) {
          this.modalView.lms.confirmModalBtnsContainerLm.innerHTML = 'All tasks were successfully deleted.';
        } 
        else if (completed === true) {
          this.modalView.lms.confirmModalBtnsContainerLm.innerHTML = 'All completed tasks were successfully deleted.';
        } 
        else if (completed === false) {
          this.modalView.lms.confirmModalBtnsContainerLm.innerHTML = 'All active tasks were successfully deleted.';
        }
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

        this.modalView.lms.confirmModalBtnsContainerLm.innerHTML = error.message;
      });
  }

  handleClearAllTasks() {
    if (!this.auth.isClientLogged()) {
      console.warn('User is not logged in, delete all tasks from localStorage');
      return;
    }

    this.modalView.openConfirmModal(
      this.deleteAllTasks.bind(this),
      true,
      'confirmDeleteAllTasks'
    );
  }

  completeTask(taskId, closeConfirmModalHandler) {
    this.modalView.lms.confirmModalBtnsContainerLm.innerHTML = 'Loading...';

    this.taskModel.handleCompleteTask(taskId)
      .then(() => {
        console.warn(`task with id:${taskId} was completed`);
        this.modalView.lms.confirmModalBtnsContainerLm.innerHTML = 'Task was successfully completed.';
        const timId = setTimeout(() => {
          closeConfirmModalHandler();
          console.warn('closed confirm modal after successful task completion')
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

  editTask(taskId, editedTaskData, closeEditModalHandler) {
    console.log('task id: ' + taskId);
    console.log(editedTaskData);
    let wasFetchAborted = false;

    this.modalView.lms.editModalFormSubmitBtn.innerText = 'Loading...';

    this.taskModel.handleEditTask(taskId, JSON.stringify(editedTaskData))
      .then(rowsUpdated => {
        console.log(rowsUpdated)
        console.warn(`task with id:${taskId} was updated`);
        closeEditModalHandler();
        console.warn('closed edit modal after successful task update');
        this.getAllTasks();
      })
      .catch(error => {
        if (error.name === 'AbortError') {
          wasFetchAborted = true;
          console.warn('Request aborted due to navigation change');
          return;
        }

        console.error(error.message);
        if (error.data) console.error(error.data?.errors);
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

      if (!this.auth.isClientLogged()) {
        console.warn('User is not logged in, complete task from localStorage');
        return;
      }

      this.modalView.openConfirmModal(
        this.completeTask.bind(this, taskId),
        true,
        'confirmComplete'
      );
    } 
    else if (e.target.closest('.task-manager__edit-task-btn')) {
      const taskId = this.getTaskId(e);
      console.log(taskId);

      if (!this.auth.isClientLogged()) {
        console.warn('User is not logged in, edit task from localStorage');
        return;
      }

      const taskLm = document.getElementById(e.target.closest('.task-manager__task').id)

      const taskData = {
        title: taskLm.querySelector('.task-manager__task-title').innerText,
        due_date: taskLm.querySelector('.task-manger__task-due-date').getAttribute('datetime'),
        description: taskLm.querySelector('.task-manager__task-desc')?.innerHTML
      };

      this.modalView.openEditModal(
        taskData, 
        this.editTask.bind(this, taskId)
      );
    } 
    else if (e.target.closest('.task-manager__delete-task-btn')) {
      const taskId = this.getTaskId(e);
      console.log(taskId);

      if (!this.auth.isClientLogged()) {
        console.warn('User is not logged in, delete task from localStorage');
        return;
      }

      this.modalView.openConfirmModal(
        this.deleteTask.bind(this, taskId),
        true,
        'confirmDeleteTask'
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
      if (this.taskManagerView.isAddTaskFormEdited()) {
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
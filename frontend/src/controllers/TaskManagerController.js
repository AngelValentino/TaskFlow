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

    this.lms.tasksContainerLm.addEventListener('click', this.handleTaskAction.bind(this));
    
    this.getAllTasks();
  }

  getTaskId(e) {
    const strId = e.target.closest('.todo').id;
    const match = strId.match(/-(\d+)$/);
    return match ? match[1] : null;
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

    this.taskModel.handleGetAllTasks()
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

  deleteTask(taskId, closeConfirmModalHandler) {
    if (!this.auth.isClientLogged()) {
      console.warn('User is not logged in, delete task from localStorage');
      return;
    }

    // TODO Add abort fetch request functionality to avoid render issues
    // TODO Add the ability to change modal description

    this.modalView.lms.confirmModalBtnsContainerLm.innerHTML = 'Loading...';

    this.taskModel.handleDeleteTask(taskId)
      .then(() => {
        console.warn(`task with id:${taskId} deleted`);
        this.modalView.lms.confirmModalBtnsContainerLm.innerHTML = 'Task was successfully deleted';
        const timId = setTimeout(() => {
          closeConfirmModalHandler();
          console.warn('closed confirm modal after successful delete')
        }, 500);
        this.modalView.timIds.closeConfirmModalAfterFetch = timId;
        this.getAllTasks();
      })
      .catch(error => {
        if (error.name === 'AbortError') {
          wasFetchAborted = true;
          console.warn('Request aborted due to navigation change');
          return;
        }

        this.modalView.lms.confirmModalBtnsContainerLm.innerHTML = error.message;
      });
  }

  handleTaskAction(e) {
    if (e.target.closest('.todo__complete-btn')) {
      const taskId = this.getTaskId(e);
      console.log(taskId);
    } 
    else if (e.target.closest('.todo__edit-btn')) {
      const taskId = this.getTaskId(e);
      console.log(taskId);
    } 
    else if (e.target.closest('.todo__delete-btn')) {
      const taskId = this.getTaskId(e);
      console.log(taskId);
      this.modalView.openConfirmModal(
        this.deleteTask.bind(this, taskId),
        true
      );
      //this.deleteTask(taskId);
      // TODO Open confirm modal with delete task function
      // TODO Abort fetch request in case user closes the modal abruptly
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
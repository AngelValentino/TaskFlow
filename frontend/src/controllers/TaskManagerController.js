export default class TaskManagerController {
  constructor(taskManagerView, taskModel, auth) {
    this.taskManagerView = taskManagerView;
    this.taskModel = taskModel;
    this.auth = auth;

    this.lms = this.taskManagerView.getDomRefs();

    this.lms.addTaskPromptFormLm.addEventListener('submit', this.submitTask.bind(this));

    this.lms.addTaskBtn.addEventListener('click', this.toggleAddTaskPrompt.bind(this));
    this.lms.searchTaskBtn.addEventListener('click', this.toggleSearchTaskPrompt.bind(this));
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
      return;
    }

    this.lms.submitTaskBtn.innerText = 'Loading...';
    console.log(taskData);
    this.taskModel.handleSubmitTask(JSON.stringify(taskData))
      .then(() => {
        console.log('task submitted');
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

  toggleAddTaskPrompt() {
    if (this.lms.addTaskPromptLm.classList.contains('active')) {
      this.taskManagerView.confirmDiscardPromptData();
    } 
    else {
      if (this.lms.searchTaskPromptLm.classList.contains('active')) {
        this.taskManagerView.hideSearchTaskPrompt();
      }
      this.taskManagerView.showAddTaskPrompt();
    }
  }

  toggleSearchTaskPrompt() {
    if (this.lms.searchTaskPromptLm.classList.contains('active')) {
      this.taskManagerView.hideSearchTaskPrompt();
    } 
    else {
      // Check if add task form has been edited
      if (this.taskManagerView.isAddTaskFormEdited()) {
        this.taskManagerView.confirmDiscardPromptData();
        return;
      }
      
      if (this.lms.addTaskPromptLm.classList.contains('active')) {
        this.taskManagerView.hideAddTaskPrompt();
      }
      this.taskManagerView.showSearchTaskPrompt();      
    }
  }
}
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
    //TODO Get errors
    //TODO Check if access or refresh token are valid
    //TODO Submit data
    e.preventDefault();
    const formData = new FormData(e.target);
    const taskData = {};

    formData.forEach((value, key) => {
      taskData[key] = value;
    });

    if (!this.auth.isClientLogged()) {
      console.warn('User is not logged in, insert in localStorage');
      return;
    }

    console.log(taskData);
    this.taskModel.handleSubmitTask(JSON.stringify(taskData))
      .then(() => {
        console.log('task submitted');
      })
      .catch(error => {
        if (error.name === 'AbortError') {
          console.warn('Request aborted due to navigation change');
          return;
        }

        console.error(error.message);

        if (error.data) console.error(error.data?.errors);
      })
      .finally(() => {

      });

  }

  toggleAddTaskPrompt() {
    if (this.lms.addTaskPromptLm.classList.contains('active')) {
      this.taskManagerView.hideAddTaskPrompt();
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
      if (this.lms.addTaskPromptLm.classList.contains('active')) {
        this.taskManagerView.hideAddTaskPrompt();
      }
      this.taskManagerView.showSearchTaskPrompt();      
    }
  }
}
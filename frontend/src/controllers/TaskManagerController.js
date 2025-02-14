export default class TaskManagerController {
  constructor(taskManagerView) {
    this.taskManagerView = taskManagerView;

    this.lms = this.taskManagerView.getDomRefs();

    this.lms.addTaskBtn.addEventListener('click', this.toggleAddTaskPrompt.bind(this));
    this.lms.searchTaskBtn.addEventListener('click', this.toggleSearchTaskPrompt.bind(this));
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
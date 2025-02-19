export default class TaskManagerView {
  constructor(modalHandler, modalView) {
    this.modalHandler = modalHandler;
    this.modalView = modalView;
    this.timIds = {};
    this.lms = {
      addTaskBtn: document.getElementById('todo-app-intro__add-btn'),
      addTaskPromptLm: document.getElementById('add-todo-prompt'),
      addTaskPromptCloseBtn: document.getElementById('add-todo-prompt__close-btn'),
      addTaskPromptFormLm: document.getElementById('add-todo-prompt__form'),
      submitTaskBtn: document.getElementById('add-todo-prompt__submit-btn'),
      searchTaskPromptLm: document.getElementById('search-todo-prompt'),
      searchTaskBtn: document.getElementById('todo-app-intro__search-btn'),
      searchTaskInputLm: document.getElementById('search-todo-prompt__search-input'),
      searchTaskDefaultIcon: document.getElementById('search-todo-prompt__search-icon'),
      searchTaskCloseIcon: document.getElementById('search-todo-prompt__close-btn')
    };
  }

  getDomRefs() {
    return this.lms;
  }

  showPrompt(promptLm, btnLm, firstFocusableLm, hidePromptTimId, timeout) {
    clearTimeout(hidePromptTimId);

    promptLm.removeAttribute('hidden');
    this.modalHandler.setActiveBtn(btnLm);

    setTimeout(() => {
      promptLm.classList.add('active');
    }, 20);

    this.timIds.focusFirstPromptLm = setTimeout(() => {
      this.modalHandler.toggleModalFocus('add', firstFocusableLm);
    }, timeout);
  }

  hidePrompt(promptLm, btnLm, focusFirstPromptLmTimId, hidePromptKey, timeout) {
    clearTimeout(focusFirstPromptLmTimId);

    this.modalHandler.toggleModalFocus('return', null, btnLm);
    this.modalHandler.setActiveBtn(btnLm);
    promptLm.classList.remove('active');
    
    this.timIds[hidePromptKey] = setTimeout(() => {
      promptLm.setAttribute('hidden', '');
    }, timeout);    
  }

  openAddTaskPrompt() {
    this.showPrompt(
      this.lms.addTaskPromptLm,
      this.lms.addTaskBtn,
      this.lms.addTaskPromptCloseBtn,
      this.timIds.hideAddTaskPrompt,
      250
    );

    // Add event listeners
    this.modalHandler.addModalEvents(
      'addTaskPrompt',
      '.add-todo-prompt',
      document.body,
      this.lms.addTaskPromptLm,
      [this.lms.addTaskPromptCloseBtn],
      this.confirmDiscardPromptData.bind(this)
    );
  }

  closeAddTaskPrompt() {
    this.hidePrompt(
      this.lms.addTaskPromptLm,
      this.lms.addTaskBtn,
      this.timIds.focusFirstPromptLm,
      'hideAddTaskPrompt',
      1500
    );

    // Remove event listeners
    this.modalHandler.removeModalEvents(
      'addTaskPrompt',
      document.body,
      this.lms.addTaskPromptLm,
      [this.lms.addTaskPromptCloseBtn]
    );
  }

  openSearchTaskPrompt() {
    this.showPrompt(
      this.lms.searchTaskPromptLm,
      this.lms.searchTaskBtn,
      this.lms.searchTaskInputLm,
      this.timIds.hideSearchTaskPrompt,
      1250
    );

    // Add event listeners
    this.modalHandler.addModalEvents(
      'searchTaskPrompt',
      '.search-todo-prompt',
      document.body,
      null,
      null,
      this.closeSearchTaskPrompt.bind(this)
    );
  }

  closeSearchTaskPrompt() {
    this.hidePrompt(
      this.lms.searchTaskPromptLm,
      this.lms.searchTaskBtn,
      this.timIds.focusFirstPromptLm,
      'hideSearchTaskPrompt',
      1250
    );

    // Remove event listeners
    this.modalHandler.removeModalEvents(
      'searchTaskPrompt',
      document.body
    );
  }

  isAddTaskFormEdited() {
    const formData = new FormData(this.lms.addTaskPromptFormLm);
    const taskData = {};

    formData.forEach((value, key) => {
      taskData[key] = value;
    });

    for (const key in taskData) {
      if (taskData[key]) {
        return true;
      }
    }

    return false;
  }

  resetAddTaskForm() {
    this.lms.addTaskPromptFormLm.reset();
    this.closeAddTaskPrompt();
  }

  confirmDiscardPromptData() {
    if (this.isAddTaskFormEdited()) {
      this.modalView.openConfirmModal(this.resetAddTaskForm.bind(this));
    }
    else {
      this.closeAddTaskPrompt();
    }
  }
}
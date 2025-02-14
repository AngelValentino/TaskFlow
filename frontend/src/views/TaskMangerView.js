export default class TaskManagerView {
  constructor(modalHandler) {
    this.modalHandler = modalHandler;
    this.timIds = {};
    this.lms = {
      addTaskBtn: document.getElementById('todo-app-intro__add-btn'),
      addTaskPromptLm: document.getElementById('add-todo-prompt'),
      addTaskPromptCloseBtn: document.getElementById('add-todo-prompt__close-btn'),
      addTaskPromptFormLm: document.getElementById('add-todo-prompt__form'),
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

  showAddTaskPrompt() {
    this.showPrompt(
      this.lms.addTaskPromptLm,
      this.lms.addTaskBtn,
      this.lms.addTaskPromptCloseBtn,
      this.timIds.hideAddTaskPrompt,
      250
    );
  }

  hideAddTaskPrompt() {
    this.hidePrompt(
      this.lms.addTaskPromptLm,
      this.lms.addTaskBtn,
      this.timIds.focusFirstPromptLm,
      'hideAddTaskPrompt',
      1500
    );
  }

  showSearchTaskPrompt() {
    this.showPrompt(
      this.lms.searchTaskPromptLm,
      this.lms.searchTaskBtn,
      this.lms.searchTaskInputLm,
      this.timIds.hideSearchTaskPrompt,
      1250
    );
  }

  hideSearchTaskPrompt() {
    this.hidePrompt(
      this.lms.searchTaskPromptLm,
      this.lms.searchTaskBtn,
      this.timIds.focusFirstPromptLm,
      'hideSearchTaskPrompt',
      1250
    );
  }
}
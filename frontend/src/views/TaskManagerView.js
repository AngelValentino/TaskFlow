import Task from '../pages/dashboard/components/Task.js' ;
import TaskCompleted from '../pages/dashboard/components/CompletedTask.js';
import TasksListPlaceholder from '../pages/dashboard/components/TasksListPlaceholder.js';
import TasksListLoader from '../pages/dashboard/components/TasksListLoader.js';
import TasksListError from '../pages/dashboard/components/TasksListError.js';
import EmptyTasksListPlaceholder from '../pages/dashboard/components/EmptyTasksListPlacehodler.js';

export default class TaskManagerView {
  constructor(modalHandler, modalView, utils, loadHandler) {
    this.modalHandler = modalHandler;
    this.modalView = modalView;
    this.utils = utils;
    this.loadHandler = loadHandler;
    this.timIds = {};
    this.controllerMethods = {};
    this.lms = {
      addTaskBtn: document.getElementById('task-manager__dashboard-add-btn'),
      addTaskPromptLm: document.getElementById('task-manager__add-prompt'),
      addTaskPromptCloseBtn: document.getElementById('task-manager__add-prompt-close-btn'),
      addTaskPromptFormLm: document.getElementById('task-manager__add-prompt-form'),
      submitTaskBtn: document.getElementById('task-manager__add-prompt-submit-btn'),
      addTaskPromptTitleErrorLm: document.getElementById('task-manager__add-prompt-title-error'),
      addTaskPromptDueDateErrorLm: document.getElementById('task-manager__add-prompt-due-date-error'),
      addTaskPromptDescErrorLm: document.getElementById('task-manager__add-prompt-desc-error'),
      addTaskPromptErrorLm: document.getElementById('task-manager__add-prompt-error'),
      searchTaskPromptLm: document.getElementById('task-manager__search-prompt'),
      searchTaskBtn: document.getElementById('task-manager__dashboard-search-btn'),
      searchTaskInputLm: document.getElementById('task-manager__search-prompt-input'),
      searchTaskDefaultIcon: document.getElementById('task-manager__search-svg'),
      searchTaskCloseIcon: document.getElementById('task-manager__search-prompt-close-btn'),
      clearAllTasksBtn: document.getElementById('task-manager__dashboard-clear-btn'),
      tasksContainerLm: document.getElementById('task-manager__tasks-list'),
      taskManagerTaskCountLm: document.getElementById('task-manager__dashboard-tasks-count'),
      taskManagerTaskCountErrorLm: document.getElementById('task-manager__dashboard-tasks-count-error'),
      currentDateLm: document.getElementById('task-manager__dashboard-date'),
      taskManagerTabLms: document.querySelectorAll('.task-manager__tab-btn'),
      taskManagerTabListLm: document.getElementById('task-manager__tab-list')
    };
  }

  getDomRefs() {
    return this.lms;
  }

  getCurrentSearchValue() {
    return this.lms.searchTaskInputLm.value.trim();
  }

  setControllerMethods(methods) {
    Object.keys(methods).forEach(key => {
      this.controllerMethods[key] = methods[key];
    });
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
      '.task-manager__add-prompt',
      document.body,
      this.lms.addTaskPromptLm,
      [this.lms.addTaskPromptCloseBtn],
      this.confirmDiscardPromptData.bind(this)
    );
  }

  closeAddTaskPrompt() {
    this.clearAddTaskPromptErrors();

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
      '.task-manager__search-prompt',
      document.body,
      null,
      null,
      this.closeSearchTaskPrompt.bind(this)
    );
  }

  toggleClearSearchIcon(searchValue) {
    if (searchValue === '') {
      // If input is empty, show the default search icon and hide the close icon
      this.lms.searchTaskCloseIcon.classList.remove('active');
      this.lms.searchTaskDefaultIcon.classList.remove('active');
    } 
    else {
      // If input has text, show the close icon and hide the default search icon
      this.lms.searchTaskCloseIcon.classList.add('active');
      this.lms.searchTaskDefaultIcon.classList.add('active');
    }
  }

  resetSearchTaskInput(returnFocus) {
    this.lms.searchTaskInputLm.value = '';
    this.toggleClearSearchIcon(this.getCurrentSearchValue());
    this.utils.clearDebounce('searchTask');
    this.controllerMethods.getAllTasks();
    if (returnFocus) {
      this.lms.searchTaskInputLm.focus();
    }
  }

  closeSearchTaskPrompt() {
    this.resetSearchTaskInput();

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

  resetAddTaskForm() {
    this.lms.addTaskPromptFormLm.reset();
    this.closeAddTaskPrompt();
  }

  isAddTaskFormEdited() {
    return this.utils.isFormPopulated(this.lms.addTaskPromptFormLm);
  }

  confirmDiscardPromptData() {
    if (this.isAddTaskFormEdited()) {
      this.modalView.openConfirmModal(
        this.resetAddTaskForm.bind(this),
        false,
        'confirmDiscardChanges',
        false,
        false
      );
    }
    else {
      this.closeAddTaskPrompt();
    }
  }

  renderGeneralAddTaskPromptError(error) {
    this.lms.addTaskPromptErrorLm.classList.add('active');
    this.lms.addTaskPromptErrorLm.innerText = error.message;
  }

  renderAddTaskPromptErrors(errors) {
    this.utils.renderFormErrors(errors, {
      title: this.lms.addTaskPromptTitleErrorLm,
      due_date: this.lms.addTaskPromptDueDateErrorLm,
      description: this.lms.addTaskPromptDescErrorLm
    });
  }

  clearAddTaskPromptErrors() {
    this.utils.clearFormErrors([
      this.lms.addTaskPromptTitleErrorLm,
      this.lms.addTaskPromptDueDateErrorLm,
      this.lms.addTaskPromptDescErrorLm,
      this.lms.addTaskPromptErrorLm
    ]);
  }

  updateAddTodoPromptSubmitBtn(text) {
    this.lms.submitTaskBtn.innerText = text;
  }

  focusAddTaskBtn() {
    this.lms.addTaskBtn.focus();
  }

  updateCurrentDashboardDate() {
    const currentDate = new Date();
    
    this.lms.currentDateLm.innerText = this.utils.formatDate(currentDate).longFormat;
    this.lms.currentDateLm.setAttribute('datetime', this.utils.formatDate(currentDate).isoFormat);
  }

  //TODO SVG spinner does not load properly on page load, it needs to be changed
  renderTasksListLoader() {
    this.lms.tasksContainerLm.innerHTML = TasksListLoader.getHtml();
  }

  renderTasksListError(error) {
    this.lms.tasksContainerLm.innerHTML = TasksListError.getHtml(error);
  }

  renderTasks(taskData) {
    if (taskData.length === 0) {
      this.lms.tasksContainerLm.innerHTML = this.getCurrentSearchValue() 
        ? EmptyTasksListPlaceholder.getHtml() 
        : TasksListPlaceholder.getHtml()

      this.loadHandler.blurLoadImages();
      return;
    }

    const sortedTasks = taskData.sort((a, b) => {
      // If both are completed, keep their order
      if (a.is_completed && b.is_completed) return 0;
      
      // If one is completed, move it down
      if (a.is_completed) return 1;
      if (b.is_completed) return -1;
  
      // Sort by due_date (ascending)
      return new Date(a.due_date) - new Date(b.due_date);
    });

    this.lms.tasksContainerLm.innerHTML = sortedTasks
      .map(task => task.is_completed 
        ? TaskCompleted.getHtml(task, this.getCurrentSearchValue()) 
        : Task.getHtml(task, this.getCurrentSearchValue()))
      .join('');
  }

  updateTaskCount(text) {
    this.lms.taskManagerTaskCountLm.innerText = text;
  }

  renderTaskCount(count) {
    if (count === 0) {
      this.updateTaskCount('No tasks left');
    } 
    else if (count === 1) {
      this.updateTaskCount(count + ' task left');
    } 
    else {
      this.updateTaskCount(count + ' tasks left');
    }
  }

  renderTaskCountError(message) {
    this.lms.taskManagerTaskCountErrorLm.innerText = message;
    this.lms.taskManagerTaskCountErrorLm.classList.add('active');
  }

  clearTaskCountError() {
    this.lms.taskManagerTaskCountErrorLm.innerText = '';
    this.lms.taskManagerTaskCountErrorLm.classList.remove('active');
  }

  setActiveTab(tab) {
    tab.setAttribute('aria-selected', true);
    tab.setAttribute('aria-expanded', true);
    tab.classList.add('active');
    localStorage.setItem('currentActiveTabId', tab.id);
  }

  setInactiveTab(tab) {
    tab.setAttribute('aria-selected', false);
    tab.setAttribute('aria-expanded', false);
    tab.classList.remove('active');
  }

  toggleActiveTab(currentTab, tabId) {
    this.lms.taskManagerTabLms.forEach(tab => {
      if (tabId) {
        if (tab.id === tabId) {
          this.setActiveTab(tab);
        }
        return;
      }

      if (tab !== currentTab) {
        this.setInactiveTab(tab);
      } 
      else {
        this.setActiveTab(tab);
      }
    });
  }

  returnFocusToEditTaskBtn(taskId) {
    const editTaskBtn = document.getElementById(`task-manager__edit-task-btn-${taskId}`);
    editTaskBtn.focus();
  }
}
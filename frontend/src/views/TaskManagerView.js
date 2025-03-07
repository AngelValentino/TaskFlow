import TaskComponent from '../pages/dashboard/components/Task.js' ;
import TaskCompletedComponent from '../pages/dashboard/components/CompletedTask.js';

export default class TaskManagerView {
  constructor(modalHandler, modalView, utils) {
    this.modalHandler = modalHandler;
    this.modalView = modalView;
    this.utils = utils;
    this.timIds = {};
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
      taskManagerTabLms: document.querySelectorAll('.task-manager__tab-btn'),
      taskManagerTabListLm: document.getElementById('task-manager__tab-list') 
    };
  }

  getDomRefs() {
    return this.lms;
  }

  generateTasksPlaceholder() {
    return 'Everything done.'
  }

  generateTasks(taskData) {
    if (taskData.length === 0) {
      this.lms.tasksContainerLm.innerHTML = this.generateTasksPlaceholder();
      return;
    }

    this.lms.tasksContainerLm.innerHTML = taskData
      .map(task => {
        if (task.is_completed) {
          return TaskCompletedComponent.getHtml(task);
        } 
        else {
          return TaskComponent.getHtml(task);
        }
      })
      .join('');
  }

  renderTaskCount(count) {
    if (count === 0) {
      this.lms.taskManagerTaskCountLm.innerText = 'No tasks left';
    } 
    else if (count === 1) {
      this.lms.taskManagerTaskCountLm.innerText = count + ' task left';
    } 
    else {
      this.lms.taskManagerTaskCountLm.innerText = count + ' tasks left';
    }
  }

  updateTaskCountLm(text) {
    this.lms.taskManagerTaskCountLm.innerText = text;
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

  resetAddTaskForm() {
    this.lms.addTaskPromptFormLm.reset();
    this.closeAddTaskPrompt();
  }

  confirmDiscardPromptData() {
    if (this.utils.isFormPopulated(this.lms.addTaskPromptFormLm)) {
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

  renderAddTaskPromptErrors(errors) {
    if (errors.title && errors.title !== null) {
      this.lms.addTaskPromptTitleErrorLm.innerText = `*${errors.title}`
      this.lms.addTaskPromptTitleErrorLm.classList.add('active');
    } 
    else {
      this.lms.addTaskPromptTitleErrorLm.classList.remove('active');
      this.lms.addTaskPromptTitleErrorLm.innerText = '';
    }

    if (errors.due_date && errors.due_date !== null) {
      this.lms.addTaskPromptDueDateErrorLm.innerText = `*${errors.due_date}`
      this.lms.addTaskPromptDueDateErrorLm.classList.add('active');
    } 
    else {
      this.lms.addTaskPromptDueDateErrorLm.classList.remove('active');
      this.lms.addTaskPromptDueDateErrorLm.innerText = '';
    }
    
    if (errors.description && errors.description !== null) {
      this.lms.addTaskPromptDescErrorLm.innerText = `*${errors.description}`
      this.lms.addTaskPromptDescErrorLm.classList.add('active');
    } 
    else {
      this.lms.addTaskPromptDescErrorLm.classList.remove('active');
      this.lms.addTaskPromptDescErrorLm.innerText = '';
    }
  }

  renderGeneralAddTaskPromptError(error) {
    this.lms.addTaskPromptErrorLm.classList.add('active');
    this.lms.addTaskPromptErrorLm.innerText = error.message;
  }

  clearAddTaskPromptErrors() {
    this.lms.addTaskPromptTitleErrorLm.innerText = '';
    this.lms.addTaskPromptTitleErrorLm.classList.remove('active');
    this.lms.addTaskPromptDueDateErrorLm.innerText = '';
    this.lms.addTaskPromptDueDateErrorLm.classList.remove('active');
    this.lms.addTaskPromptDescErrorLm.innerText = '';
    this.lms.addTaskPromptDescErrorLm.classList.remove('active');
    
    this.lms.addTaskPromptErrorLm.innerText = '';
    this.lms.addTaskPromptErrorLm.classList.remove('active');
  }

  updateAddTodoPromptSubmitBtn(text) {
    this.lms.submitTaskBtn.innerText = text;
  }

  focusAddTaskBtn() {
    this.lms.addTaskBtn.focus();
  }

  returnFocusToEditTaskBtn(taskId) {
    const editTaskBtn = document.getElementById(`task-manager__edit-task-btn-${taskId}`);
    editTaskBtn.focus();
  }
}
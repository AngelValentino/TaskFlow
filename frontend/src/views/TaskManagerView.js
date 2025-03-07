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
      currentDateLm: document.getElementById('task-manager__dashboard-date'),
      taskManagerTabLms: document.querySelectorAll('.task-manager__tab-btn'),
      taskManagerTabListLm: document.getElementById('task-manager__tab-list')
    };
  }

  getDomRefs() {
    return this.lms;
  }

  generateTasksPlaceholder() {
    return `
      <li class="task-manager__empty-list-placeholder-container">
        <img id="task-manager__empty-list-placeholder-img" class="task-manager__empty-list-placeholder-img" src="public/assets/images/drawings/everything-done-placeholder.png" alt="Drawing of a capybara, with an orange on its head, riding another capybara that at the same time is riding a crocodile">
      </li>
    `;
  }

  updateCurrentDashboardDate() {
    const currentDate = new Date();
    
    this.lms.currentDateLm.innerText = this.utils.formatDate(currentDate).longFormat;
    this.lms.currentDateLm.setAttribute('datetime', this.utils.formatDate(currentDate).isoFormat);
  }

  //TODO SVG spinner does not load properly on page load, it needs to be changed
  renderTasksLoader() {
    this.lms.tasksContainerLm.innerHTML = `
      <li class="task-manager__list-loader-container">
        <svg class="task-manager__list-loader-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <g stroke="currentColor" stroke-width="1">
            <circle cx="12" cy="12" r="9.5" fill="none" stroke-linecap="round" stroke-width="3">
              <animate attributeName="stroke-dasharray" calcMode="spline" dur="1.725s" keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1" keyTimes="0;0.475;0.95;1" repeatCount="indefinite" values="0 150;42 150;42 150;42 150" />
              <animate attributeName="stroke-dashoffset" calcMode="spline" dur="1.725s" keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1" keyTimes="0;0.475;0.95;1" repeatCount="indefinite" values="0;-16;-59;-59" />
            </circle>
            <animateTransform attributeName="transform" dur="2.3s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12" />
          </g>
        </svg>
      </li>
    `;
  }

  renderTasks(taskData) {
    if (taskData.length === 0) {
      this.lms.tasksContainerLm.innerHTML = this.generateTasksPlaceholder();
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
        ? TaskCompletedComponent.getHtml(task) 
        : TaskComponent.getHtml(task))
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

  returnFocusToEditTaskBtn(taskId) {
    const editTaskBtn = document.getElementById(`task-manager__edit-task-btn-${taskId}`);
    editTaskBtn.focus();
  }
}
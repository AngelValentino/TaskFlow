import { 
  generateTodosHTML 
} from "./main.js";

import { 
  addTodo, 
  todos 
} from "./data/todo.js";

import { 
  openConfirmDialog,
  openInfoDialog
} from "./dialog.js";

import { 
  isTodosLimitReached, 
  filterTodos 
} from "./data/todo.js";

import { 
  toggleModalEvents, 
  toggleModalFocus, 
  setActiveBtn, 
  getFormData 
} from "./utils.js";

// Add todo prompt DOM references
const addTodoBtn = document.getElementById('todo-app-intro__add-btn');
const addTodoPromptLm = document.getElementById('add-todo-prompt');
const addTodoPromptCloseBtn = document.getElementById('add-todo-prompt__close-btn');
const addTodoPromptFormLm = document.getElementById('add-todo-prompt__form');

// Serch todo prompt DOM references
const searchTodoPromptLm = document.getElementById('search-todo-prompt');
const searchTodoBtn = document.getElementById('todo-app-intro__search-btn');
const searchInputLm = document.getElementById('search-todo-prompt__search-input');
const searchTodoDefaultIcon = document.getElementById('search-todo-prompt__search-icon');
const searchTodoCloseIcon = document.getElementById('search-todo-prompt__close-btn');

// Events handlers
const addTodoPromptEventsHandler = {};
const searchTodoPromptEventsHandler = {};

// Reassignment variables and timeout ids

let hideAddTodoPromptTimId;
let addTodoPromptFirstFocusLmTimId;
let resetAddTodoFormTimId;
let hideSearchTodoPromptTimId;
let searchTodoPromptFirstFocusLmTimId;

//* Add todo prompt

function hidePrompt(focusFirstLmTimId, btnLm, promptLm, time) {
  clearTimeout(focusFirstLmTimId);
  toggleModalFocus('return', null, btnLm);
  setActiveBtn(btnLm)
  // Remove the specified class from the prompt element to update its visibility
  promptLm.classList.remove('active');
  // Delay the hiding of the prompt element
  const hidePromptTimId = setTimeout(() => {
    promptLm.setAttribute('hidden', ''); // Add 'hidden' attribute to hide the prompt element
  }, time);

  return hidePromptTimId;
}

function showPrompt(hidePromptTimId, promptLm, btnLm, time, firstFocusableLm) {
  clearTimeout(hidePromptTimId);
  promptLm.removeAttribute('hidden');
  setActiveBtn(btnLm);

  // It needs a bigger delay, 20ms, than usual. Probably due to the complexity of the timeouts and animations interlinked all together.
  setTimeout(() => {
    promptLm.classList.add('active');
  }, 20);

  const focusFirstLmTimId = setTimeout(() => {
    toggleModalFocus('add', firstFocusableLm);
  }, time);

  return focusFirstLmTimId;
}

function hideAddTodoPrompt() {
  console.log('add todo prompt closed')
  // Hide Prompt
  hideAddTodoPromptTimId = hidePrompt(addTodoPromptFirstFocusLmTimId, addTodoBtn, addTodoPromptLm, 1500);

  // Remove event listeners
  toggleModalEvents(addTodoPromptEventsHandler, 'remove', null, addTodoPromptCloseBtn, addTodoPromptLm, document.body)
  addTodoPromptFormLm.removeEventListener('submit', submitTodoInfo);
}

function resetAddTodoForm() {
  addTodoPromptFormLm.reset();
  resetAddTodoFormTimId = setTimeout(() => {
    hideAddTodoPrompt();
  }, 250);
}

export function isAddTodoFormEdited() {
  const todoData = Object.values(getFormData(addTodoPromptFormLm, true));
  if (todoData[0] || todoData[1] || todoData[2]) {
    return true;
  }
  return false;
}

function confirmDiscardPromptData() {
  if (isAddTodoFormEdited()) {
    // It needs a timout so when the add todo form is closed with 'Escape' key it does not also closes the confirm dialog
    setTimeout(() => {
      openConfirmDialog(resetAddTodoForm, 'Are you sure you want to discard all changes made in form?');
    });
  } 
  else {
    hideAddTodoPrompt();
  }
}

function submitTodoInfo(e) {
  console.log('submit')
  e.preventDefault();

  if (isTodosLimitReached()) {
    openInfoDialog('You have reached the maximum limit of 100 todos.',  resetAddTodoForm);
  } 
  else {
    addTodo('unshift', addTodoPromptFormLm);
    hideAddTodoPrompt();
    addTodoPromptFormLm.reset();
  }
}

export function toggleAddTodoPrompt() {
  // Show prompt
  if (!addTodoPromptLm.classList.contains('active')) {
    addTodoPromptFirstFocusLmTimId = showPrompt(hideAddTodoPromptTimId, addTodoPromptLm, addTodoBtn, 250, addTodoPromptCloseBtn);
    clearTimeout(resetAddTodoFormTimId);

    // Add event listeners
    toggleModalEvents(addTodoPromptEventsHandler, 'add', confirmDiscardPromptData, addTodoPromptCloseBtn, addTodoPromptLm, document.body, '.add-todo-prompt');
    addTodoPromptFormLm.addEventListener('submit', submitTodoInfo);
  }
  // Hide prompt
  else {
    confirmDiscardPromptData();
  }
}

//* End of add todo prompt

//* Search prompt

function toggleClearSearchInput(inputLm) {
  if (inputLm.value === '') {
    // Return search icon
    searchTodoCloseIcon.classList.remove('active');
    searchTodoDefaultIcon.classList.remove('active');
  } 
  else {
    // Add close icon
    searchTodoCloseIcon.classList.add('active');
    searchTodoDefaultIcon.classList.add('active');
  }
}

function resetSearch() {
  generateTodosHTML(todos);
  searchInputLm.value = '';
  toggleClearSearchInput(searchInputLm);
}

function hideSearchTodoPrompt() {
  console.log('search todo prompt closed')
  hideSearchTodoPromptTimId = hidePrompt(searchTodoPromptFirstFocusLmTimId, searchTodoBtn, searchTodoPromptLm, 1250);
  resetSearch();

  // Remove event listeners
  toggleModalEvents(searchTodoPromptEventsHandler, 'remove', null, null, null, document.body);
  searchInputLm.removeEventListener('input', searchTodo);
}

function searchTodo(e) {
  // generate the todos with the highlighted matched text
  toggleClearSearchInput(e.target);
  generateTodosHTML(filterTodos(todos, e.target), e.target.value);
}

export function toggleSearchPrompt() {
  if (isAddTodoFormEdited()) return; // if add todo prompt has data return
  // Show Prompt
  if (!searchTodoPromptLm.classList.contains('active')) {
    searchTodoPromptFirstFocusLmTimId = showPrompt(hideSearchTodoPromptTimId, searchTodoPromptLm, searchTodoBtn, 1250, searchInputLm);
    
    // Add event listeners
    toggleModalEvents(searchTodoPromptEventsHandler, 'add', hideSearchTodoPrompt, null, null, document.body, '.search-todo-prompt');
    searchInputLm.addEventListener('input', searchTodo); // Search todos at input change.
  } 
  // Hide Prompt
  else {
    hideSearchTodoPrompt();
  }
}

searchTodoCloseIcon.addEventListener('click', resetSearch);

//* End of search prompt
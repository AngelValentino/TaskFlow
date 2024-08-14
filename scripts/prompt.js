import { getFormData, generateTodosHTML } from "./main.js";
import { addTodo, todos } from "./data/todo.js";
import { openConfirmDialog } from "./dialog.js";
import { isTodosLimitReached, filterTodos } from "./data/todo.js";
import { toggleModalEvents } from "./utils.js";

const addTodoBtn = document.getElementById('todo-app-intro__add-btn');
const addTodoPromptLm = document.getElementById('todo-app-prompt');
const addTodoPromptCloseBtn = document.getElementById('todo-app-prompt__cancel-btn');
const addTodoPromptFormLm = document.getElementById('todo-app-prompt__form');

let addTodoPromptTimId;
let addTodoPromptFocusCloseBtnTimId;

const addTodoPromptEventsHandler = {};


const searchTodoPromptLm = document.getElementById('search-todo-prompt');
const searchTodoBtn = document.getElementById('todo-app-intro__search-btn');
const searchTodoFormLm = document.getElementById('search-todo-prompt__form');
const searchInputLm = document.getElementById('search-todo-prompt__search-input');

const searchTodoPromptEventsHandler = {};

let searchTodoPromptTimId;
let searchTodoPromptFocusCloseBtnTimId;

// TODO Add focus function for reusability
// TODO Refactor repeated code to be reusable across functions

export function checkActiveBtn(btnLm) {
  // Check if the button's 'aria-expanded' attribute is set to 'false'
  if (btnLm.getAttribute('aria-expanded') === 'false') {
    console.log('true')
    // If 'aria-expanded' attribute does not exist add the 'btn--active' class to the button
    btnLm.classList.add('btn--active');
    btnLm.setAttribute('aria-expanded', true);
  } 
  else {  
    console.log('else')
    // If 'aria-expanded' attribute exists, remove the 'btn--active' class from the button
    btnLm.classList.remove('btn--active');
    btnLm.setAttribute('aria-expanded', false);
  }
}

function hideAddTodoPrompt() {
  console.log('add todo prompt closed')
  // Hide Prompt
  clearTimeout(addTodoPromptFocusCloseBtnTimId);
  addTodoBtn.focus();
  checkActiveBtn(addTodoBtn)
  // Set the button's 'aria-expanded' attribute to 'false' to indicate that the related prompt is now collapsed.
  // addTodoBtn.setAttribute('aria-expanded', false);
  // Remove the specified class from the prompt element to update its visibility
  addTodoPromptLm.classList.remove('todo-app-prompt--active');
  // Delay the hiding of the prompt element
  addTodoPromptTimId = setTimeout(() => {
    addTodoPromptLm.setAttribute('hidden', ''); // Add 'hidden' attribute to hide the prompt element
  }, 1500);

  // Remove event listeners
  toggleModalEvents(addTodoPromptEventsHandler, 'remove', null, addTodoPromptCloseBtn, addTodoPromptLm, document.body)
  addTodoPromptFormLm.removeEventListener('submit', submitTodoInfo);
}

function resetForm() {
  addTodoPromptFormLm.reset();
  hideAddTodoPrompt();
}

function resetFormOnTodoLimit() {
  hideAddTodoPrompt();
  addTodoPromptFormLm.reset();
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
      openConfirmDialog(resetForm, 'Are you sure you want to discard all changes made in form?')
    });
  } 
  else {
    hideAddTodoPrompt()
  }
}

function submitTodoInfo(e) {
  console.log('submit')
  e.preventDefault();

  if (isTodosLimitReached()) {
    openInfoDialog('You have reached the maximum limit of 100 todos.',  resetFormOnTodoLimit);
  } 
  else {
    addTodo('unshift', addTodoPromptFormLm);
    hideAddTodoPrompt()
    addTodoPromptFormLm.reset();
  }
}

export function toggleAddTodoPrompt() {
  // Show prompt
  if (!addTodoPromptLm.classList.contains('todo-app-prompt--active')) {
    clearTimeout(addTodoPromptTimId);
    addTodoPromptLm.removeAttribute('hidden');
    checkActiveBtn(addTodoBtn);
    // addTodoBtn.setAttribute('aria-expanded', true);
  
    // It needs a bigger delay, 20ms, than usual. Probably due to the complexity of the timeouts and animations interlinked all together.
    setTimeout(() => {
      addTodoPromptLm.classList.add('todo-app-prompt--active');
    }, 20);

    addTodoPromptFocusCloseBtnTimId = setTimeout(() => {
      addTodoPromptCloseBtn.focus();
    }, 250);

    // Add event listeners
    toggleModalEvents(addTodoPromptEventsHandler, 'add', confirmDiscardPromptData, addTodoPromptCloseBtn, addTodoPromptLm, document.body, '.todo-app-prompt');
    addTodoPromptFormLm.addEventListener('submit', submitTodoInfo);
  }
  // Hide prompt
  else {
    confirmDiscardPromptData();
  }
}


function hideSearchTodoPrompt() {
  console.log('search todo prompt closed')
  clearTimeout(searchTodoPromptFocusCloseBtnTimId);
  searchTodoBtn.focus();
  checkActiveBtn(searchTodoBtn)
  // Set the button's 'aria-expanded' attribute to 'false' to indicate that the related prompt is now collapsed.
  // searchTodoBtn.setAttribute('aria-expanded', false);
  // Remove the specified class from the prompt element to update its visibility
  searchTodoPromptLm.classList.remove('search-todo-prompt--active');
  // Delay the hiding of the prompt element
  searchTodoPromptTimId = setTimeout(() => {
    searchTodoPromptLm.setAttribute('hidden', ''); // Add 'hidden' attribute to hide the prompt element
  }, 1250);

  resetSearch()

  // Remove event listeners
  toggleModalEvents(searchTodoPromptEventsHandler, 'remove', null, null, null, document.body);
  
  searchInputLm.removeEventListener('input', searchTodo);
  searchTodoFormLm.removeEventListener('submit', preventDefault);
}

function preventDefault(e) {
  e.preventDefault();
}

function searchTodo(e) {
  // generate the todos with the highlighted matched text
  generateTodosHTML(filterTodos(todos, e.target), e.target.value);
}

function resetSearch() {
  generateTodosHTML(todos);
  searchTodoFormLm.reset();
}

export function toggleSearchPrompt() {
  if (isAddTodoFormEdited()) return; // if add todo prompt has data return
  // Show Prompt
  if (!searchTodoPromptLm.classList.contains('search-todo-prompt--active')) {
    clearTimeout(searchTodoPromptTimId);
    searchTodoPromptLm.removeAttribute('hidden');
    checkActiveBtn(searchTodoBtn)
    // searchTodoBtn.setAttribute('aria-expanded', true);
    // It needs a bigger delay, 20ms, than usual. Probably due to the complexity of the timeouts and animations interlinked all together.
    setTimeout(() => {
      searchTodoPromptLm.classList.add('search-todo-prompt--active');
    }, 20);
  
    searchTodoPromptFocusCloseBtnTimId = setTimeout(() => {
      searchInputLm.focus();
    }, 1250);

    // Add event listeners

    toggleModalEvents(searchTodoPromptEventsHandler, 'add', hideSearchTodoPrompt, null, null, document.body, '.search-todo-prompt');

    // Search todos at input change.
    searchInputLm.addEventListener('input', searchTodo);

    // Prevent default at form submit
    searchTodoFormLm.addEventListener('submit', preventDefault);
  } 
  // Hide Prompt
  else {
    hideSearchTodoPrompt()
  }
}
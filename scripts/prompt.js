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

// Search todo prompt DOM references
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
  clearTimeout(focusFirstLmTimId); // Clear any existing focus timeout
  // If no modal is open restore focus
  if (document.body.style.overflow !== 'hidden') toggleModalFocus('return', null, btnLm);
  // Set button to inactive
  setActiveBtn(btnLm); 
  // Remove the specified class from the prompt element to update its visibility
  promptLm.classList.remove('active');
  
  // Delay the hiding of the prompt element
  const hidePromptTimId = setTimeout(() => {
    // Add 'hidden' attribute to hide the prompt element
    promptLm.setAttribute('hidden', '');
  }, time);

  return hidePromptTimId; // Return the timeout ID
}

function showPrompt(hidePromptTimId, promptLm, btnLm, time, firstFocusableLm) {
  clearTimeout(hidePromptTimId); // Clear any existing hide timeout
  promptLm.removeAttribute('hidden'); // Remove 'hidden' attribute to show the prompt
  setActiveBtn(btnLm); // Set button to active

  // Show prompt
  setTimeout(() => {
    // Add active class
    promptLm.classList.add('active');
  }, 20);

  const focusFirstLmTimId = setTimeout(() => {
    toggleModalFocus('add', firstFocusableLm); // Focus the first element in the prompt
  }, time);

  return focusFirstLmTimId;
}

function hideAddTodoPrompt() {
  // Hide the prompt with a delay
  hideAddTodoPromptTimId = hidePrompt(addTodoPromptFirstFocusLmTimId, addTodoBtn, addTodoPromptLm, 1500);

  // Remove event listeners
  toggleModalEvents(addTodoPromptEventsHandler, 'remove', null, addTodoPromptCloseBtn, addTodoPromptLm, document.body)
  addTodoPromptFormLm.removeEventListener('submit', submitTodoInfo);
}

// Reset the add todo form and hide the prompt
function resetAddTodoForm() {
  addTodoPromptFormLm.reset(); // Reset the form fields
  resetAddTodoFormTimId = setTimeout(() => {
    hideAddTodoPrompt(); // Hide the prompt after a short delay
  }, 250);
}

// Checks if the Add Todo form has been edited
export function isAddTodoFormEdited() {
  const todoData = Object.values(getFormData(addTodoPromptFormLm)); // Get form data
  // Check if any field has data
  if (todoData[0] || todoData[1] || todoData[2]) {
    return true;
  }
  // If they dont have any data, return false
  return false;
}

// Confirm discarding changes in the add todo form
function confirmDiscardPromptData() {
  if (isAddTodoFormEdited()) {
    // It needs a timeout so when the add todo form is closed with 'Escape' key it does not also closes the confirm dialog
    setTimeout(() => {
      // Open confirm dialog if changes have been made in form
      openConfirmDialog(resetAddTodoForm, 'Are you sure you want to discard all changes made in form?');
    });
  } 
  else {
    // Hide the prompt if no changes
    hideAddTodoPrompt();
  }
}

// Handle form submission in the add todo prompt
function submitTodoInfo(e) {
  e.preventDefault(); // Prevent default form submission

  if (isTodosLimitReached()) {
    // Show info dialog if limit is reached
    openInfoDialog('You have reached the maximum limit of 100 todos.',  resetAddTodoForm);
  } 
  else {
    addTodo('unshift', addTodoPromptFormLm); // Add the new todo
    hideAddTodoPrompt(); // Hide the prompt
    addTodoPromptFormLm.reset(); // Reset the form
  }
}

// Toggle the add todo prompt visibility
export function toggleAddTodoPrompt() {
  // Show the add todo prompt if it is not already visible
  if (!addTodoPromptLm.classList.contains('active')) {
    clearTimeout(resetAddTodoFormTimId); // Clear any existing reset timeout
    // Show the prompt with a delay
    addTodoPromptFirstFocusLmTimId = showPrompt(hideAddTodoPromptTimId, addTodoPromptLm, addTodoBtn, 250, addTodoPromptCloseBtn);
    // Add event listeners
    // It needs the timeout to not conflict with close at overlay click
    setTimeout(() => {
      toggleModalEvents(addTodoPromptEventsHandler, 'add', confirmDiscardPromptData, addTodoPromptCloseBtn, addTodoPromptLm, document.body, '.add-todo-prompt');
    });
    addTodoPromptFormLm.addEventListener('submit', submitTodoInfo);
  }
  // Hide the add todo prompt if it is already visible
  else {
    // Confirm discarding changes if prompt is already visible
    confirmDiscardPromptData();
  }
}

//* End of add todo prompt

//* Search prompt

// Toggle the visibility of the search input clear icon
function toggleClearSearchInput(inputLm) {
  if (inputLm.value === '') {
    // If input is empty, show the default search icon and hide the close icon
    searchTodoCloseIcon.classList.remove('active');
    searchTodoDefaultIcon.classList.remove('active');
  } 
  else {
    // If input has text, show the close icon and hide the default search icon
    searchTodoCloseIcon.classList.add('active');
    searchTodoDefaultIcon.classList.add('active');
  }
}

// Reset the search todo prompt and results
function resetSearch() {
  generateTodosHTML(todos); // Regenerate the list of todos
  searchInputLm.value = ''; // Clear the search input
  toggleClearSearchInput(searchInputLm); // Update clear and search icons based on the empty input
}

// Hide the search todo prompt and clean up
function hideSearchTodoPrompt() {
  // Hide the prompt with a delay
  hideSearchTodoPromptTimId = hidePrompt(searchTodoPromptFirstFocusLmTimId, searchTodoBtn, searchTodoPromptLm, 1250);
  resetSearch(); // Reset search results and input

  // Remove event listeners
  toggleModalEvents(searchTodoPromptEventsHandler, 'remove', null, null, null, document.body);
  searchInputLm.removeEventListener('input', searchTodo);
}

// Handle the search input and update the list of todos
function searchTodo(e) {
  // Generate todos with highlighted matched text based on the search input
  toggleClearSearchInput(e.target); // Update clear and search icons
  generateTodosHTML(filterTodos(todos, e.target), e.target.value); // Filter and display todos
}

// Toggle the search todo prompt visibility
export function toggleSearchPrompt() {
  if (isAddTodoFormEdited()) return; // if add todo prompt has data return
  
  // Show the search yodo prompt if it is not already visible
  if (!searchTodoPromptLm.classList.contains('active')) {
    // Display the search prompt and set focus to the search input after a delay
    searchTodoPromptFirstFocusLmTimId = showPrompt(hideSearchTodoPromptTimId, searchTodoPromptLm, searchTodoBtn, 1250, searchInputLm);
    
    // Add event listeners
    // It needs the timeout to not conflict with close at overlay click
    setTimeout(() => {
      toggleModalEvents(searchTodoPromptEventsHandler, 'add', hideSearchTodoPrompt, null, null, document.body, '.search-todo-prompt');
    });
    searchInputLm.addEventListener('input', searchTodo); // Search todos at input change.
  } 
  // Hide the search todo prompt if it is already visible
  else {
    hideSearchTodoPrompt();
  }
}

searchTodoCloseIcon.addEventListener('click', resetSearch);

//* End of search prompt
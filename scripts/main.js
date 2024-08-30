import { 
  quotesData, 
  loadQuote,
  lastQuoteIndex,
  setQuote
} from './quote.js';

import { 
  openConfirmDialog,
  openEditDialog,
  openInfoDialog
} from './dialog.js';

import { 
  todos,
  deleteTodo, 
  completeTodo, 
  resetTodos, 
  filterTodos, 
  countIncompletedTodos, 
} from './data/todo.js';

import {
  setRandomTheme,
  lastPreloadedImg,
  preloadBgImgEventHandler
} from './data/themes.js';

import { 
  preloadDialogImages,
  highlighter,
  setActiveBtn,
  formatCurrentDate,
  formatDate
} from './utils.js';

import {
  toggleAddTodoPrompt,
  toggleSearchPrompt,
  isAddTodoFormEdited
} from './prompt.js';

import { Timer } from './Timer.js';

// DOM references
const backgroundImgLm = document.getElementById('background-image');
const currentDateLm = document.getElementById('todo-app-intro__current-date');
const updateQuoteBtn = document.getElementById('quote__new-quote-btn');
const todoAppLm = document.getElementById('todo-app');
const searchInputLm = document.getElementById('search-todo-prompt__search-input');
const clearAllTodosBtn = document.getElementById('todo-app-intro__clear-btn');
const todoSectionsHeaderLm = document.getElementById('todo-sections');
const allBtnLm = document.getElementById('todo-sections__all-btn');
const scrollToTopBtn = document.getElementById('todo-sections__scroll-to-top-btn');
const todosContainerLm = document.getElementById('todos-container');
const searchTodoBtn = document.getElementById('todo-app-intro__search-btn');
const addTodoBtn = document.getElementById('todo-app-intro__add-btn');

// Get current date
const currDate = new Date();

// Initialize variables
let timBgId;
let initBgTimId;
let lastPickedSection = localStorage.getItem('lastPickedSection') || null;
let filteredTodos = [];

let lastGeneratedHTML = '';

// Add todo information to the edit form
function addTodoInfoToEditForm(targetId, formInputs) {
  todos.forEach(todo => {
    if (todo.id === targetId) {
      // Iterate through form inputs to set their values based on the todo's properties
      formInputs.forEach(input => {
        if (input.name === 'date') {
          // If the input is a date field, reverse the todo date value to be 'yyyy-mm-dd to be able to set the input value correctly'
          input.value = formatDate(todo[input.name]);
        } 
        else {
          // Set input value with specific todo data
          input.value = todo[input.name];
        }
      });
    }
  });
}

// Get todo information from the form dialog and return as an object
export function getTodoInfo(formLm) {
  const formInputs = formLm.querySelectorAll('input, textarea'); // DOM query form inputs
  const todoInfo = {};

  // Populate todoInfo object with input values
  formInputs.forEach(input => {
    todoInfo[input.name] = input.value;
  });

  return todoInfo; // Return todoInfo object
}

function setActiveSection(btn) {
  btn.classList.add('active');
  btn.setAttribute('aria-expanded', true);
}

// Change the active section button style and aria-expanded attribute
function changeActiveSectionBtn(sectionBtnLms, btnToAddId) {
  sectionBtnLms.forEach(sectionBtn => {
    if (sectionBtn.matches('#' + btnToAddId)) {
      // Add 'active' class and set 'aria-expanded' attribute to true for the selected button
      setActiveSection(sectionBtn);
    } 
    else {
      // Remove 'active' class and set 'aria-expanded' attribute to false for non-selected buttons
      sectionBtn.classList.remove('active');
      sectionBtn.setAttribute('aria-expanded', false);
    }
  });
}

// Save the currently selected section to localStorage
function setCurrentSectionToStorage(sectionId) {
  lastPickedSection = sectionId; // Update the lastPickedSection variable
  localStorage.setItem('lastPickedSection', lastPickedSection); // Store the sectionId in localStorage
}

// Set the last active section based on the value from localStorage
function getLastActiveSection() {
  if (!lastPickedSection) {
    // If no section is stored, default to showing the 'all' section
    const allBtnLm = document.getElementById('todo-sections__all-btn');
    setActiveSection(allBtnLm);
  } 
  else {
    // Otherwise, set the last picked section as active
    const lastPickedSectionBtn = document.getElementById(lastPickedSection);
    setActiveSection(lastPickedSectionBtn);
  }
}

function scrollToTopOfContainer(behavior = 'smooth') {
  // Check if the user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
  // I they prefer reduced motion set scroll behaviour to auto
  if (!prefersReducedMotion) behavior = 'auto';
  // Scroll to the top of the container
  todoAppLm.scrollTo({top: 0, behavior: behavior});
}

function handleScrollToTopOfContainer() {
  scrollToTopOfContainer();
}

function isSectionHeaderSticky() {
  // Get the sticky element's bounding rect relative to the viewport
  const stickyRect = todoSectionsHeaderLm.getBoundingClientRect();
  // Get the container's bounding rect
  const containerRect = todoAppLm.getBoundingClientRect();
  // Calculate the top offset of the sticky element relative to the container
  const stickyOffset = stickyRect.top - containerRect.top;
  
  return stickyOffset <= 0;
}

// Toggle scroll to top button visibility
function toggleScrollToTopBtn() {
  // Check if the sticky element is currently active/inactive and show or hide scroll to top button
  scrollToTopBtn.classList.toggle('show', isSectionHeaderSticky());
}

// Generate the HTML for displaying todos based on the active section and search highlight
export function generateTodosHTML(todos, highlight) {
  // DOM references
  const tasksLeftLm = document.getElementById('todo-app-intro__tasks-left');
  const tasksBtnLm = document.getElementById('todo-sections__tasks-btn');
  const completedBtnLm = document.getElementById('todo-sections__completed-btn');
  
  // Initialize variables
  const incompletedTodosCount = countIncompletedTodos();
  let generatedHTML = '';

  // Generate HTML for a placeholder image when there are no todos
  function generatePlaceholderImageHTML(imgUrl, id) {
    todosContainerLm.innerHTML = `
      <li class="todos-container__img-container">
        <img id="${id}" class="todos-container__empty-section-image" src="${imgUrl}" alt="Drawing of a capybara, with an orange on its head, riding another capybara that at the same time is riding a crocodile" />
      </li>
    `;
  }
  
  // Generate HTML for an individual task
  function generateTaskHTML(todo, highlight) {
    return `
      <li aria-checked="false" id="${todo.id}" aria-label="Task not completed." class="todo">
        <h3 class="todo__task-name">${highlight ? highlighter(todo.task, highlight) : todo.task}</h3>
        <p class="todo__task-date">${todo.date}</p>
        <p class="todo__task-desc">${todo.description}</p>
        <ul aria-label="Task controls." class="todo__control-buttons-list">
          <li>
            <button title="Complete task" class="todo__complete-btn todo__control-btn" aria-label="Complete todo." type="button">
              <span aria-hidden="true" role="presentation" class="material-symbols-outlined todo__complete-icon">check_circle</span>
            </button>
          </li>
          <div role="presentation">
            <li>
              <button title="Edit task" class="todo__edit-btn todo__control-btn" id="todo__edit-btn-${todo.id}" aria-label="Edit todo." type="button">
                <span aria-hidden="true" role="presentation" class="material-symbols-outlined todo__edit-icon">edit_square</span>
              </button>
            </li>
            <li>
              <button title="Delete task" class="todo__delete-btn todo__control-btn" aria-label="Delete todo." type="button">
                <span aria-hidden="true" role="presentation" class="trash material-symbols-outlined todo__delete-icon">delete</span>
              </button>
            </li>
          </div>
        </ul>
      </li>
    `;
  }

  // Generate HTML for a completed task
  function generateCompletedTaskHTML(todo, highlight) {
    return `
      <li aria-checked="true" id="${todo.id}" aria-label="Task completed." class="todo completed">
        <h3 class="todo__task-name">${highlight ? highlighter(todo.task, highlight, true) : todo.task}</h3>
        <p class="todo__task-date">${todo.date}</p>
        <p class="todo__task-desc">${todo.description}</p>
        <div class="todo__control-btn-container">
          <button title="Delete completed task" class="todo__delete-btn todo__control-btn" aria-label="Delete todo." type="button">
            <span aria-hidden="true" role="presentation" class="trash material-symbols-outlined todo__delete-icon">delete</span>
          </button>
        </div>
      </li>
    `;
  }

  // Update tasks left text
  if (incompletedTodosCount === 0) {
    tasksLeftLm.innerText = `No tasks left`
  }
  else if (incompletedTodosCount === 1) {
    tasksLeftLm.innerText = `1 task left`
  } 
  else {
    tasksLeftLm.innerText = `${incompletedTodosCount} tasks left`
  }
  
  // Generate HTML based on the active section (all, tasks, or completed)
  if (allBtnLm.matches('.active')) {
    // All section HTML, showing both completed and incomplete tasks
    // For each todo, generate the appropriate HTML based on its completion status
    todosContainerLm.ariaLabel = "All Todos list."
    generatedHTML = todos
      .map(todo => todo.completed ? generateCompletedTaskHTML(todo, highlight) : generateTaskHTML(todo, highlight))
      .join('');
  } 
  else if (tasksBtnLm.matches('.active')) {
    // Tasks section HTML, showing only incomplete tasks
    // Filter out completed tasks and generate HTML only for those that are still incompleted
    todosContainerLm.ariaLabel = "Tasks list."
    generatedHTML = todos
      .filter(todo => !todo.completed)
      .map(todo => generateTaskHTML(todo, highlight))
      .join('');
  } 
  else if (completedBtnLm.matches('.active')) {
    // Completed Section HTML, showing only complete tasks
    // Filter out incomplete tasks and generate HTML only for those that are marked as completed
    todosContainerLm.ariaLabel = "Completed tasks list."
    generatedHTML = todos
      .filter(todo => todo.completed)
      .map(todo => generateCompletedTaskHTML(todo, highlight))
      .join('');
  }

  // Compares the newly generated HTML with the existing one. If they are identical, exit early
  // Note: The placeholder image is still generated when the "todo" section is empty
  if (generatedHTML === lastGeneratedHTML && generatedHTML !== '') return;
  lastGeneratedHTML = generatedHTML;

  todosContainerLm.innerHTML = generatedHTML;

  // Generate a placeholder image if there are no todos to display
  if (todosContainerLm.innerHTML === '' && searchTodoBtn.getAttribute('aria-expanded') === 'true') {
    // Placeholder image for an empty search result
    generatePlaceholderImageHTML('images/cute-animals-drawings/croco-capybara-todos.png', 'todos-container__empty-search-section-image');
  } 
  else if (todosContainerLm.innerHTML === '') {
    // Placeholder image for an empty section
    generatePlaceholderImageHTML('images/cute-animals-drawings/croco-capybara.png', 'todos-container__empty-section-image');
  }
}

// Clears all todos after confirmation if there are any existing todos
function clearAllTodos() {
  if (isAddTodoFormEdited()) return; // if add todo prompt has data return
  setActiveBtn(clearAllTodosBtn);
  
  // Check if there are any todos to delete
  if (todos.length) {
    // Show a confirmation dialog asking the user to confirm deletion of all todos, completed and incompleted.
    openConfirmDialog(resetTodos, 'Are you sure you want to delete all incomplete and completed todos?');
  } 
  else {
     // If no todos are present, show an information dialog indicating that all tasks have been completed
    openInfoDialog('All tasks have been completed.');
  }
}

// Checks if search is active and generates its specific empty section placeholder image
function generateSpecificSectionHTML() {
   // Check if there are no filtered todos and the search input is not expanded (inactive search)
  if (filteredTodos.length === 0 && searchTodoBtn.getAttribute('aria-expanded') === 'false') {
    generateTodosHTML(todos);
  } 
  else {
    // Filter todos based on the search input and generate HTML for the filtered todos
    filteredTodos = filterTodos(todos, searchInputLm);
    generateTodosHTML(filteredTodos, searchInputLm.value);
  }
}

function setActiveTodoSection(btnId) {
  // All section buttons DOM references
  const sectionBtnLms = document.querySelectorAll('.todo-sections__btn');
  // If section header is sticky scroll to the top of the container
  if (isSectionHeaderSticky()) scrollToTopOfContainer('auto');

  changeActiveSectionBtn(sectionBtnLms, btnId);
  generateSpecificSectionHTML();
  setCurrentSectionToStorage(btnId);
}

//* Inital function and constructor calls

// Update the current date display with the formatted current date
currentDateLm.innerText = formatCurrentDate(currDate);
// Preload images used in dialogs
preloadDialogImages();
// Restore the last active section from storage
getLastActiveSection();
// Generate and display the todos list
generateTodosHTML(todos);

// Initialize the timer component
const timerLm = document.getElementById('timer');
new Timer(timerLm);

//* End of Inital function and constructor calls

//* Add event listeners

// Event listener for DOMContentLoaded to ensure the DOM is fully loaded before manipulating it
document.addEventListener('DOMContentLoaded', () => {
  // Get references to loader elements
  const bouncerLoaderContainerLm = document.getElementById('bouncer-container');
  const bouncerLoaderLm = document.getElementById('bouncer-loader');
  
  // Hide the loader by setting its opacity to 0
  bouncerLoaderContainerLm.style.backgroundColor = 'transparent'
  bouncerLoaderLm.style.opacity = 0;

  // Set loader dispay to none
  setTimeout(() => {
    bouncerLoaderContainerLm.style.display = 'none';
  }, 500)

  // Load the initial quote and set a random background theme
  loadQuote();
  initBgTimId = setRandomTheme();
});

// Event listener to refresh quote and change theme when the new quote button is clicked
updateQuoteBtn.addEventListener('click', () => {
  if (isAddTodoFormEdited()) return; // if add todo prompt has data return
  // Remove event lstener from the last background image just in case js garbage collector doesn't work as intended
  lastPreloadedImg.removeEventListener('load', preloadBgImgEventHandler.loadBgImgHandler);
  // Fade out the current background image
  backgroundImgLm.style.opacity = 0;
  
  // Clear any existing timeouts for changing the background theme
  clearTimeout(timBgId);
  clearTimeout(initBgTimId);

  timBgId = setRandomTheme(1050); // Changes background theme with delay
  quotesData && setQuote(quotesData, lastQuoteIndex); // Update the quote if quote data exists
}); 

// Add events to intro buttons
searchTodoBtn.addEventListener('click', toggleSearchPrompt); // Add toggle search todo event
addTodoBtn.addEventListener('click', toggleAddTodoPrompt); // Add toggle add todo prompt event
clearAllTodosBtn.addEventListener('click', clearAllTodos); // Add clear all todos event

// Handle scroll to top of container and scroll to top button visiblity
todoAppLm.addEventListener('scroll', toggleScrollToTopBtn);
scrollToTopBtn.addEventListener('click', handleScrollToTopOfContainer);

// Check active section and generates the specific todos HTML needed
todoSectionsHeaderLm.addEventListener('click', e => { 
  // Determine which section button was clicked and update the active section
  if (e.target.closest('#todo-sections__all-btn')) {
    // Show all todos
    setActiveTodoSection('todo-sections__all-btn');
  } 
  else if (e.target.closest('#todo-sections__tasks-btn')) {
    // Show only incomplete tasks
    setActiveTodoSection('todo-sections__tasks-btn');
  } 
  else if (e.target.closest('#todo-sections__completed-btn')) {
    // Show only completed tasks
    setActiveTodoSection('todo-sections__completed-btn');
  }
});

// Add events listeners to todo buttons
todosContainerLm.addEventListener('click', e => {
  if (isAddTodoFormEdited()) return; // if add todo prompt has data return
  
  //* Complete Todo
  if (e.target.closest('.todo__complete-btn')) {
    // Get the ID of the todo item
    const targetId = e.target.closest('.todo').id;
    // Confirm complete todo
    openConfirmDialog(completeTodo.bind(null, targetId), 'Are you sure that you want to complete this task?', true); 
  } 
  //* Edit Todo
  else if (e.target.closest('.todo__edit-btn')) {
    // Get the ID of the todo item
    const targetId = e.target.closest('.todo').id;
    // DOM references
    const editDialogFormLm = document.getElementById('edit-dialog__form')
    const editDialogFormInputLms = editDialogFormLm.querySelectorAll('input, textarea');
    
    // Populate the edit form with todo data and open edit dialog
    addTodoInfoToEditForm(targetId, editDialogFormInputLms);
    openEditDialog(targetId, { formerEdit: getTodoInfo(editDialogFormLm) });
  } 
  //* Delete todo
  else if (e.target.closest('.todo__delete-btn')) {
    // Get the ID of the todo item
    const targetId = e.target.closest('.todo').id;
    // Confirm delete todo
    openConfirmDialog(deleteTodo.bind(null, targetId), 'Are you sure that you want to delete this task?');
  }
});
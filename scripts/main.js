import { 
  quotesData, 
  checkQuotesData,
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
  formatDate,
} from './utils.js';

import {
  toggleAddTodoPrompt,
  toggleSearchPrompt,
  isAddTodoFormEdited
} from './prompt.js';

import { Timer } from './Timer.js';

const backgroundImgLm = document.getElementById('background-image');
const currentDateLm = document.getElementById('todo-app-intro__current-date');
const refreshQuoteBtn = document.getElementById('quote__new-quote-btn');
const searchInputLm = document.getElementById('search-todo-prompt__search-input');
const clearAllTodosBtn = document.getElementById('todo-app-intro__clear-btn');
const todosSectionsContainerLm = document.getElementById('todo-sections');
const allBtnLm = document.getElementById('todo-sections__all-btn');
const todosContainerLm = document.getElementById('todos-container');
const searchTodoBtn = document.getElementById('todo-app-intro__search-btn');
const addTodoBtn = document.getElementById('todo-app-intro__add-btn');
const currDate = new Date();

let timBgId;
let initBgTimId;
let lastPickedSection = localStorage.getItem('lastPickedSection') || '';
let filteredTodos = [];
let lastGeneratedHTML = '';

function addTodoInfoToEditForm(targetId, formInputs) {
  todos.forEach(todo => {
    if (todo.id === targetId) {
      formInputs.forEach(input => {
        if (input.name === 'date') {
          input.value = formatDate(todo[input.name]);
        } 
        else {
          input.value = todo[input.name];
        }
      });
    }
  });
}

export function getTodoInfo(formDialogLm) {
  const formInputs = formDialogLm.querySelectorAll('input, textarea');
  const todoInfo = {};
  formInputs.forEach(input => {
    todoInfo[input.name] = input.value;
  })
  return todoInfo;
}

function changeActiveSectionBtn(sectionBtnLms, btnToAddId) {
  sectionBtnLms.forEach(sectionBtn => {
    if (sectionBtn.matches(btnToAddId)) {
      sectionBtn.classList.add('active');
      sectionBtn.setAttribute('aria-expanded', true);
    } 
    else {
      sectionBtn.classList.remove('active');
      sectionBtn.setAttribute('aria-expanded', false);
    }
  });
}

function setCurrentSectionToStorage(sectionId) {
  lastPickedSection = sectionId;
  localStorage.setItem('lastPickedSection', lastPickedSection);
}

function getLastActiveSection() {
  if (!lastPickedSection) {
    const allBtnLm = document.getElementById('todo-sections__all-btn');
    allBtnLm.classList.add('active');
    allBtnLm.setAttribute('aria-expanded', true);
  } 
  else {
    const lastPickedSectionBtn =  document.getElementById(lastPickedSection);
    lastPickedSectionBtn.classList.add('active');
    lastPickedSectionBtn.setAttribute('aria-expanded', true);
  }
}

export function generateTodosHTML(todos, highlight) {
  const tasksLeftLm = document.getElementById('todo-app-intro__tasks-left');
  const tasksBtnLm = document.getElementById('todo-sections__tasks-btn');
  const completedBtnLm = document.getElementById('todo-sections__completed-btn');
  const incompletedTodosCount = countIncompletedTodos();
  let generatedHTML = '';

  function generatePlaceholderImageHTML(imgUrl, id) {
    todosContainerLm.innerHTML = `
      <li class="todos-container__img-container">
        <img id="${id}" class="todos-container__empty-section-image" src="${imgUrl}" alt="Drawing of a capybara, with an orange on its head, riding another capybara that at the same time is riding a crocodile" />
      </li>
    `;
  }
  
  function generateTaskHTML(todo, highlight) {
    return `
      <li id="${todo.id}" class="todo">
        <h3 class="todo__task-name">${highlight ? highlighter(todo.task, highlight) : todo.task}</h3>
        <p class="todo__task-date">${todo.date}</p>
        <p class="todo__task-desc">${todo.description}</p>
        <div class="todo__edit-buttons">
          <button title="Complete task" class="todo__complete-btn" aria-label="Complete todo." type="button">
            <span aria-hidden="true" role="presentation" class="material-symbols-outlined todo__complete-icon">check_circle</span>
          </button>
          <div>
            <button title="Edit task" class="todo__edit-btn" id="todo__edit-btn-${todo.id}" aria-label="Edit todo." type="button">
              <span aria-hidden="true" role="presentation" class="material-symbols-outlined todo__edit-icon">edit_square</span>
            </button>
            <button title="Delete task" class="todo__delete-btn" aria-label="Delete todo." type="button">
              <span aria-hidden="true" role="presentation" class="trash material-symbols-outlined todo__delete-icon">delete</span>
            </button>
          </div>
        </div>
      </li>
    `;
  }

  function generateCompletedTaskHTML(todo, highlight) {
    return `
      <li id="${todo.id}" class="todo completed">
        <h3 class="todo__task-name">${highlight ? highlighter(todo.task, highlight, true) : todo.task}</h3>
        <p class="todo__task-date">${todo.date}</p>
        <p class="todo__task-desc">${todo.description}</p>
        <div class="todo__edit-buttons">
          <button title="Delete completed task" class="todo__delete-btn" aria-label="Delete todo." type="button">
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
  
  // Generate Todos HTML based on the active section
  if (allBtnLm.matches('.active')) {
    // All section HTML
    generatedHTML = todos
      .map(todo => todo.completed ? generateCompletedTaskHTML(todo, highlight) : generateTaskHTML(todo, highlight))
      .join('');
  } 
  else if (tasksBtnLm.matches('.active')) {
    // Tasks section HTML
    generatedHTML = todos
      .filter(todo => !todo.completed)
      .map(todo => generateTaskHTML(todo, highlight))
      .join('');
  } 
  else if (completedBtnLm.matches('.active')) {
    // Completed Section HTML
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

  // Generate todos placeholder

  if (todosContainerLm.innerHTML === '' && searchTodoBtn.getAttribute('aria-expanded') === 'true') {
    generatePlaceholderImageHTML('img/cute-animals-drawings/croco-capybara-todos.png', 'todos-container__empty-search-section-image');
  } 
  else if (todosContainerLm.innerHTML === '') {
    generatePlaceholderImageHTML('img/cute-animals-drawings/croco-capybara.png', 'todos-container__empty-section-image');
  }
}

function clearAllTodos() {
  if (isAddTodoFormEdited()) return; // if add todo prompt has data return
  setActiveBtn(clearAllTodosBtn);
  clearAllTodosBtn.setAttribute('aria-expanded', true);
  
  if (todos.length) {
    openConfirmDialog(resetTodos, 'Are you sure that you want to delete all tasks?');
  } 
  else {
    openInfoDialog('All tasks have been completed.');
  }
}

// Checks if search is active and generates its specific empty section placeholder image
function generateSpecificSectionHTML() {
  if (filteredTodos.length === 0 && searchTodoBtn.getAttribute('aria-expanded') === 'false') {
    generateTodosHTML(todos);
  } 
  else {
    filteredTodos = filterTodos(todos, searchInputLm);
    generateTodosHTML(filteredTodos, searchInputLm.value);
  }
}

//* Inital function calls

currentDateLm.innerText = formatCurrentDate(currDate);
preloadDialogImages();
getLastActiveSection();
generateTodosHTML(todos);

// Init timer
const timerLm = document.getElementById('timer');
new Timer(timerLm);

//* End of Inital function calls

//* Add event listeners

// Hide app until the the DOM is generated
document.addEventListener('DOMContentLoaded', () => {
  const bouncerLoaderContainerLm = document.getElementById('bouncer-container');
  const bouncerLoaderLm = document.getElementById('bouncer-loader');
  
  // Hide loader
  bouncerLoaderContainerLm.style.backgroundColor = 'transparent'
  bouncerLoaderLm.style.opacity = 0;

  // Set loader dispay to none
  setTimeout(() => {
    bouncerLoaderContainerLm.style.display = 'none';
  }, 500)

  console.log('DOM loaded');
  checkQuotesData();
  initBgTimId = setRandomTheme();
});

// Set theme and quote
refreshQuoteBtn.addEventListener('click', () => {
  if (isAddTodoFormEdited()) return; // if add todo prompt has data return
  // Remove event lsitener from the last background image just in case js garbage collector doesn't work as intended
  lastPreloadedImg.removeEventListener('load', preloadBgImgEventHandler.loadBgImgHandler);
  // Set inital opacity
  backgroundImgLm.style.opacity = 0;
  // Clear past timeouts if active
  clearTimeout(timBgId);
  clearTimeout(initBgTimId);

  timBgId = setRandomTheme(1050); // Changes background theme
  quotesData && setQuote(quotesData, lastQuoteIndex); // Changes quote
}); 

// Add events to intro buttons
searchTodoBtn.addEventListener('click', toggleSearchPrompt); // Add toggle search todo event
addTodoBtn.addEventListener('click', toggleAddTodoPrompt); // Add toggle add todo prompt event
clearAllTodosBtn.addEventListener('click', clearAllTodos); // Add clear all todos event

// Check active section and generates the specific todos HTML needed
todosSectionsContainerLm.addEventListener('click', e => {
  const sectionBtnLms = document.querySelectorAll('#todo-sections button');
  if (e.target.closest('#todo-sections__all-btn')) {
    // All todos
    changeActiveSectionBtn(sectionBtnLms, '#todo-sections__all-btn');
    generateSpecificSectionHTML();
    setCurrentSectionToStorage('todo-sections__all-btn');
  } 
  else if (e.target.closest('#todo-sections__tasks-btn')) {
    // Tasks
    changeActiveSectionBtn(sectionBtnLms, '#todo-sections__tasks-btn');
    generateSpecificSectionHTML();
    setCurrentSectionToStorage('todo-sections__tasks-btn');
  } 
  else if (e.target.closest('#todo-sections__completed-btn')) {
    // Completed todos
    changeActiveSectionBtn(sectionBtnLms, '#todo-sections__completed-btn');
    generateSpecificSectionHTML();
    setCurrentSectionToStorage('todo-sections__completed-btn');
  }
});

// Add events listeners to todo buttons
todosContainerLm.addEventListener('click', e => {
  if (isAddTodoFormEdited()) return; // if add todo prompt has data return
  if (e.target.closest('.todo__complete-btn')) {
    // Complete Todo
    const targetId = e.target.closest('li').id;
    openConfirmDialog(completeTodo.bind(null, targetId), 'Are you sure that you want to complete this task?', true); 
  } 
  else if (e.target.closest('.todo__edit-btn')) {
    // Edit Todo
    const targetId = e.target.closest('li').id;
    const editDialogFormLm = document.getElementById('edit-dialog__form')
    const editDialogFormInputLms = editDialogFormLm.querySelectorAll('input, textarea');
    addTodoInfoToEditForm(targetId, editDialogFormInputLms);
    openEditDialog(targetId, { formerEdit: getTodoInfo(editDialogFormLm) });
  } 
  else if (e.target.closest('.todo__delete-btn')) {
    // Delete todo
    const targetId = e.target.closest('li').id;
    openConfirmDialog(deleteTodo.bind(null, targetId), 'Are you sure that you want to delete this task?');
  }
});
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
  addTodo, 
  deleteTodo, 
  completeTodo, 
  resetTodos, 
  filterTodos, 
  countIncompletedTodos, 
  isTodosLimitReached, 
} from './data/todo.js';

import {
  setRandomTheme,
  lastPreloadedImg,
  preloadBgImgEventHandler
} from './data/themes.js';

import { 
  preloadDialogImages,
  highlighter
} from './utils.js';

const backgroundImgLm = document.getElementById('background-image');
const currentDateLm = document.getElementById('todo-app-intro__current-date');
const refreshQuoteBtn = document.getElementById('quote__new-quote-btn');
const addTodoPromptFormLm = document.getElementById('todo-app-prompt__form');
const addTodoPromptCloseBtn = document.getElementById('todo-app-prompt__cancel-btn');
const searchTodoFormLm = document.getElementById('search-todo-prompt__form');
const searchInputLm = document.getElementById('search-todo-prompt__search-input');
const clearAllTodosBtn = document.getElementById('todo-app-intro__clear-btn');
const todosSectionsContainerLm = document.getElementById('todo-sections');
const allBtnLm = document.getElementById('todo-sections__all-btn');
const todosContainerLm = document.getElementById('todos-container');
const currDate = new Date();
const timsIntroBtns = {};
const focusTimsIntroBtns = {};
let timBgId;
let initBgTimId;
let lastPickedSection = localStorage.getItem('lastPickedSectionId') || '';
let filteredTodos = [];

export const introPrompts = {
  addTodoPrompt: {
    timId: 'addTodoTim',
    btnLm: document.getElementById('todo-app-intro__add-btn'),
    promptLm: document.getElementById('todo-app-prompt'),
    activeClass: 'todo-app-prompt--active',
    time: 1500
  }, 
  searchTodoPrompt: {
    timId: 'searchTodoTim',
    btnLm: document.getElementById('todo-app-intro__search-btn'),
    promptLm: document.getElementById('search-todo-prompt'),
    activeClass: 'search-todo-prompt--active',
    time: 1250
  }
};


//TODO Move search and add todo prompt logic into their own file: 'prompt.js'.
//TODO Improve and refactor search and add todo prompt styles and logic, specially review the timouts clean up.


function checkActiveBtn(btnLm) {
  // Check if the button's 'aria-expanded' attribute is set to 'false'
  if (btnLm.getAttribute('aria-expanded') === 'false') {
    // If 'aria-expanded' attribute does not exist add the 'btn--active' class to the button
    btnLm.classList.add('btn--active');
  } 
  else {  
    // If 'aria-expanded' attribute exists, remove the 'btn--active' class from the button
    btnLm.classList.remove('btn--active');
  }
}

function showPrompt(promptLm, btnLm, classToAdd) {
  promptLm.removeAttribute('hidden');
  btnLm.setAttribute('aria-expanded', true);
  // It needs a bigger delay, 20ms, than usual. Probably due to the complexity of the timeouts and animations interlinked all together.
  setTimeout(() => {
    promptLm.classList.add(classToAdd);
  }, 20);
  // For an element to focus it needs to be called after hidden goes away.
  // Check which add prompt button is active and focus the selected element.
  if (btnLm.matches('#todo-app-intro__search-btn')) {
    // It needs a timeout to focus. Because without it, it breaks addTodoPrompt to searchTodoPrompt animation.
    focusTimsIntroBtns.searchBtnFocusTimId = setTimeout(() => {
      searchInputLm.focus();
    }, 1250);
  } 
  else {
    // Without a timeout it adds lag to the showPromptAnimation.
    focusTimsIntroBtns.addTodoPromptFocusTimId = setTimeout(() => {
      addTodoPromptCloseBtn.focus();
    }, 250);
  }
}

function hidePrompt(promptLm, btnLm, classToRemove, timeoutId, time) {
  btnLm.focus();
  // Set the button's 'aria-expanded' attribute to 'false' to indicate that the related prompt is now collapsed.
  btnLm.setAttribute('aria-expanded', false);
   // Remove the specified class from the prompt element to update its visibility
  promptLm.classList.remove(classToRemove);
  // Delay the hiding of the prompt element
  timsIntroBtns[timeoutId] = setTimeout(() => {
    promptLm.setAttribute('hidden', ''); // Add 'hidden' attribute to hide the prompt element
  }, time);
}

function checkLastBtnTim(e, key, classToMatch, timToMatch) {
  if (e.currentTarget.matches('.' + classToMatch) && key === timToMatch) {
    return 1;
  } 
  else {
    return 0;
  }
}

function clearIntroBtnsFocusTims() {
  for (const key in focusTimsIntroBtns) {
    clearTimeout(focusTimsIntroBtns[key])
  }
}

// Clear all timeouts except the neighbour prompt timeouts.
function clearAllIntroBtnsTims(e) {
  for (const key in timsIntroBtns) {
    if (
      checkLastBtnTim(e, key, 'todo-app-intro__search-btn', 'addTodoTim') || 
      checkLastBtnTim(e, key, 'todo-app-intro__add-btn', 'searchTodoTim') 
      ) {
        continue;
      }
      clearTimeout(timsIntroBtns[key]);
  }
}

export function removeLastActivePrompt({ promptLm, time, btnLm, activeClass, timId }) {
  // Check if the button element has the 'btn--active' class
  if (btnLm.matches('.btn--active')) {
    checkActiveBtn(btnLm); // If the button is active, remove 'btn--active' class
    hidePrompt(promptLm, btnLm, activeClass, timId, time);
  }
}

function togglePrompt({btnLm, promptLm, activeClass, time, timId}, e) {
  if (promptLm.matches('.' + activeClass)) {
    clearIntroBtnsFocusTims(); // Clear intro buttons timeouts.
    hidePrompt(promptLm, btnLm, activeClass, timId, time);
  } 
  else {
    clearIntroBtnsFocusTims(); // Clear intro buttons timeouts.
    clearAllIntroBtnsTims(e) // Clear all timeouts except the neighbour prompt timeouts. If it wouldn't do that, the neighbour intro prompt would not be set to hidden and would be visible in the accessibility tree.
    showPrompt(promptLm, btnLm, activeClass); // Start intro buttons timeouts.
  }
} 

const formatCurrentDate = (date) => date.toLocaleDateString('en-US', {dateStyle: 'long'});

const formatDate = (value) => value.split('-').reverse().join('-');

export function getFormData(form, formatDateBoolean, id) {
  const todoData = {};
  const allFormInputs = [...form.querySelectorAll('input, textarea')];
  
  allFormInputs.forEach(input => {
    if ((input.name === 'date' && formatDateBoolean)) {
      todoData[input.name] = formatDate(input.value)
    }   
    else {
      todoData[input.name] = input.value.trim();
    }
  });

  if (id) {
    todoData.id = id;
  } 
  else {
    todoData.id = `task-${Date.now()}`;
  }

  todoData.completed = false;
  return todoData;
}

function resetForm() {
  const { promptLm, btnLm, activeClass, timId, time} = introPrompts.addTodoPrompt;
  addTodoPromptFormLm.reset();
  checkActiveBtn(btnLm);
  hidePrompt(promptLm, btnLm, activeClass, timId, time);
}

function resetPromptAfterLimitReached(promptLm, btnLm, activeClass, timId, time) {
  checkActiveBtn(btnLm);
  hidePrompt(promptLm, btnLm, activeClass, timId, time);
  addTodoPromptFormLm.reset();
} 

function confirmDiscardAddPromptTypedData() {
  const todoData = Object.values(getFormData(addTodoPromptFormLm, true));
  if (todoData[0] || todoData[1] || todoData[2]) {
    // It needs a timout so when the add todo form is closed with 'Escape' key it does not also closes the confirm dialog
    setTimeout(() => {
      openConfirmDialog(resetForm, 'Are you sure you want to discard all changes made in form?')
    });
  } 
  else {
    const { promptLm, btnLm, activeClass, timId, time } = introPrompts.addTodoPrompt;
    checkActiveBtn(btnLm);
    hidePrompt(promptLm, btnLm, activeClass, timId, time);
  }
}

function addTodoInfoToEditForm(targetId, formInputs, isCurrent, todoData) {
  if (isCurrent) {
    formInputs.forEach((input) => {
      if (input.name === 'date') {
        input.value = formatDate(todoData[input.name]);
      } 
      else {
        input.value = todoData[input.name];
      }
    });
  } 
  else {
    todos.forEach((todo) => {
      if (todo.id === targetId) {
        formInputs.forEach((input) => {
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
}

export function getTodoInfo(formDialogLm) {
  const formInputs = formDialogLm.querySelectorAll('input, textarea');
  const todoInfo = {};
  formInputs.forEach((input) => {
    todoInfo[input.name] = input.value;
  })
  return todoInfo;
}

function changeActiveSectionBtn(sectionBtnLms, btnToAddId) {
  sectionBtnLms.forEach((sectionBtn) => {
    if (sectionBtn.matches(btnToAddId)) {
      sectionBtn.classList.add('todo-sections--active-btn');
      sectionBtn.setAttribute('aria-expanded', true);
    } 
    else {
      sectionBtn.classList.remove('todo-sections--active-btn');
      sectionBtn.setAttribute('aria-expanded', false);
    }
  }); 
}

function setCurrentSectionToStorage(sectionId) {
  lastPickedSection = sectionId;
  localStorage.setItem('lastPickedSectionId', lastPickedSection)
}

function getLastActiveSection() {
  if (!lastPickedSection) {
    const allBtnLm = document.getElementById('todo-sections__all-btn');
    allBtnLm.classList.add('todo-sections--active-btn');
    allBtnLm.setAttribute('aria-expanded', true);
  } else {
    const lastPickedSectionBtn =  document.getElementById(lastPickedSection);
    lastPickedSectionBtn.classList.add('todo-sections--active-btn');
    lastPickedSectionBtn.setAttribute('aria-expanded', true);
  }
}

function generatePlaceholderImageHTML(imgUrl, id) {
  todosContainerLm.innerHTML = `
  <li class="todos-container__img-container">
    <img id="${id}" class="todos-container__empty-section-image" src="${imgUrl}" alt="Drawing of a capybara, with an orange on its head, riding another capybara that at the same time is riding a crocodile"/>
  </li>
`;
}

export function generateTodosHTML(todos, highlight) {
  const tasksLeftLm = document.getElementById('todo-app-intro__tasks-left');
  const tasksBtnLm = document.getElementById('todo-sections__tasks-btn');
  const completedBtnLm = document.getElementById('todo-sections__completed-btn');
  const incompletedTodosCount = countIncompletedTodos();
  const { btnLm } = introPrompts.searchTodoPrompt;
  let generatedHTML = '';
  
  function generateTaskHTML(todo, highlight) {
    return `
    <li id="${todo.id}" class="todo">
      <h3 class="todo__task-name">${highlight ? highlighter(todo.task, highlight) : todo.task}</h3>
      <p class="todo__task-date">${todo.date}</p>
      <p class="todo__task-desc">${todo.description}</p>
      <div class="todo__edit-buttons">
        <button title="Complete task" class="todo__complete-btn" aria-label="Complete todo." type="button">
          <span aria-hidden="true" class="material-symbols-outlined">check_circle</span>
        </button>
        <div>
          <button title="Edit task" class="todo__edit-btn" id="todo__edit-btn-${todo.id}" aria-label="Edit todo." type="button">
            <span aria-hidden="true" class="material-symbols-outlined">edit_square</span>
          </button>
          <button title="Delete task" class="todo__delete-btn" aria-label="Delete todo." type="button">
            <span aria-hidden="true" class="trash material-symbols-outlined">delete</span>
          </button>
        </div>
      </div>
    </li>
  `;
  }

  function genereateCompletedTaskHTML(todo, highlight) {
    return `
    <li id="${todo.id}" class="todo todo--completed">
      <h3 class="todo__task-name">${highlight ? highlighter(todo.task, highlight, true) : todo.task}</h3>
      <p class="todo__task-date todo__task-date--completed">${todo.date}</p>
      <p class="todo__task-desc">${todo.description}</p>
      <div class="todo__edit-buttons todo__edit-buttons--completed">
        <button title="Delete completed task" class="todo__delete-btn" aria-label="Delete todo." type="button">
          <span aria-hidden="true" class="trash material-symbols-outlined">delete</span>
        </button>
      </div>
    </li>
  `;
  }

  // Display incompleted tasks count.
  if (incompletedTodosCount === 1) {
    tasksLeftLm.innerText = `${incompletedTodosCount} task left`
  } 
  else {
    tasksLeftLm.innerText = `${incompletedTodosCount} tasks left`
  }
  
  // Display Todos.
  if (allBtnLm.matches('.todo-sections--active-btn')) {
    // All section HTML
    generatedHTML = todos
    .map(todo => todo.completed ? genereateCompletedTaskHTML(todo, highlight) : generateTaskHTML(todo, highlight))
    .join('');
  } 
  else if (tasksBtnLm.matches('.todo-sections--active-btn')) {
    // Tasks section HTML
    generatedHTML = todos
    .filter(todo => !todo.completed)
    .map(todo => generateTaskHTML(todo, highlight))
    .join('');
  } 
  else if (completedBtnLm.matches('.todo-sections--active-btn')) {
    // Completed Section HTML
    generatedHTML = todos
    .filter(todo => todo.completed)
    .map(todo => genereateCompletedTaskHTML(todo, highlight))
    .join('');
  }

  todosContainerLm.innerHTML = generatedHTML;

  if (todosContainerLm.innerHTML === '' && btnLm.getAttribute('aria-expanded') === 'true') {
    generatePlaceholderImageHTML('img/cute-animals-drawings/croco-capybara-todos.png', 'todos-container__empty-search-section-image');
  } 
  else if (todosContainerLm.innerHTML === '') {
    generatePlaceholderImageHTML('img/cute-animals-drawings/croco-capybara.png', 'todos-container__empty-section-image');
  }
}

function checkSearchTodosPlaceholder() {
  const isSearchEmptyPlaceholder = todosContainerLm.querySelector('#todos-container__empty-search-section-image');
  if (isSearchEmptyPlaceholder) {
    generatePlaceholderImageHTML('img/cute-animals-drawings/croco-capybara.png', 'todos-container__empty-section-image');
  }
}

function resetSearch() {
  generateTodosHTML(todos);
  searchTodoFormLm.reset();
}

function showAddTodoPrompt(e) {
  const { addTodoPrompt, searchTodoPrompt } = introPrompts;
  const addTodoBtnLm = addTodoPrompt.btnLm;
  checkActiveBtn(addTodoBtnLm);
  removeLastActivePrompt(searchTodoPrompt);
  togglePrompt(addTodoPrompt, e);
  checkSearchTodosPlaceholder();
}

function showSearchTodoPrompt(e) {
  const { addTodoPrompt, searchTodoPrompt } = introPrompts;
  const searchBtnLm = searchTodoPrompt.btnLm;
  checkActiveBtn(searchBtnLm);
  removeLastActivePrompt(addTodoPrompt);
  togglePrompt(searchTodoPrompt, e);
  resetSearch();
}

function clearAllTodos() {
  if (todos.length) {
    openConfirmDialog(resetTodos, 'Are you sure that you want to delete all tasks?');
  } 
  else {
    openInfoDialog('All tasks have been completed.');
  }
  
  //clearAllTodosBtn.classList.add('todo-app-intro__clear-btn--active');
}

function closeSearchPrompt() {
  const { promptLm, btnLm, activeClass, timId, time} = introPrompts.searchTodoPrompt;
  checkActiveBtn(btnLm);
  hidePrompt(promptLm, btnLm, activeClass, timId, time);
  resetSearch();
}

// Checks if search is active and generates its specific empty section placeholder image.
function generateSpecificSectionHTML() {
  const { btnLm } = introPrompts.searchTodoPrompt;
  if (!filteredTodos.length && btnLm.getAttribute('aria-expanded') === 'false') {
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

//* End of Inital function calls

//* Add event listeners

document.addEventListener('DOMContentLoaded', () => {
  // Record the end time
  const DOMContentEndTime = performance.now();
  // Calculate the time taken for the DOM to load
  const DOMLoadTime = DOMContentEndTime - DOMContentStartTime;

  // Hide the DOMContentLoaded loader
  const bouncerLoaderLm = document.getElementById('bouncer-loader');
  bouncerLoaderLm.style.display = 'none';

  console.log('DOM loaded');

  if (DOMLoadTime <= 250) {
    // DOM loaded in less than or equal to 250ms, proceed with the timeout
    setTimeout(() => {
      checkQuotesData();
    }, 250);
    initBgTimId = setRandomTheme(250, true);
  } 
  else {
    // DOM loaded in more than 250ms, do not add the timeout
    checkQuotesData();
    initBgTimId = setRandomTheme(0);
  }
});

refreshQuoteBtn.addEventListener('click', () => {
  // Remove event lsitener from the last backgroun image just in case js garbage collector doesn't work as intended
  lastPreloadedImg.removeEventListener('load', preloadBgImgEventHandler.loadBgImgHandler);
  // Set inital opacity
  backgroundImgLm.style.opacity = 0;
  // Clear past timeouts if active
  clearTimeout(timBgId);
  clearTimeout(initBgTimId);

  timBgId = setRandomTheme(1050); // Changes background theme
  quotesData && setQuote(quotesData, lastQuoteIndex); // Changes quote
}); 

introPrompts.addTodoPrompt.btnLm.addEventListener('click', showAddTodoPrompt);

introPrompts.searchTodoPrompt.btnLm.addEventListener('click', showSearchTodoPrompt);

// Search todos at input change.
searchInputLm.addEventListener('input', e => {
  filteredTodos = filterTodos(todos, e.target);
  // generate the todos with the highlighted matched text
  generateTodosHTML(filteredTodos, e.target.value);
});

// Prevent default at form submit
searchTodoFormLm.addEventListener('submit', e => {
  e.preventDefault();
});

searchTodoFormLm.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeSearchPrompt();
  }
});

clearAllTodosBtn.addEventListener('click', clearAllTodos);

// Add todo.
addTodoPromptFormLm.addEventListener('submit', e => {
  e.preventDefault();
  const { promptLm, btnLm, activeClass, timId, time } = introPrompts.addTodoPrompt;

  if (isTodosLimitReached()) {
    openInfoDialog('You have reached the maximum limit of 100 todos.',  resetPromptAfterLimitReached.bind(null, promptLm, btnLm, activeClass, timId, time));
  } 
  else {
    addTodo('unshift', addTodoPromptFormLm);
    checkActiveBtn(btnLm);
    hidePrompt(promptLm, btnLm, activeClass, timId, time);
    addTodoPromptFormLm.reset();
  }
});

addTodoPromptCloseBtn.addEventListener('click', () => {
  confirmDiscardAddPromptTypedData();
});

addTodoPromptFormLm.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    confirmDiscardAddPromptTypedData();
  }
});

// Check active section and generates the specific todos HTML needed.
todosSectionsContainerLm.addEventListener('click', e => {
  const sectionBtnLms = document.querySelectorAll('#todo-sections button');
  if (e.target.closest('#todo-sections__all-btn')) {
    // All
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
    // Completed
    changeActiveSectionBtn(sectionBtnLms, '#todo-sections__completed-btn');
    generateSpecificSectionHTML();
    setCurrentSectionToStorage('todo-sections__completed-btn');
  }
});

// Add events listener functionality to todo buttons.
todosContainerLm.addEventListener('click', e => {
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
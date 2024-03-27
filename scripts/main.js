import { 
  quotesData, 
  getQuoteData, 
  generateQuote, 
  setQuoteCache,
  setShareBtnsHrefAtr
} from './quote.js';

import { 
  openModal, 
  generateConfirmDialogHTML, 
  generateEditTodoDialogHTML,
  initializeConfirmDialog,
  openConfirmDailog
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
  checkIfCurrentThemeIsRepeated, 
  changeTheme, 
  setlastShuffledThemeToLocalStorage
} from './data/themes.js';

import { getRandomIndex } from './utils.js';

const currentRandomTheme = checkIfCurrentThemeIsRepeated();
const currentDateLm = document.getElementById('todo-app-intro__current-date');
const currDate = new Date();
const refreshQuoteBtn = document.getElementById('quote__new-quote-btn');
const addTodoPromptFormLm = document.getElementById('todo-app-prompt__form');
const addTodoPromptCloseBtn = document.getElementById('todo-app-prompt__cancel-btn');
const searchTodoFormLm = document.getElementById('search-todo-prompt__form');
const searchInputLm = document.getElementById('search-todo-prompt__search-input');
const clearAllTodosBtn = document.getElementById('todo-app-intro__clear-btn');
const todosSectionsContainerLm = document.getElementById('todo-sections');
const allBtnLm = document.getElementById('todo-sections__all-btn');
const todosContainerLm = document.getElementById('todos-container');
const timsIntroBtns = {};
const focusTimsIntroBtns = [];
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

// Todo 30/03/2024 - Finish app.

// Implement change theme functionality and animation.

// Add all the needed themes and colors.

// Add localStorage to todos section to remember which was picked on page load.

// Add proper cache to quotes to load the cache on page load instead of again fetching the data.

// Add load animation to quote text.

// Add random recycle image to discard modal dialog.

// Refactor and make an utility file with the most reusable functions around the project.

// Finish the app style and media queries.

// Todo 30/03/2024 - Finish app.
  
function checkActiveBtn(btnLm) {
  if (btnLm.getAttribute('aria-expanded') === 'false') {
    btnLm.classList.add('btn--active');
  } 
  else {  
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
    focusTimsIntroBtns[0] = setTimeout(() => {
      searchInputLm.focus();
    }, 500);
  } 
  else {
    // Without a timeout it adds lag to the showPromptAnimation.
    focusTimsIntroBtns[1] = setTimeout(() => {
      addTodoPromptCloseBtn.focus();
    }, 250);
  }
}

function hidePrompt(promptLm, btnLm, classToRemove, timeoutId, time) {
  btnLm.focus();
  btnLm.setAttribute('aria-expanded', false);
  promptLm.classList.remove(classToRemove);
  timsIntroBtns[timeoutId] = setTimeout(() => {
    promptLm.setAttribute('hidden', '');
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
  focusTimsIntroBtns.forEach((focusTim) => {
    clearTimeout(focusTim);
  });
}

// Clear all timeouts expect the neighbour prompt timeouts.
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

export function removeLastActivePrompt({promptLm, time, btnLm, activeClass, timId}) {
  if (btnLm.matches('.btn--active')) {
    checkActiveBtn(btnLm);
    hidePrompt(promptLm, btnLm, activeClass, timId, time);
  }
}

function togglePrompt({btnLm, promptLm, activeClass, time, timId}, e) {
  if (promptLm.matches('.' + activeClass)) {
    clearIntroBtnsFocusTims();
    hidePrompt(promptLm, btnLm, activeClass, timId, time);
  } 
  else {
    // Clear all timeouts expect the neighbour prompt timeouts. If it wouldn't do that, the neighbour intro prompt would not be set to hidden and would be visible in the accessibility tree.
    clearAllIntroBtnsTims(e)
    showPrompt(promptLm, btnLm, activeClass);
  }
} 

const formatCurrentDate = (date) => date.toLocaleDateString('en-US', {dateStyle: 'long'});

const formatDate = (value) => value.split('-').reverse().join('-');

export function getFormData(form, formatDateBoolean, id) {
  const todoData = {};
  const allFormInputs = [...form.querySelectorAll('input, textarea')];
  
  allFormInputs.forEach((input) => {
    if ((input.name  === 'date' && formatDateBoolean)) {
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

function showAddTodoPrompt(e) {
  const { addTodoPrompt, searchTodoPrompt } = introPrompts;
  const addTodoBtnLm = addTodoPrompt.btnLm;
  checkActiveBtn(addTodoBtnLm);
  removeLastActivePrompt(searchTodoPrompt);
  togglePrompt(addTodoPrompt, e);
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
  if(todoData[0] || todoData[1] || todoData[2]) {
    openConfirmDailog(resetForm, 'Are you sure you want to discard all changes made in form?')
  } 
  else {
    const { promptLm, btnLm, activeClass, timId, time } = introPrompts.addTodoPrompt;
    checkActiveBtn(btnLm);
    hidePrompt(promptLm, btnLm, activeClass, timId, time);
  }
}

function addTodoInfoToEditForm(targetId, formInputs) {
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
    if (!sectionBtn.matches(btnToAddId)) {
      sectionBtn.classList.remove('todo-sections--active-btn');
    } 
    else {
      sectionBtn.classList.add('todo-sections--active-btn')
    }
  }); 
}

export function generateTodosHTML(todos) {
  const tasksLeftLm = document.getElementById('todo-app-intro__tasks-left');
  const tasksBtnLm = document.getElementById('todo-sections__tasks-btn');
  const completedBtnLm = document.getElementById('todo-sections__completed-btn');
  const incompletedTodosCount = countIncompletedTodos();
  const { btnLm } = introPrompts.searchTodoPrompt;
  let generatedHTML = '';
  
  function generatePlaceholderImageHTML(imgUrl) {
    todosContainerLm.innerHTML = `
    <div class="todos-container__img-container">
      <img class="todos-container__empty-section-image" src=${imgUrl} alt="Drawing of a capybara, with an orange on its head, riding another capybara that at the same time is riding a crocodile"/>
    </div>
  `;
  }

  function generateTaskHTML(todo) {
    return `
    <li id="${todo.id}" class="todo">
      <h3 class="todo__task-name">${todo.task}</h3>
      <p class="todo__task-date">${todo.date}</p>
      <p class="todo__task-desc">${todo.description}</p>
      <div class="todo__edit-buttons">
        <button class="todo__complete-btn" aria-label="Complete todo." type="button">
          <span aria-hidden="true" class="material-symbols-outlined">check_circle</span>
        </button>
        <div>
          <button class="todo__edit-btn" id="todo__edit-btn-${todo.id}" aria-label="Edit todo." type="button">
            <span aria-hidden="true" class="material-symbols-outlined">edit_square</span>
          </button>
          <button class="todo__delete-btn" aria-label="Delete todo." type="button">
            <span aria-hidden="true" class="trash material-symbols-outlined">delete</span>
          </button>
        </div>
      </div>
    </li>
  `;
  }

  function genereateCompletedTaskHTML(todo) {
    return `
    <li id="${todo.id}" class="todo todo--completed">
      <h3 class="todo__task-name">${todo.task}</h3>
      <p class="todo__task-date todo__task-date--completed">${todo.date}</p>
      <p class="todo__task-desc">${todo.description}</p>
      <div class="todo__edit-buttons todo__edit-buttons--completed">
        <button class="todo__delete-btn" aria-label="Delete todo." type="button">
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
    .map((todo) => todo.completed ? genereateCompletedTaskHTML(todo) : generateTaskHTML(todo))
    .join('');
  } 
  else if (tasksBtnLm.matches('.todo-sections--active-btn')) {
    // Tasks section HTML
    generatedHTML = todos
    .filter((todo) => !todo.completed)
    .map((todo) => generateTaskHTML(todo))
    .join('');
  } 
  else if (completedBtnLm.matches('.todo-sections--active-btn')) {
    // Completed Section HTML
    generatedHTML = todos
    .filter((todo) => todo.completed)
    .map((todo) => genereateCompletedTaskHTML(todo))
    .join('');
  }

  todosContainerLm.innerHTML = generatedHTML;

  if (todosContainerLm.innerHTML === '' && btnLm.getAttribute('aria-expanded') === 'true') {
    generatePlaceholderImageHTML("img/cute-animals-drawings/croco-capybara-todos.png")
  } 
  else if (todosContainerLm.innerHTML === '') {
    generatePlaceholderImageHTML("img/cute-animals-drawings/croco-capybara.png")
  }
}

function resetSearch() {
  generateTodosHTML(todos);
  searchTodoFormLm.reset();
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
  openConfirmDailog(resetTodos, 'Are you sure that you want to delete all tasks?')
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
    generateTodosHTML(filteredTodos);
  }
}

if (!quotesData) {
  getQuoteData()
  .then((data) =>{
    setQuoteCache(data.quotes);
    const randomCurrentQuote = quotesData[getRandomIndex(quotesData)];
    generateQuote(randomCurrentQuote);
    setShareBtnsHrefAtr(randomCurrentQuote);
  })
  .catch((err) => console.err(err));
}

setlastShuffledThemeToLocalStorage(currentRandomTheme);
changeTheme(currentRandomTheme);

currentDateLm.innerText = formatCurrentDate(currDate);

allBtnLm.classList.add('todo-sections--active-btn');

generateTodosHTML(todos);

refreshQuoteBtn.addEventListener('click', () => {
  if (quotesData && !document.body.matches('.change-theme-active')) {
    const randomCurrentQuote = quotesData[getRandomIndex(quotesData)];
    const currentRandomTheme = checkIfCurrentThemeIsRepeated();
    setlastShuffledThemeToLocalStorage(currentRandomTheme);
    generateQuote(randomCurrentQuote);
    setShareBtnsHrefAtr(randomCurrentQuote);
    changeTheme(currentRandomTheme);
  }
}); 

introPrompts.addTodoPrompt.btnLm.addEventListener('click', showAddTodoPrompt);

introPrompts.searchTodoPrompt.btnLm.addEventListener('click', showSearchTodoPrompt);

// Search todos at keyup.
searchInputLm.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    return;
  }
  filteredTodos = filterTodos(todos, e.target);
  generateTodosHTML(filteredTodos);
});

// Search todos at submit.
searchTodoFormLm.addEventListener('submit', (e) => {
  e.preventDefault();
  filteredTodos = filterTodos(todos, searchInputLm);
  generateTodosHTML(filteredTodos);
  
  // No todos have been found.
  if (!filteredTodos.length) {
    generateConfirmDialogHTML();
    const { closeLm, confirmationLm } = initializeConfirmDialog('No todos have been found');
    openModal(null, null, closeLm, confirmationLm, confirmationLm, closeSearchPrompt);
  }
});

searchTodoFormLm.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeSearchPrompt();
  }
});

clearAllTodosBtn.addEventListener('click', clearAllTodos);

// Add todo.
addTodoPromptFormLm.addEventListener('submit', (e) => {
  e.preventDefault();
  const { promptLm, btnLm, activeClass, timId, time } = introPrompts.addTodoPrompt;

  if (isTodosLimitReached()) {
    generateConfirmDialogHTML();
    const { closeLm, confirmationLm } = initializeConfirmDialog('You have reached the maximum, 100 todos, allowed limit.');
    openModal(null, null, closeLm, closeLm, confirmationLm, resetPromptAfterLimitReached.bind(null, promptLm, btnLm, activeClass, timId, time));
  } 
  else {
    addTodo('unshift', addTodoPromptFormLm);
    checkActiveBtn(btnLm);
    hidePrompt(promptLm, btnLm, activeClass, timId, time);
    addTodoPromptFormLm.reset();
  }
});

addTodoPromptCloseBtn.addEventListener('click', () => {
  confirmDiscardAddPromptTypedData()
});

addTodoPromptFormLm.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    confirmDiscardAddPromptTypedData()
  }
});

// Check active section and generates the specific todos HTML needed.
todosSectionsContainerLm.addEventListener('click', (e) => {
  const sectionBtnLms = document.querySelectorAll('#todo-sections button');
  if (e.target.closest('#todo-sections__all-btn')) {
    // All
    changeActiveSectionBtn(sectionBtnLms, '#todo-sections__all-btn');
    generateSpecificSectionHTML();
  } 
  else if (e.target.closest('#todo-sections__tasks-btn')) {
    // Tasks
    changeActiveSectionBtn(sectionBtnLms, '#todo-sections__tasks-btn');
    generateSpecificSectionHTML();
  } 
  else if (e.target.closest('#todo-sections__completed-btn')) {
    // Completed
    changeActiveSectionBtn(sectionBtnLms, '#todo-sections__completed-btn');
    generateSpecificSectionHTML();
  }
});

// Add events listener functionality to todo buttons.
todosContainerLm.addEventListener('click', (e) => {
  if (e.target.closest('.todo__complete-btn')) {
    // Complete Todo.
    const targetId = e.target.closest('li').id;
    openConfirmDailog(completeTodo.bind(null, targetId), 'Are you sure that you want to complete this task?'); 
  } 
  else if (e.target.closest('.todo__edit-btn')) {
    // Edit Todo.
    const targetId = e.target.closest('li').id;
    const { closeBtn, formDialogLm, formInputs } = generateEditTodoDialogHTML();
    addTodoInfoToEditForm(targetId, formInputs);
    openModal(targetId, {formerEdit: getTodoInfo(formDialogLm)}, closeBtn, closeBtn);
  } 
  else if (e.target.closest('.todo__delete-btn')) {
    // Delete todo.
    const targetId = e.target.closest('li').id;
    openConfirmDailog(deleteTodo.bind(null, targetId), 'Are you sure that you want to delete this task?');
  }
});
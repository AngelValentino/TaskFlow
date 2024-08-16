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
  setActiveBtn
} from './utils.js';

import {
  toggleAddTodoPrompt,
  toggleSearchPrompt,
  isAddTodoFormEdited
} from './prompt.js';

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
let lastPickedSection = localStorage.getItem('lastPickedSectionId') || '';
let filteredTodos = [];

//TODO Refactor generateHTML and placeholder logic 

const formatCurrentDate = (date) => date.toLocaleDateString('en-US', {dateStyle: 'long'});

const formatDate = (value) => value.split('-').reverse().join('-');

export function getFormData(form, formatDateBoolean, id) {
  const todoData = {};
  const allFormInputs = [...form.querySelectorAll('input, textarea')];
  
  allFormInputs.forEach(input => {
    if ((input.name === 'date' && formatDateBoolean)) {
      todoData[input.name] = formatDate(input.value);
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

  if (todosContainerLm.innerHTML === '' && searchTodoBtn.getAttribute('aria-expanded') === 'true') {
    generatePlaceholderImageHTML('img/cute-animals-drawings/croco-capybara-todos.png', 'todos-container__empty-search-section-image');
  } 
  else if (todosContainerLm.innerHTML === '') {
    generatePlaceholderImageHTML('img/cute-animals-drawings/croco-capybara.png', 'todos-container__empty-section-image');
  }
}

// function checkSearchTodosPlaceholder() {
//   const isSearchEmptyPlaceholder = todosContainerLm.querySelector('#todos-container__empty-search-section-image');
//   if (isSearchEmptyPlaceholder) {
//     generatePlaceholderImageHTML('img/cute-animals-drawings/croco-capybara.png', 'todos-container__empty-section-image');
//   }
// }


// function showAddTodoPrompt(e) {
//   const { addTodoPrompt, searchTodoPrompt } = introPrompts;
//   const addTodoBtnLm = addTodoPrompt.btnLm;
//   setActiveBtn(addTodoBtnLm);
//   removeLastActivePrompt(searchTodoPrompt);
//   togglePrompt(addTodoPrompt, e);
//   checkSearchTodosPlaceholder();
// }

// function showSearchTodoPrompt(e) {
//   const { addTodoPrompt, searchTodoPrompt } = introPrompts;
//   const searchBtnLm = searchTodoPrompt.btnLm;
//   setActiveBtn(searchBtnLm);
//   removeLastActivePrompt(addTodoPrompt);
//   togglePrompt(searchTodoPrompt, e);
//   resetSearch();
// }



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

// Checks if search is active and generates its specific empty section placeholder image.
function generateSpecificSectionHTML() {
  if (!filteredTodos.length && searchTodoBtn.getAttribute('aria-expanded') === 'false') {
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
  if (isAddTodoFormEdited()) return; // if add todo prompt has data return
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

searchTodoBtn.addEventListener('click', toggleSearchPrompt);

addTodoBtn.addEventListener('click', toggleAddTodoPrompt);

clearAllTodosBtn.addEventListener('click', clearAllTodos);

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
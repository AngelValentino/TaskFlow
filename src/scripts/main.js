import { 
  openModal, 
  generateConfirmAddPromptDialogHTML, 
  generateEditTodoDialogHTML 
} from './dialog.js';

import { todos, addTodo, deleteTodo } from './data/todo.js';

const refreshQuoteBtn = document.getElementById('quote__btn');
const addTodoPromptFormLm = document.getElementById('todo-app-prompt__form');
const addTodoPromptCloseBtn = document.getElementById('todo-app-prompt__cancel-btn');
const todosContainerLm = document.getElementById('todos-container');
const timsIntroBtns = {};

const introPrompts = {
  addTodoPrompt: {
    btnLm: document.getElementById('todo-app-intro__add-btn'),
    promptLm: document.getElementById('todo-app-prompt'),
    activeClass: 'todo-app-prompt--active',
    timeout: {
      lastPromptTim: 'promptToSearchTim',
      currentTim: 'addTodoTim',
      time: 1500
    }
  }, 
  searchTodoPrompt: {
    btnLm: document.getElementById('todo-app-intro__search-btn'),
    promptLm: document.getElementById('search-todo-prompt'),
    activeClass: 'search-todo-prompt--active',
    timeout: {
      lastPromptTim: 'searchToPromptTim',
      currentTim: 'searchTim',
      time: 1250
    }
  }
};

// Todo 20/03/2024: Complete todo app widget.

  /*  Completed dialog modularity.
    // editTodo, deleteTodo, limit100, cancelAddTodoPrompt, completeTodo will share the same custom dialog. 
  */

  // Implement edit Todo
    // Open a form dialog with the task values typed in
    // check if the use has changed anything and send confirmational modal
    // Submit data and unshift to todos array

  // fix add todo prompt focus bug

  // Add max incompleted todos limit = 100;
    // if (user tries to submit todoData and there already are 100 incompleted todos) {
    //   show informational dialog = there are already 100 incompleted todos, you've reached the allowed task limit.
    //   then close dialog and close and reset addTodoPrompt.
    // }

  // Make new todos start from the beginning of the array insted of the end.

  // Add deleteTodo confirmational dialog

  // Implement complete todo
    // if (user clicks complete) {
    //   show and alert modal to confrm if they want to complete it
    // } else {
    //   change todo complete = true
    // }

    // in genereateHTML before generating the todo check 
    // if (todo.complete === true) {
    //   generate a HTML template for the completed todo
    //     add only a delete button
    //     make the todo grey
    //     send todo to the bottom of the list
    // }

  // Make todo section functional 
    // generate HTML depending on if the task is completed or not.
    // All => genereateTodosHTML()
    // Tasks => completed = false; generateTasksHTML()
    // Completed => completed = true; generateCompletedTasksHTML();

  // Implement clear all todos and confirmationa modal
  
  // Implement search todos

  // Place todo data code in its own file, todo.js.

// Todo 20/03/2024: Complete todo app widget.

async function getQuoteData() {
  const response = await fetch('/.netlify/functions/fetch-data');
  if (response.status !== 200) {
    throw new Error("Could't fetch the data");
  }
  return await response.json();
}

function checkActiveBtn(btnLm) {
  if (btnLm.getAttribute('aria-expanded') === 'false') {
    btnLm.classList.add('btn--active');
  } 
  else {  
    btnLm.classList.remove('btn--active');
  }
};

function showPrompt(promptLm, btnLm, classToAdd) {
  promptLm.removeAttribute('hidden');
  btnLm.setAttribute('aria-expanded', true);
  setTimeout(() => {
    promptLm.classList.add(classToAdd);
  }, 10);
}

function hidePrompt(promptLm, btnLm, classToRemove, timeoutId, time) {
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

function clearAllIntroBtnsTims(lastActiveTim, e) {
  for (const key in timsIntroBtns) {
    if (key !== lastActiveTim) {
      if (
        checkLastBtnTim(e, key, 'todo-app-intro__search-btn', 'addTodoTim') || 
        checkLastBtnTim(e, key, 'todo-app-intro__add-btn', 'searchTim') || 
        checkLastBtnTim(e, key, 'todo-app-intro__search-btn', 'submitPromptTim') ||
        checkLastBtnTim(e, key, 'todo-app-intro__search-btn', 'alertDialogDiscardChangesTim')
        ) {
        continue;
      }
      clearTimeout(timsIntroBtns[key]);
    } 
  }
}

function removeLastActivePrompt({promptLm, timeout: {lastPromptTim, time}, btnLm, activeClass}) {
  if (btnLm.matches('.btn--active')) {
    checkActiveBtn(btnLm);
    hidePrompt(promptLm, btnLm, activeClass, lastPromptTim, time);
  }
}

function togglePrompt({btnLm, promptLm, activeClass, timeout: {currentTim, time}}, {timeout: {lastPromptTim}}, e) {
  if (promptLm.matches('.' + activeClass)) {
    hidePrompt(promptLm, btnLm, activeClass, currentTim, time);
  } 
  else {
    clearAllIntroBtnsTims(lastPromptTim, e);
    showPrompt(promptLm, btnLm, activeClass);
  }
} 

const formatDate = (value) => value.split('-').reverse().join('-');

export function getFormData(form) {
  const todoData = {};
  const allFormInputs = [...form.querySelectorAll('input, textarea')];
  
  allFormInputs.forEach((input) => {
    if ((input.name) === 'date') {
      todoData[input.name] = formatDate(input.value)
    }   
    else {
      todoData[input.name] = input.value.trim();
    }
  });

  todoData.id = `task-${Date.now()}`;
  todoData.completed = false;
  return todoData;
}

// add focus to close btn

function showAddTodoPrompt(e) {
  const { addTodoPrompt, searchTodoPrompt } = introPrompts;
  const addTodoBtnLm = addTodoPrompt.btnLm;
  checkActiveBtn(addTodoBtnLm);
  removeLastActivePrompt(searchTodoPrompt);
  togglePrompt(addTodoPrompt, searchTodoPrompt, e);
}

function showSearchTodoPrompt(e) {
  const { addTodoPrompt, searchTodoPrompt } = introPrompts;
  const searchBtnLm = searchTodoPrompt.btnLm;
  checkActiveBtn(searchBtnLm);
  removeLastActivePrompt(addTodoPrompt);
  togglePrompt(searchTodoPrompt, addTodoPrompt, e);
}

function resetForm() {
  const {promptLm, btnLm, activeClass, timeout: {time}} = introPrompts.addTodoPrompt;
  addTodoPromptFormLm.reset();
  checkActiveBtn(btnLm);
  hidePrompt(promptLm, btnLm, activeClass, 'alertDialogDiscardChangesTim', time);
}

export function generateTodosHTML() {
  const generetedHTML = todos
    .map((todo) => `
      <li id="${todo.id}" class="todo">
        <h3 class="todo__task-name">${todo.task}</h3>
        <p class="todo__task-date">${todo.date}</p>
        <p class="todo__task-desc">${todo.description}</p>
        <div class="todo__edit-buttons">
          <button class="todo__complete-btn" aria-label="Complete todo." type="button">
            <span aria-hidden="true" class="material-symbols-outlined">check_circle</span>
          </button>
          <div>
            <button class="todo__edit-btn" aria-label="Edit todo." type="button">
              <span aria-hidden="true" class="material-symbols-outlined">edit_square</span>
            </button>
            <button class="todo__delete-btn" aria-label="Delete todo." type="button">
              <span aria-hidden="true" class="trash material-symbols-outlined">delete</span>
            </button>
          </div>
        </div>
      </li>
    `)
    .join('');

  todosContainerLm.innerHTML = generetedHTML;
}

generateTodosHTML();

introPrompts.addTodoPrompt.btnLm.addEventListener('click', showAddTodoPrompt);

introPrompts.searchTodoPrompt.btnLm.addEventListener('click', showSearchTodoPrompt);

addTodoPromptFormLm.addEventListener('submit', (e) => {
  e.preventDefault();
  const {promptLm, btnLm, activeClass, timeout: {time}} = introPrompts.addTodoPrompt;

  addTodo('push', addTodoPromptFormLm);
  checkActiveBtn(btnLm);
  hidePrompt(promptLm, btnLm, activeClass, 'submitPromptTim', time);
  addTodoPromptFormLm.reset();
});

addTodoPromptCloseBtn.addEventListener('click', () => {
  const todoData = Object.values(getFormData(addTodoPromptFormLm));
  if(todoData[0] || todoData[1] || todoData[2]) {
    generateConfirmAddPromptDialogHTML();
    const closeLms = document.querySelectorAll('#dialog__discard-btn, #dialog__cancel-btn');
    const confirmationLm = document.getElementById('dialog__confirmation-btn');
    const discardBtn = document.getElementById('dialog__discard-btn');
    openModal(null, closeLms, discardBtn, confirmationLm, resetForm);
    // add focus at form close
  } 
  else {
    const {btnLm, promptLm, activeClass, timeout: {time}} = introPrompts.addTodoPrompt;
    checkActiveBtn(btnLm);
    hidePrompt(promptLm, btnLm, activeClass, 'closeAddTodoPromptTim', time);
    // add focus at form close
  }
});

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

todosContainerLm.addEventListener('click', (e) => {
  console.log(e.target)
  if (e.target.closest('.todo__complete-btn')) {
    //complete todo
  } 
  else if (e.target.closest('.todo__edit-btn')) {
    generateEditTodoDialogHTML();
    const closeBtn = document.getElementById('form-dialog__cancel-btn');
    const targetId = e.target.closest('li').id;
    const formDialogLm = document.getElementById('form-dialog');
    const formInputs = formDialogLm.querySelectorAll('input, textarea');
    addTodoInfoToEditForm(targetId, formInputs)
    openModal(targetId, closeBtn, closeBtn);
  } 
  else if (e.target.closest('.todo__delete-btn')) {
    const targetId = e.target.closest('li').id;
    deleteTodo(targetId);
  }
});

refreshQuoteBtn.addEventListener('click', () => {
  getQuoteData()
    .then(data => console.log(data))
    .catch(err => console.err(err));
}); 
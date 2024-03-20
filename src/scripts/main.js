import { 
  openModal, 
  generateConfirmDialogHTML, 
  generateEditTodoDialogHTML,
  initializeConfirmLimitDialog
} from './dialog.js';

import { todos, addTodo, deleteTodo } from './data/todo.js';

const refreshQuoteBtn = document.getElementById('quote__btn');
const addTodoPromptFormLm = document.getElementById('todo-app-prompt__form');
const addTodoPromptCloseBtn = document.getElementById('todo-app-prompt__cancel-btn');
const clearAllTodosBtn = document.getElementById('todo-app-intro__clear-btn');
const todosSectionsContainerLm = document.getElementById('todo-sections');
const allBtnLm = document.getElementById('todo-sections__all-btn');
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

// Todo 23/03/2024: Complete todo and quote widget.

  /*  Completed - Dialog modularity.
        // editTodo, deleteTodo, limit100, cancelAddTodoPrompt, completeTodo will share the same custom dialog. 
  */

  /*  Completed - Implement edit Todo.
        // Open a form dialog with the task values typed in
        // Check if the user has changed anything and send a confirmational modal
        // Submit data and unshift to todos array
  */

  /*  Completed - Place todo data code in its own file, todo.js.        
        // Place todo data code in its own file, todo.js. 
  */
  
  /*  Completed - Fix add todo prompt focus bug.
        // fix add todo prompt focus bug 
  */

  /*  Completed - Add max incompleted todos; limit = 100.
        // if (user tries to submit todoData and there already are 100 incompleted todos) {
        //   show informational dialog = there are already 100 incompleted todos, you've reached the allowed task limit.
        //   then close dialog and close and reset addTodoPrompt.
        // }
  */

  /*  Completed - Make new todos start from the beginning of the array insted of the end of it.       
        // todo saturday - Make new todos start from the beginning of the array insted of the end.
  */

  /*  Completed - Add deleteTodo confirmational dialog.     
        // todo saturday - Add deleteTodo confirmational dialog 
  */

  /*  Completed - Implement complete todo.
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
  */

  /*  Completed - Make todo section functional.
        // generate HTML depending on if the task is completed or not.
        // All => genereateTodosHTML()
        // Tasks => completed = false; generateTasksHTML()
        // Completed => completed = true; generateCompletedTasksHTML();

        //if todo section is empty generate a cute image.
        //remember the section clicked when the page loads. 
  */

  /*  Completed - Implement clear all todos and confirmationaL modal.
        // Todo Wednesday - Implement clear all todos and confirmationaL modal. 
  */

  /*  Completed - Refactor initialize elements before generateDialogHTML to become modular. 
        // Todo Wednesday - Refactor initialize elements before generateDialogHTML to become modular. 
  */

  // Todo Wednesday - Refactor clear intro buttons timeouts.

  // Todo Friday - Count all incompleted todos, display current date.
  
  // Todo Friday - Implement search todos.

  // Todo Saturday - Generate new quote when the new quote button is clicked.

  // Todo Saturady - Share with twitter and tumblr.

// Todo 23/03/2024: Complete todo and quote widget.

async function getQuoteData() {
  const response = await fetch('/.netlify/functions/fetch-data');
  if (response.status !== 200) {
    throw new Error("Couldn't fetch the data");
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
  // It needs a bigger delay, 20ms, than usual. Probably due to the complexity of the timeouts and animations interlinked all together.
  setTimeout(() => {
    promptLm.classList.add(classToAdd);
  }, 20);
  // For an element to focus it needs to be called after hidden goes away.
  // Without a timeout it adds lag to the showPromptAnimation.
  // Check if closePromptBtn is hidden else focus it.
  if (btnLm.matches('#todo-app-intro__search-btn')) {
    btnLm.focus();
  } 
  else {
    setTimeout(() => {
      addTodoPromptCloseBtn.focus();
    }, 135)
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

// Check if a timeout exists and skip clear if another button is clicked to avoid animation break
// Needs refactor for sure
function clearAllIntroBtnsTims(lastActiveTim, e) {
  for (const key in timsIntroBtns) {
    if (key !== lastActiveTim) {
      if (
        checkLastBtnTim(e, key, 'todo-app-intro__search-btn', 'addTodoTim') || 
        checkLastBtnTim(e, key, 'todo-app-intro__add-btn', 'searchTim') || 
        checkLastBtnTim(e, key, 'todo-app-intro__search-btn', 'submitPromptTim') ||
        checkLastBtnTim(e, key, 'todo-app-intro__search-btn', 'alertDialogDiscardChangesTim') || 
        checkLastBtnTim(e, key, 'todo-app-intro__search-btn', 'closeAddTodoPromptTim')
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

function isTodosLimitReached() {
  let incompletedTodosCounter = 1;
  todos.forEach(({completed}) => {
    if (!completed) {
      incompletedTodosCounter++;
    }
  });
  console.log(incompletedTodosCounter);
  if (incompletedTodosCounter > 100) {
    return 1;
  } 
  else {
    return 0;
  }
}

function resetPromptAfterLimitReached(promptLm, btnLm, activeClass, time) {
  checkActiveBtn(btnLm);
  hidePrompt(promptLm, btnLm, activeClass, 'submitPromptTim', time);
  addTodoPromptFormLm.reset();
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

function isSectionEmpty() {
  if (todosContainerLm.innerHTML === '') {
    todosContainerLm.innerHTML = `
      <div class="todos-container__img-container">
        <img class="todos-container__empty-section-image" src="img/cute-animals-drawings/croco-capybara.png" alt="Drawing of a capybara, with an orange on its head, riding another capybara that at the same time is riding a crocodile"/>
      </div>
    `;
  }
}

export function generateTodosHTML() {
  const tasksBtnLm = document.getElementById('todo-sections__tasks-btn');
  const completedBtnLm = document.getElementById('todo-sections__completed-btn');
  let generatedHTML;

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
  
  if (allBtnLm.matches('.todo-sections--active-btn')) {
    // All section HTML
    generatedHTML = todos
    .map((todo) => {
      if (todo.completed) {
        return genereateCompletedTaskHTML(todo);
      }
      return generateTaskHTML(todo);
    })
    .join('');
  } 
  else if (tasksBtnLm.matches('.todo-sections--active-btn')) {
    // Tasks section HTML
    generatedHTML = todos
    .filter((todo) => {
      return !todo.completed;
    })
    .map((todo) => generateTaskHTML(todo))
    .join('');
  } 
  else if (completedBtnLm.matches('.todo-sections--active-btn')) {
    // Completed Section HTML
    generatedHTML = todos
    .filter((todo) => {
      return todo.completed;
    })
    .map((todo) => genereateCompletedTaskHTML(todo))
    .join('');
  }

  todosContainerLm.innerHTML = generatedHTML;
  isSectionEmpty();
}

function completeTodo(targetId) {
  for (let i = 0; i < todos.length; i++) {
    if (todos[i].id === targetId) {
      const currentTodo = todos[i];
      currentTodo.completed = true;
      deleteTodo(currentTodo.id)
      addTodo('push', null, null, currentTodo)
      break;
    }
  }
}

function resetTodos() {
  todos.length = 0;
  generateTodosHTML();
  localStorage.setItem('todos', JSON.stringify(todos));
  // Hide add prompt or search prompt.
  const { addTodoPrompt, searchTodoPrompt } = introPrompts;
  removeLastActivePrompt(searchTodoPrompt);
  removeLastActivePrompt(addTodoPrompt);
}

function openConfirmDailog(confirmFunction, descText) {
  const {closeLms, confirmationLm, discardBtn} = generateConfirmDialogHTML();
  const dialogDescLm = document.getElementById('dialog__desc');
  dialogDescLm.innerText = descText;
  openModal(null, null, closeLms, discardBtn, confirmationLm, confirmFunction);
}

function clearAllTodos() {
  openConfirmDailog(resetTodos, 'Are you sure that you want to delete all tasks?')
}

allBtnLm.classList.add('todo-sections--active-btn');

generateTodosHTML();

introPrompts.addTodoPrompt.btnLm.addEventListener('click', showAddTodoPrompt);

introPrompts.searchTodoPrompt.btnLm.addEventListener('click', showSearchTodoPrompt);

clearAllTodosBtn.addEventListener('click', clearAllTodos);

addTodoPromptFormLm.addEventListener('submit', (e) => {
  e.preventDefault();
  const {promptLm, btnLm, activeClass, timeout: {time}} = introPrompts.addTodoPrompt;

  if (isTodosLimitReached()) {
    generateConfirmDialogHTML();
    initializeConfirmLimitDialog();
    const closeLm = document.getElementById('dialog__cancel-btn');
    const confirmationLm = document.getElementById('dialog__confirmation-btn');
    openModal(null, null, closeLm, closeLm, confirmationLm, resetPromptAfterLimitReached.bind(null, promptLm, btnLm, activeClass, time));
  } 
  else {
    addTodo('unshift', addTodoPromptFormLm);
    checkActiveBtn(btnLm);
    hidePrompt(promptLm, btnLm, activeClass, 'submitPromptTim', time);
    addTodoPromptFormLm.reset();
  }
});

addTodoPromptCloseBtn.addEventListener('click', () => {
  const todoData = Object.values(getFormData(addTodoPromptFormLm, true));
  if(todoData[0] || todoData[1] || todoData[2]) {
    openConfirmDailog(resetForm, 'Are you sure you want to discard all changes made in form?')
  } 
  else {
    const {btnLm, promptLm, activeClass, timeout: {time}} = introPrompts.addTodoPrompt;
    checkActiveBtn(btnLm);
    hidePrompt(promptLm, btnLm, activeClass, 'closeAddTodoPromptTim', time);
  }
});

todosSectionsContainerLm.addEventListener('click', (e) => {
  const sectionBtnLms = document.querySelectorAll('#todo-sections button');
  if (e.target.closest('#todo-sections__all-btn')) {
    // All
    changeActiveSectionBtn(sectionBtnLms, '#todo-sections__all-btn');
    generateTodosHTML();
  } 
  else if (e.target.closest('#todo-sections__tasks-btn')) {
    // Tasks
    changeActiveSectionBtn(sectionBtnLms, '#todo-sections__tasks-btn');
    generateTodosHTML();
  } 
  else if (e.target.closest('#todo-sections__completed-btn')) {
    // Completed
    changeActiveSectionBtn(sectionBtnLms, '#todo-sections__completed-btn');
    generateTodosHTML();
  }
});

// Add events listeners to todo buttons.
todosContainerLm.addEventListener('click', (e) => {
  if (e.target.closest('.todo__complete-btn')) {
    // Complete Todo.
    const targetId = e.target.closest('li').id;
    openConfirmDailog(completeTodo.bind(null, targetId), 'Are you sure that you want to complete this task?'); 
  } 
  else if (e.target.closest('.todo__edit-btn')) {
    // Edit Todo.
    const targetId = e.target.closest('li').id;
    const {closeBtn, formDialogLm, formInputs} = generateEditTodoDialogHTML();
    addTodoInfoToEditForm(targetId, formInputs);
    openModal(targetId, {formerEdit: getTodoInfo(formDialogLm)}, closeBtn, closeBtn);
  } 
  else if (e.target.closest('.todo__delete-btn')) {
    // Delete todo.
    const targetId = e.target.closest('li').id;
    openConfirmDailog(deleteTodo.bind(null, targetId), 'Are you sure that you want to delete this task?');
  }
});

refreshQuoteBtn.addEventListener('click', () => {
  getQuoteData()
    .then(data => console.log(data))
    .catch(err => console.err(err));
}); 
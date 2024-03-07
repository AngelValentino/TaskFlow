const refreshQuoteBtn = document.getElementById('quote__btn');
const addTodoPromptFormLm = document.getElementById('todo-app-prompt__form');
const addTodoPromptCloseBtn = document.getElementById('todo-app-prompt__cancel-btn');
const timsIntroBtns = {};
const todos = JSON.parse(localStorage.getItem('todos')) || [];
let todoId = JSON.parse(localStorage.getItem('todo-id')) || 0;

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

// Todo next week


/* Completed interlinked prompt animations.
  //Refactor the showPrompt and hidePrompt into togglePrompt to achieve reusability with all the todo-intro__buttons prompts.
  //Connect showAddPrompt and showSearchPrompt animations so only one prompt can be shown at once. 
*/

  // Form validation; There must be at least a title to send the form.
  // If information is added to the add todo prompt and is closed, a confirmation modal will appear to make sure if the user wants to discard the changes. This also has to work interchangeably with the search prompt, as the animations will be interlinked.
  
  // Add a form submit to get the todo data and send it to and array of objects. The maximum incompleted tasks are 100.
  /*
  {
    id: 'task-[1-100]',
    title: '',
    date: ''/null,
    description: ''/null,
    completed: true/false
  }
  */

  // Render all tasks HTML

  // Implement remove task and render HTML seamlessly


// Todo next week

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
  });
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

function getFormData(form) {
  const data = new FormData(form);
  const todoData = (Object.fromEntries(data.entries()));
  todoData.id = `task-${todoId}`;
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

introPrompts.addTodoPrompt.btnLm.addEventListener('click', showAddTodoPrompt);

introPrompts.searchTodoPrompt.btnLm.addEventListener('click', showSearchTodoPrompt);

addTodoPromptFormLm.addEventListener('submit', (e) => {
  if (addTodoPromptFormLm.checkValidity()) {
    e.preventDefault();
  }
  const {promptLm, btnLm, activeClass, timeout: {time}} = introPrompts.addTodoPrompt;
  todoId++;
  localStorage.setItem('todo-id', todoId);

  const todoData = getFormData(addTodoPromptFormLm);
  todos.push(todoData);
  console.log(todos);
  localStorage.setItem('todos', JSON.stringify(todos));

  checkActiveBtn(btnLm);
  hidePrompt(promptLm, btnLm, activeClass, 'submitPromptTim', time);
  addTodoPromptFormLm.reset();
} );

addTodoPromptCloseBtn.addEventListener('click', () => {
  const todoData = Object.values(getFormData(addTodoPromptFormLm));
  if(todoData[0] || todoData[1] || todoData[2]) {
    openModal();
  } 
  else {
    const {btnLm, promptLm, activeClass, timeout: {time}} = introPrompts.addTodoPrompt;
    checkActiveBtn(btnLm);
    hidePrompt(promptLm, btnLm, activeClass, 'closeAddTodoPromptTim', time);
  }
});

refreshQuoteBtn.addEventListener('click', () => {
  getQuoteData()
    .then(data => console.log(data))
    .catch(err => console.err(err));
}); 


// Refactor into more simpler and reusable code, maybe add event listener with openModal() and remove events with closeModal().

const dialogBackdropLm = document.getElementById('dialog-backdrop');
const closeDialogBtn = document.getElementById('alert-dialog__cancel-btn');
const confirmationBtn = document.getElementById('alert-dialog__confirmation-btn');
const discardBtn = document.getElementById('alert-dialog__discard-btn');
const alertDialogLm = document.getElementById('alert-dialog');
let lastFocusLmBeforeAlertDialog;

function openModal() {
  lastFocusLmBeforeAlertDialog = document.activeElement;
  dialogBackdropLm.style.display = 'flex';
  discardBtn.focus();
  setTimeout(() => {
    dialogBackdropLm.classList.add('alert-dialog-backdrop--active');
    alertDialogLm.classList.add('alert-dialog--active');
  });
}

function closeModal() {
  dialogBackdropLm.classList.remove('alert-dialog-backdrop--active')
  alertDialogLm.classList.remove('alert-dialog--active');
  setTimeout(() => {
    dialogBackdropLm.style.display = 'none';
  }, 250);
  lastFocusLmBeforeAlertDialog.focus();
}

function trapFocus(element) {
  const focusableLms = element.querySelectorAll('a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])');
  console.log(focusableLms);
  const firstFocusableLm = focusableLms[0]; 
  const lastFocusableLm = focusableLms[focusableLms.length - 1];

  element.addEventListener('keydown', (e) => {
    const isTabPressed = (e.key === 'Tab');
    
    if (!isTabPressed) { 
      return; 
    }

    if (e.shiftKey) /* shift + tab */ {
      if (document.activeElement === firstFocusableLm ) {
        lastFocusableLm.focus();
        e.preventDefault();
      }
    } 
    else /* tab */ {
      if (document.activeElement === lastFocusableLm) {
        firstFocusableLm.focus();
        e.preventDefault();
      }
    }
  });
}

trapFocus(alertDialogLm);

dialogBackdropLm.addEventListener('click', (e) => {
  if (!e.target.matches('.dialog-backdrop')) {
    return;
  } 
  closeModal();
});

closeDialogBtn.addEventListener('click', closeModal);

confirmationBtn.addEventListener('click', () => {
  closeModal();
  addTodoPromptFormLm.reset();
  const {promptLm, btnLm, activeClass, timeout: {time}} = introPrompts.addTodoPrompt;
  checkActiveBtn(btnLm);

  // if searchBtn is clicked and alertDialogDiscardChangesTim skip clear interval
  hidePrompt(promptLm, btnLm, activeClass, 'alertDialogDiscardChangesTim', time)

});

discardBtn.addEventListener('click', closeModal);

discardBtn.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
  }
});
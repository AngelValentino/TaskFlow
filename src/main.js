const refreshQuoteBtn = document.getElementById('quote__btn');
const timsIntroBtns = {};
let submitPromptTim;
let clicksCloseEvent = 0;
let clickSubmitEvent = 0;
const todos = JSON.parse(localStorage.getItem('todos')) || [];
let todoId = JSON.parse(localStorage.getItem('todo-id')) || 0;

const introPrompts = {
  addTodoPrompt: {
    btnLm: document.getElementById('todo-app-intro__add-btn'),
    promptLm: document.getElementById('todo-app-prompt'),
    closeBtn: document.getElementById('todo-app-prompt__cancel-btn'),
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

  if (timeoutId === 'submitPromptTim') {
    submitPromptTim = setTimeout(() => {
      promptLm.setAttribute('hidden', '');
    }, time);
    return;
  }

  timsIntroBtns[timeoutId] = setTimeout(() => {
    promptLm.setAttribute('hidden', '');
  }, time);
}

function clearAllIntroBtnsTims(lastActiveTim) {
  for (const timKey in timsIntroBtns) {
    if (timKey !== lastActiveTim) {
      clearTimeout(timsIntroBtns[timKey]);
    }
  }
}

function removeLastActivePrompt({promptLm, timeout: {lastPromptTim, time}, btnLm, activeClass}) {
  if (btnLm.matches('.btn--active')) {
    checkActiveBtn(btnLm);
    hidePrompt(promptLm, btnLm, activeClass, lastPromptTim, time);
  }
}

function togglePrompt({btnLm, promptLm, activeClass, timeout: {currentTim, time}}, {timeout: {lastPromptTim}}) {
  if (promptLm.matches('.' + activeClass)) {
    hidePrompt(promptLm, btnLm, activeClass, currentTim, time);
  } 
  else {
    clearAllIntroBtnsTims(lastPromptTim)
    showPrompt(promptLm, btnLm, activeClass);
  }
} 

function addEventToCloseBtn({closeBtn, btnLm, promptLm, activeClass, timeout: {time}}) {
  if (clicksCloseEvent === 1) {
    closeBtn.addEventListener('click', () => {
      clicksCloseEvent = 0;
      checkActiveBtn(btnLm);
      hidePrompt(promptLm, btnLm, activeClass, 'closeAddTodoPromptTim', time);
    }, {once: true});
  }
}

function getFormEntries(form) {
  const data = new FormData(form);
  return (Object.fromEntries(data.entries()));
}

// Implement a confirmational modal that checks if the user has closed the submit prompt with typed data inside.

function addEventToPromptForm({promptLm, btnLm, activeClass, timeout: {time}}) {
  if (clickSubmitEvent === 1) {
    const addTodoPromptFormLm = document.getElementById('todo-app-prompt__form');
    addTodoPromptFormLm.addEventListener('submit', (e) => {
      if (addTodoPromptFormLm.checkValidity()) {
        e.preventDefault();
      }
      clickSubmitEvent = 0;
      todoId++;
      localStorage.setItem('todo-id', todoId);

      const todoData = getFormEntries(addTodoPromptFormLm);
      todoData.id = `task-${todoId}`;
      todoData.completed = false;
      todos.push(todoData);
      console.log(todos);
      localStorage.setItem('todos', JSON.stringify(todos));

      checkActiveBtn(btnLm);
      hidePrompt(promptLm, btnLm, activeClass, 'submitPromptTim', time);
      addTodoPromptFormLm.reset();
    }, {once: true});
  }
}

function showAddTodoPrompt() {
  const { addTodoPrompt, searchTodoPrompt } = introPrompts;
  const addTodoBtnLm = addTodoPrompt.btnLm;
  
  clicksCloseEvent++;
  clickSubmitEvent++;

  checkActiveBtn(addTodoBtnLm);
  removeLastActivePrompt(searchTodoPrompt);
  addEventToCloseBtn(addTodoPrompt);
  addEventToPromptForm(addTodoPrompt);
  clearTimeout(submitPromptTim);
  togglePrompt(addTodoPrompt, searchTodoPrompt);
}

function showSearchTodoPrompt() {
  const { addTodoPrompt, searchTodoPrompt } = introPrompts;
  const searchBtnLm = searchTodoPrompt.btnLm;
  checkActiveBtn(searchBtnLm);
  removeLastActivePrompt(addTodoPrompt);
  togglePrompt(searchTodoPrompt, addTodoPrompt);
}

introPrompts.addTodoPrompt.btnLm.addEventListener('click', showAddTodoPrompt);

introPrompts.searchTodoPrompt.btnLm.addEventListener('click', showSearchTodoPrompt);

refreshQuoteBtn.addEventListener('click', () => {
  getQuoteData()
    .then(data => console.log(data))
    .catch(err => console.err(err));
}); 


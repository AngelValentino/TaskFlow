const addTodoBtnLm = document.getElementById('todo-app-intro__add-btn');
const searchTodoBtnLm = document.getElementById('todo-app-intro__search-btn');
const refreshQuoteBtn = document.getElementById('quote__btn');
const timsIntroBtns = {};
let clicks = 0;

// Todo next week

  // Refactor the showPrompt and hidePrompt into togglePrompt to achieve reusability with all the todo-intro__buttons prompts.
  // Connect showAddPrompt and showSearchPrompt animations so only one prompt can be shown at once.

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

function showPrompt(hideTmId, promptLm, btnLm) {
  clearTimeout(hideTmId);
  promptLm.removeAttribute('hidden');
  btnLm.setAttribute('aria-expanded', true);
  setTimeout(() => {
    promptLm.classList.add('todo-app-prompt--active');
  }, 0);
}

function setHideTim(timeoutId, promptLm) {
  timsIntroBtns[timeoutId] = setTimeout(() => {
    promptLm.setAttribute('hidden', '');
  }, 1500);
}

function hidePrompt(promptLm, btnLm) {
  btnLm.setAttribute('aria-expanded', false);
  promptLm.classList.remove('todo-app-prompt--active');
}

function showTodoPrompt() {
  clicks++;
  const todoAppPromptLm = document.getElementById('todo-app-prompt');
  const closePromptBtn = document.getElementById('todo-app-prompt__cancel-btn');

  checkActiveBtn(addTodoBtnLm);

  if (todoAppPromptLm.matches('.todo-app-prompt--active')) {
    setHideTim('promptHideTmId', todoAppPromptLm);
    hidePrompt(todoAppPromptLm, addTodoBtnLm);
  } 
  else {
    showPrompt(timsIntroBtns.promptHideTmId, todoAppPromptLm, addTodoBtnLm);
    clearTimeout(timsIntroBtns.promptHideTmId2);
    if (clicks === 1) {
      closePromptBtn.addEventListener('click', () => {
        clicks = 0;
        checkActiveBtn(addTodoBtnLm);
        setHideTim('promptHideTmId2', todoAppPromptLm)
        hidePrompt(todoAppPromptLm, addTodoBtnLm);
      }, {once: true});
    }
  }
}

let searchTim;

function showTodoSearchPrompt() {
  const searchTodoPromptLm = document.getElementById('search-todo-prompt');
  
  checkActiveBtn(searchTodoBtnLm)

  if (searchTodoPromptLm.matches('.search-todo-prompt--active')) {
    //close the modal
    searchTodoPromptLm.classList.remove('search-todo-prompt--active');
    searchTodoBtnLm.setAttribute('aria-expanded', false);
    searchTim = setTimeout(() => {
      searchTodoPromptLm.setAttribute('hidden', '');
    }, 1250); 

  } else {
    //open the modal
    clearTimeout(searchTim);
    searchTodoPromptLm.removeAttribute('hidden');
    searchTodoBtnLm.setAttribute('aria-expanded', true);
    setTimeout(() => {
      searchTodoPromptLm.classList.add('search-todo-prompt--active');
    });
  }
}

addTodoBtnLm.addEventListener('click', showTodoPrompt);

searchTodoBtnLm.addEventListener('click', showTodoSearchPrompt);

refreshQuoteBtn.addEventListener('click', () => {
  getQuoteData()
    .then(data => console.log(data))
    .catch(err => console.err(err));
}); 


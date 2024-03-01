const addTodoBtnLm = document.getElementById('todo-app-intro__add-btn');
const searchTodoBtnLm = document.getElementById('todo-app-intro__search-btn');
const refreshQuoteBtn = document.getElementById('quote__btn');
const timsIntroBtns = {};
let clicks = 0;

  //Add search prompt.
  //Add form validation.
  //Add clear modal.
  //Add todos data.

async function getQuoteData() {
  const response = await  fetch('/.netlify/functions/fetch-data');
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

function showTodoSearchPrompt() {
  const searchTodoPromptLm = document.getElementById('search-todo-prompt');
  
  searchTodoPromptLm.classList.toggle('search-todo-prompt--active')

  // conect animation to add todo prompt
  // add accessibility
}

addTodoBtnLm.addEventListener('click', showTodoPrompt);

searchTodoBtnLm.addEventListener('click', showTodoSearchPrompt);

refreshQuoteBtn.addEventListener('click', () => {
  getQuoteData()
    .then(data => console.log(data))
    .catch(err => console.err(err));
}); 


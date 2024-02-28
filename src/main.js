const addTodoBtnLm = document.getElementById('todo-app-intro__add-btn');
const refreshQuoteBtn = document.getElementById('quote__btn');

async function getQuoteData() {
  const response = await  fetch('/.netlify/functions/fetch-data');

  if (response.status !== 200) {
    throw new Error("Could't fetch the data");
  }

  return await response.json();
}

function checkActiveBtn(e) {
  e.currentTarget.classList.add('btn--active');
};

function uncheckActiveBtn(e) {
  console.log(e.currentTarget)
  e.currentTarget.classList.remove('btn--active');
}

function showPrompt(hideTmId, promptLm, btnLm) {
  clearTimeout(hideTmId);
  promptLm.removeAttribute('hidden');
  btnLm.setAttribute('aria-expanded', true);
  setTimeout(() => {
    promptLm.classList.add('todo-app-prompt--active');
  }, 0);
}

function hidePrompt(promptLm, btnLm) {
  promptHideTmId = setTimeout(() => {
    promptLm.setAttribute('hidden', '');
  }, 1500);
  btnLm.setAttribute('aria-expanded', false);
  promptLm.classList.remove('todo-app-prompt--active');
}

let promptHideTmId;
let promptHideTmId2;


function addTodoPrompt(e) {

  console.log(promptHideTmId, promptHideTmId2)
  const todoAppPromptLm = document.getElementById('todo-app-prompt');
  const closePromptBtn = document.getElementById('todo-app-prompt__cancel-btn');
  
  //add a click event to close icon everytime prompt button is clicked
  //hide prompt when close icon is clicked
  //remove click event when prompt is hidden

  closePromptBtn.addEventListener('click', () => {
    promptHideTmId2 = setTimeout(() => {
      todoAppPromptLm.setAttribute('hidden', '');
    }, 1500);
    closePromptBtn.setAttribute('aria-expanded', false);
    todoAppPromptLm.classList.remove('todo-app-prompt--active');

  });

  if (todoAppPromptLm.matches('.todo-app-prompt--active')) {
    hidePrompt(todoAppPromptLm, addTodoBtnLm);
    uncheckActiveBtn(e);
  } 
  else {
    showPrompt(promptHideTmId, todoAppPromptLm, addTodoBtnLm);
    checkActiveBtn(e);
    clearTimeout(promptHideTmId2);
  }
}

addTodoBtnLm.addEventListener('click', (e) => {
  addTodoPrompt(e);
});

refreshQuoteBtn.addEventListener('click', () => {
  getQuoteData()
    .then(data => console.log(data))
    .catch(err => console.err(err));
}); 


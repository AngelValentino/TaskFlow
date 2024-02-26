const addTodoBtnLm = document.getElementById('todo__intro-add-btn');
const refreshQuoteBtn = document.getElementById('quote__btn');

async function getQuoteData() {
  const response = await  fetch('/.netlify/functions/fetch-data');

  if (response.status !== 200) {
    throw new Error("Could't fetch the data");
  }

  return await response.json();
}

function addTodoPrompt() {

  //refactor this into proper code
  //close icon closes prompt
  //sbmit gets the info and closes prompt
  //form validation
  const addTodoPromptLm = document.getElementById('todo__add-todo-prompt');

  addTodoPromptLm.classList.toggle('todo__add-todo-prompt--active');

  if (addTodoPromptLm.matches('.todo__add-todo-prompt--active')) {
    addTodoPromptLm.style.maxHeight = '1000px';
    addTodoBtnLm.style.backgroundColor = "#b259b6";
    addTodoPromptLm.style.transform = 'translateY(0px)';
  } 
  else {
    addTodoPromptLm.style.maxHeight = 0;
    addTodoBtnLm.style.backgroundColor = "#593e7f";
    addTodoPromptLm.style.transform = 'translateY(-150px)';
  }
}

addTodoBtnLm.addEventListener('click', addTodoPrompt);

refreshQuoteBtn.addEventListener('click', () => {
  getQuoteData()
    .then(data => console.log(data))
    .catch(err => console.err(err));
}); 
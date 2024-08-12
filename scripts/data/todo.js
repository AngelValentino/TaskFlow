import { generateTodosHTML, getFormData, introPrompts, removeLastActivePrompt } from '../main.js';

export const todos = JSON.parse(localStorage.getItem('todos')) || [];

export function addTodo(method, form, id, todoData) {
  if (form) {
    const todoData = getFormData(form, true, id);
    todos[method](todoData);
  } 
  else {
    todos[method](todoData);
  }
  generateTodosHTML(todos);
  localStorage.setItem('todos', JSON.stringify(todos));
}

export function deleteTodo(targetId) {
  todos.forEach(todo => {
    if (todo.id === targetId) {
      todos.splice(todos.indexOf(todo), 1);
    }
  })
  generateTodosHTML(todos);
  localStorage.setItem('todos', JSON.stringify(todos));
}

export function completeTodo(targetId) {
  for (let i = 0; i < todos.length; i++) {
    if (todos[i].id === targetId) {
      const currentTodo = todos[i];
      currentTodo.completed = true;
      deleteTodo(currentTodo.id);
      addTodo('push', null, null, currentTodo);
      break;
    }
  }
}

export function resetTodos() {
  todos.length = 0;
  // Hide add prompt or search prompt.
  const { addTodoPrompt, searchTodoPrompt } = introPrompts;
  removeLastActivePrompt(searchTodoPrompt);
  removeLastActivePrompt(addTodoPrompt);
  // Generate HTML
  generateTodosHTML(todos);
  localStorage.setItem('todos', JSON.stringify(todos));
}

// Checks if a todo includes a specific value and returns the new array.
export const filterTodos = (todos, input) => todos.filter(todo => todo.task.toLowerCase().includes(input.value.trim().toLowerCase()));

export function countIncompletedTodos() {
  let incompletedTodosCounter = 0;
  todos.forEach(({completed}) => {
    if (!completed) {
      incompletedTodosCounter++;
    }
  });
  return incompletedTodosCounter;
}

export function isTodosLimitReached() {
  const incompletedTodosCounter = countIncompletedTodos();
  // The code checks the todos count before generating the first one, it's needed for the submit limit validation. So we have to check if it is equal to 100 because it will begin with 0 when we already have one task. If we wouldnt't do that the limit will go up to 101, not 100.
  if (incompletedTodosCounter >= 100) {
    return 1;
  } 
  else {
    return 0;
  }
}
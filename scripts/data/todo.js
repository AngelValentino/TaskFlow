import { generateTodosHTML } from '../main.js';
import { getFormData } from '../utils.js';

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
  generateTodosHTML(todos);
  localStorage.setItem('todos', JSON.stringify(todos));
}

// Checks if a todo includes a specific value and returns the new array.
export const filterTodos = (todos, input) => todos.filter(todo => todo.task.toLowerCase().includes(input.value.trim().toLowerCase()));

export function countIncompletedTodos() {
  let incompletedTodosCounter = 0;
  todos.forEach(({ completed }) => {
    if (!completed) {
      incompletedTodosCounter++;
    }
  });
  return incompletedTodosCounter;
}

export function isTodosLimitReached() {
  const incompletedTodosCounter = countIncompletedTodos();
  if (incompletedTodosCounter >= 100) {
    return 1;
  } 
  else {
    return 0;
  }
}
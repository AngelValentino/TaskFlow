import { generateTodosHTML, getFormData } from '../main.js';

export const todos = JSON.parse(localStorage.getItem('todos')) || [];

export function addTodo(method, form) {
  const todoData = getFormData(form);
  todos[method](todoData);
  localStorage.setItem('todos', JSON.stringify(todos));
  generateTodosHTML();
}

export function deleteTodo(targetId) {
  todos.forEach((todo) => {
    if (todo.id === targetId) {
      todos.splice(todos.indexOf(todo), 1);
    }
  })
  generateTodosHTML();
  localStorage.setItem('todos', JSON.stringify(todos));
}
import { generateTodosHTML } from '../main.js';
import { getFormData } from '../utils.js';

// Retrieve todos from localStorage, or initialize with an empty array if not found
export const todos = JSON.parse(localStorage.getItem('todos')) || [];

function updateTodos(data, key) {
  generateTodosHTML(data);
  localStorage.setItem(key, JSON.stringify(data));
}

export function addTodo(method, form, id, todoData) {
  // If a form is provided, extract data from the form
  if (form) {
    // Get todo data from the form and add it to the todos array using the specified method
    const formData = getFormData(form, true, id);
    todos[method](formData);
  } 
  else {
    // Directly add the provided todo data to the todos array
    todos[method](todoData);
  }

  // Update the UI and save the updated todos array to localStorage
  updateTodos(todos, 'todos');
}

export function deleteTodo(targetId) {
  // Find the index of the todo with the matching id
  const index = todos.findIndex(todo => todo.id === targetId);
  
  // If the todo was found, remove it from the array
  if (index !== -1) {
    todos.splice(index, 1);
    // Update the UI and save the updated todos array to localStorage
    updateTodos(todos, 'todos');
  } 
  else {
    // Log a warning if the todo was not found
    console.warn(`Todo with id ${targetId} not found.`);
  }
}

export function completeTodo(targetId) {
  // Find the index of the todo with the matching id
  const index = todos.findIndex(todo => todo.id === targetId);

  // If the todo was found, update its completed status
  if (index !== -1) {
    // Remove the todo from its current position and get the removed item
    const [completedTodo] = todos.splice(index, 1);
    // Update its completed status
    completedTodo.completed = true;
    // Add the updated todo to the end of the array
    addTodo('push', null, null, completedTodo);
  } 
  else {
    // Log a warning if the todo was not found
    console.warn(`Todo with id ${targetId} not found.`);
  }
}

// Clears all todos
export function resetTodos() {
  // Empty todos Array
  todos.length = 0;
  // Update the UI and save the updated todos array to localStorage
  updateTodos(todos, 'todos');
}

/* Filters todos based on whether their task property includes the input value and
returns a new array of todos matching the filter criteria */
export const filterTodos = (todos, input) => todos.filter(todo => todo.task.toLowerCase().includes(input.value.trim().toLowerCase()));

// Counts the number of incomplete todos
export function countIncompletedTodos() {
  let incompletedTodosCounter = 0;

  // Iterate over todos and count those that are not completed
  todos.forEach(({ completed }) => {
    if (!completed) {
      incompletedTodosCounter++;
    }
  });

  return incompletedTodosCounter;
}

// Checks if the limit of incomplete todos has been reached
export function isTodosLimitReached() {
  const incompletedTodosCounter = countIncompletedTodos();
  return incompletedTodosCounter >= 100;
}
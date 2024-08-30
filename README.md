# [TaskFlow](https://taskflow1.pages.dev/)

TaskFlow is your go-to app for **effortless productivity**. Easily manage tasks, set reminders, and track your progress. All with a clean, **user-friendly** design that helps you stay organized and focused.

> It has been developed using **HTML/CSS** and vanilla **JavaScript**, utilizing the **LocalStorage API** for persistent data storage.

![TaskFlow App screenshot](https://i.imgur.com/rVwrHhZ.jpeg)


## Table of Contents



* [Todo App Functionality](#todo-app-functionality)
  * [`toggleModalEvents()`](#togglemodalevents)
  * [Add Task](#add-task)
  * [Search Task](#search-task)
  * [Edit Task](#edit-task)
  * [Complete Task](#complete-task)
  * [Delete Task](#delete-task)

* [Quote Machine and Background Image Fade Logic](#quote-machine-and-background-image-fade-logic)
  * [Quote Machine](#quote-machine)
  * [Dynamic Background Image Fade](#dynamic-background-image-fade)

* [Pomodoro Timer](#pomodor-timer)

* [Future Improvements](#future-improvements)


## Todo App Functionality

The application includes a fully implemented todo system the with ability to **add**, **edit**, **complete**, **delete** and **search** tasks.

>All functionalities reuse the **`toggleModalEvents()`** and **`toggeModalFocus()`** functions to open their respective modals, with all the necessary **accessible features**. Such as **closing with the 'Escape' key**, **overlay click**, and **focus trapping**. [see more](https://github.com/AngelValentino/TaskFlow/blob/main/scripts/utils.js)


### `toggleModalEvents()`

```js
// Toggle modal events (add or remove event listeners)
export function toggleModalEvents(eventsHandler, action, closeFun, closeLms, modalContentLm, modalContainerLm, matchingClass) {
  // Helper function to add event listeners
  function addEventListeners() {
    // Create bound event handler functions
    const escKeyHandler = handleModalCloseAtEscapeKey(closeFun, matchingClass);
    const outsideClickHandler = handleModalOutsideClick(closeFun, matchingClass);
    const trapFocusHandler = handleTrapFocus(modalContentLm);

    // Add event listeners if elements exist
    document.body.addEventListener('keydown', escKeyHandler);
    modalContentLm?.addEventListener('keydown', trapFocusHandler);
    modalContainerLm?.addEventListener('click', outsideClickHandler);

    // Add close function to specified element(s)
    if (closeLms) {
      // An array of elements
      if (Array.isArray(closeLms)) {
        closeLms.forEach(closeLm => {
          closeLm.addEventListener('click', closeFun);
        });
      } 
      // Only one element
      else {
        closeLms.addEventListener('click', closeFun);
      }
    }

    // Store handlers on the eventsHandler object to remove them later
    eventsHandler.escKeyHandler = escKeyHandler;
    modalContentLm && (eventsHandler.trapFocusHandler = trapFocusHandler);
    modalContainerLm && (eventsHandler.outsideClickHandler = outsideClickHandler);
    closeLms && (eventsHandler.closeFun = closeFun);
  }

  // Helper function to remove event listeners
  function removeEventListeners() {
    // Remove event listeners if elements exist
    document.body.removeEventListener('keydown', eventsHandler.escKeyHandler);
    modalContentLm?.removeEventListener('keydown', eventsHandler.trapFocusHandler);
    modalContainerLm?.removeEventListener('click', eventsHandler.outsideClickHandler);

    if (closeLms) {
      // An array of elements
      if (Array.isArray(closeLms)) {
        closeLms.forEach(closeLm => {
          closeLm.removeEventListener('click', eventsHandler.closeFun);
        });
      } 
      // Only one element
      else {
        closeLms.removeEventListener('click', eventsHandler.closeFun);
      }
    }

    // Clean up stored handlers
    delete eventsHandler.escKeyHandler;
    modalContentLm && delete eventsHandler.trapFocusHandler;
    modalContainerLm && delete eventsHandler.outsideClickHandler;
    closeLms && delete eventsHandler.closeFun;
  }

  if (action === 'add') {
    addEventListeners();
  } 
  else if (action === 'remove') {
    removeEventListeners();
  }
}
```

### Add Task

```js
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
```

![Task Flow Todo system add task functionality](https://i.imgur.com/eXI1TqH.jpeg)

### Search Task

```js
/* Filters todos based on whether their task property includes the input value and
returns a new array of todos matching the filter criteria */
export const filterTodos = (todos, input) => todos.filter(todo => todo.task.toLowerCase().includes(input.value.trim().toLowerCase()));
```

![Task Flow Todo system search task functionality](https://i.imgur.com/LeXsqKj.jpeg)

![Task Flow Todo system search task functionality, no todos have been found](https://i.imgur.com/X5BdGji.jpeg)

### Edit Task

```js
  // Handle form submission and edit todo
  function editTodo(e) {
    e.preventDefault(); // Prevent default form submission

    // If the form has been edited, update the todo item
    if (isFormEdited()) {
      deleteTodo(targetId); // Delete the existing todo
      addTodo('unshift', editDialogFormLm, targetId); // Add the updated todo
      closeEditDialog(); // Close the edit dialog
      // Focus on the edit button after re-adding the todo
      const editTodoBtn = document.getElementById(`todo__edit-btn-${targetId}`);
      editTodoBtn.focus();
    } 
    // If the form has not been edited, just close the edit dialog
    else {
      closeEditDialog();
    }
  }
```

![Task Flow Todo system edit task functionality](https://i.imgur.com/4MAayBX.jpeg)

### Complete Task

```js
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
```

![Task Flow Todo system complete task confirmational modal dialog](https://i.imgur.com/YytDhyp.jpeg)

![Task Flow Todo system completed task](https://i.imgur.com/fAxbII2.jpeg)

### Delete Task

```js
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

// Clears all todos
export function resetTodos() {
  // Empty todos Array
  todos.length = 0;
  // Update the UI and save the updated todos array to localStorage
  updateTodos(todos, 'todos');
}

```

![Task Flow Todo system delete task comfirmational modal dialog](https://i.imgur.com/Hd4Kpay.jpeg)

![Task Flow Todo system delete all tasks confirmational modal dialog](https://i.imgur.com/iAv8In9.jpeg)


## Quote Machine and Background Image Fade Logic

Developed a **quote generator** that **fetches** quotes from an **API** if they are not available in the **cache**, displaying them on the webpage with **social media sharing options**. Additionally, implemented a **dynamic background image change** and **color transition** each time a new quote is displayed or the page is reloaded.

```js
// Event listener for DOMContentLoaded to ensure the DOM is fully loaded before manipulating it
document.addEventListener('DOMContentLoaded', () => {
  // Get references to loader elements
  const bouncerLoaderContainerLm = document.getElementById('bouncer-container');
  const bouncerLoaderLm = document.getElementById('bouncer-loader');
  
  // Hide the loader by setting its opacity to 0
  bouncerLoaderContainerLm.style.backgroundColor = 'transparent'
  bouncerLoaderLm.style.opacity = 0;

  // Set loader dispay to none
  setTimeout(() => {
    bouncerLoaderContainerLm.style.display = 'none';
  }, 500)

  // Load the initial quote and set a random background theme
  loadQuote();
  initBgTimId = setRandomTheme();
});

// Event listener to refresh quote and change theme when the new quote button is clicked
updateQuoteBtn.addEventListener('click', () => {
  if (isAddTodoFormEdited()) return; // if add todo prompt has data return
  // Remove event lstener from the last background image just in case js garbage collector doesn't work as intended
  lastPreloadedImg.removeEventListener('load', preloadBgImgEventHandler.loadBgImgHandler);
  // Fade out the current background image
  backgroundImgLm.style.opacity = 0;
  
  // Clear any existing timeouts for changing the background theme
  clearTimeout(timBgId);
  clearTimeout(initBgTimId);

  timBgId = setRandomTheme(1050); // Changes background theme with delay
  quotesData && setQuote(quotesData, lastQuoteIndex); // Update the quote if quote data exists
}); 
```

### Quote Machine

*\*Quote Machine small code snippet*, [see more](https://github.com/AngelValentino/TaskFlow/blob/main/scripts/quote.js).
```js
// Check if quotes data is available and set a quote
export function loadQuote() {
  if (!quotesData) {
    // If quotes cache is not found, fetch quotes from an API
    getQuoteData()
      .then(data =>{
        // Cache the fetched quotes data locally
        setQuoteCache(data.quotes);
        // Set and display a quote on the page
        setQuote(quotesData, lastQuoteIndex);
      })
      .catch(err => {
        // If there's an error, display an error message
        quoteTextLm.innerHTML = `<p>Couldn't fetch the quote data.</p>`;
        console.error(err);
      })
      .finally(() => {
        // Remove the loading class from the quote text element
        quoteTextLm.classList.remove('load-quote');
      });
  } 
  else {
    // If quotes data is found in cache, directly set and display a quote
    setQuote(quotesData, lastQuoteIndex);
  }
}

```

![TaskFlow quote machine](https://i.imgur.com/e6XCDGh.jpeg)

### Dynamic Background Image Fade

*\*Bakground image fade small code snippet, [see more](https://github.com/AngelValentino/TaskFlow/blob/main/scripts/data/themes.js).*
```js
// Set a random theme with an optional delay
export function setRandomTheme(time = 0) {
  const currentIndex = getRandomIndex(themes, lastThemeIndex); // Get a random theme index, avoiding repetition
  const currentRandomTheme = themes[currentIndex]; // Get the theme data with the random index
  const timBgId = loadBgImgProgressively(currentRandomTheme, time); // Load background image with optional timeot
  lastThemeIndex = currentIndex;  // Update the last used theme index
  
  return timBgId; // Return the timeout ID
}
```

![TaskFlow dynamic background image fade functionality](https://i.imgur.com/k9WxWve.jpeg)


## Pomodor Timer

Implemented a fully functional Pomodoro timer with **work** and **break** intervals. The timer alternates between **25 minutes** of work and **5 minutes** of rest. It also includes a **reset button** and **audible notifications**.

*\*Timer class component small code snippet, [see more](https://github.com/AngelValentino/TaskFlow/blob/main/scripts/Timer.js).*

```js
// Initialize the timer component
const timerLm = document.getElementById('timer');
new Timer(timerLm);
```

![TaskFlow pomodor timer](https://i.imgur.com/C8GcvNf.jpeg)

## Future Improvements

- **Minify** and **optimize** JavaScript and CSS files using **webpack** and **Babel**.

- Configure a **server** using **PHP** and **SQL** to **fetch**, **store**, **edit**, **delete**, **complete**, and **search** user data. This setup will offer users the choice to log in and use their data or remain anonymous and use the LocalStorage API.

- Add **user authentication** with **PHP**.

- Introduce user **configuration options** such as **delete account**, **edit avatar** (including cropping an image) or **recover password** via **Gmail**.

- Implement a **theme picker**.

- Add **ambient music** with the option to connect to a music streaming platform.

- **Enhance** the **pomodoro timer** by Adding a tree that grows while the timer is running and allowing users to **edit time** periods.

- Add a **forest cube** displaying all the user trees using **'Three.js'**.
// Keeps a reference of the preloaded images to prevent the browser from sending them to the garbage collector
const preloadImgs = [];

// Formats the provided Date object to an 'en-US' long-form string and ISO 8601 standard format
export const formatDate = dateInput => {
  // Check if the input is a string (assumed to be an ISO date string)
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;

  // Format the date in "en-US" long-form
  const longFormat = date.toLocaleDateString('en-US', { dateStyle: 'long' }); // e.g., "January 1, 2024"
  // // Format the date in ISO 8601 format "YYYY-MM-DD"
  // const isoFormat = date.toISOString().split('T')[0]; // e.g., "2024-01-01"

  return { longFormat };
};

// Returns a random index from the array that is not equal to the lastIndex
export function getRandomIndex(arr, lastIndex) {
  // Generate a random index between 0 and arr.length - 1
  const randomIndex = Math.floor(Math.random() * arr.length);

  if (randomIndex !== lastIndex) {
    // If the random index is different from the last index, return it
    return randomIndex;
  } 
  else {
     // Otherwise, recursively call the function until a different index is found
    return getRandomIndex(arr, lastIndex);
  }
}

// Generates a random integer between the specified min and max value
export const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

// Preloads a single image by creating a new Image object and setting its src
function preloadImage(imgUrl) {
  const img = new Image();
  img.src = imgUrl;
  preloadImgs.push(img);
}

// Preloads a specific set of images fro Dialog and todos placeholder
export function preloadDialogImages() {
  // Preload specific animal images
  preloadImage('images/cute-animals-drawings/croco-capybara.png');
  preloadImage('images/cute-animals-drawings/croco-capybara-todos.png');
  preloadImage('images/cute-animals-drawings/capybara.jpg');
  
  // Preload a series of recycling icons
  for (let i = 1; i <= 6; i++) {
    preloadImage(`images/recycle-icons/garbage-collector-${i}.jpg`);
  }
}

// Toggles focus between modal elements to trap focus within the modal
export function toggleModalFocus(focusBehaviour, firstFocusableLm, lastFocusedLm) {
  if (focusBehaviour === 'add') {
    // Save the currently focused element
    const lastFocusedLm = document.activeElement;
    // Focus on the first focusable element in the modal
    firstFocusableLm.focus();
    // Return the last focused element for later use
    return lastFocusedLm;
  } 
  else if (focusBehaviour === 'return') {
    // Restore focus to the last focused element before the modal was opened
    lastFocusedLm.focus();
  }
}

// Traps focus within a specified element
export function trapFocus(e, element) {
  // Select all focusable elements within the given element
  const focusableLms = element.querySelectorAll('a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])');
  // Get the first and last focusable elements
  const firstFocusableLm = focusableLms[0]; 
  const lastFocusableLm = focusableLms[focusableLms.length - 1];

  // Check if the Tab key was pressed
  const isTabPressed = (e.key === 'Tab');
  
  // Exit if the Tab key was not pressed
  if (!isTabPressed) { 
    return; 
  }

  if (e.shiftKey) /* shift + tab */ {
    if (document.activeElement === firstFocusableLm ) {
      // If 'Shift + Tab' is pressed and focus is on the first element, move focus to the last element
      lastFocusableLm.focus();
      e.preventDefault();
    }
  } 
  else /* tab */ {
    if (document.activeElement === lastFocusableLm) {
      // If Tab is pressed and focus is on the last element, move focus to the first element
      firstFocusableLm.focus();
      e.preventDefault();
    }
  }
}

// Event handler function for closing modal on Escape key
const handleModalCloseAtEscapeKey = (closeFun, matchingClass) => e => {
  // Prevent closing if Escape is pressed and certain conditions are met
  if (
    e.key === 'Escape' && 
    (matchingClass === '.add-todo-prompt' || matchingClass === '.search-todo-prompt') && 
    document.body.style.overflow === 'hidden'
  ) return;

  // Close the modal if Escape is pressed
  if (e.key === 'Escape') closeFun();
};

// Helper functions for handleModalOutsideClick
function isDialogClosed(e) {
  return (
    !e.target.closest('.confirm-dialog-container') &&
    !e.target.closest('.info-dialog-container') &&
    !e.target.closest('.edit-dialog-container')
  );
}

function isOutsideClickPrompt(e, btnClass) {
  return (
    (!e.target.closest('.todo-app') && isDialogClosed(e)) ||
    e.target.closest('.' + btnClass)
  )
}

// Event handler function for closing modal on outside click
const handleModalOutsideClick = (closeFun, matchingClass) => e => {
  if (matchingClass === '.add-todo-prompt') {
    /* Close add todo prompt if target is search button or it is outside the prompt and dialog is closed */
    if (isOutsideClickPrompt(e, 'todo-app-intro__search-btn')) {
      closeFun();
    }
  } 
  else if (matchingClass === '.search-todo-prompt') {
    /* Close search todo prompt if target is search button or it is outside the prompt and dialog is closed */
    if (isOutsideClickPrompt(e, 'todo-app-intro__add-btn')) {
      closeFun();
    }
  } 
  else if (e.target.matches(matchingClass)){
    // Close modal if the clicked element matches the 'matchingClass'
    closeFun();
  }
};

// Event handler function for trapping focus within the modal content
const handleTrapFocus = modalContentLm => e => {
  trapFocus(e, modalContentLm);
}

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

export function highlighter(text, highlight, isCompleted) {
  // If highlight is empty or only whitespace, return the original text
  if (!highlight.trim()) return text;

  // Create a regular expression to match occurrences of the 'highlight' string, ignoring case
  const regex = new RegExp(`(${highlight.trim()})`, 'gi');
  
  // Split the text into parts based on the regular expression also including the regex split 
  // value thanks to using a capture group '()'
  const parts = text.split(regex);

  // Map through the parts, wrapping highlighted parts in a span with a specific class
  return parts.map(part => {
    if (regex.test(part)) {
      // If the part matches the highlight, wrap it in a span
      return `<span class="${isCompleted ? 'highlighted-2' : 'highlighted'}">${part}</span>`;
    } 
    else {
      // Otherwise, return the part as is
      return part;
    }
  }).join(''); // Join the parts back into a single string
}

export function setActiveBtn(btnLm) {
  if (btnLm.getAttribute('aria-expanded') === 'false') {
    // If 'aria-expanded' attribute does not exist add the 'btn--active' class to the button
    btnLm.classList.add('btn--active');
    btnLm.setAttribute('aria-expanded', true);
  } 
  else {  
    // If 'aria-expanded' attribute exists, remove the 'btn--active' class from the button
    btnLm.classList.remove('btn--active');
    btnLm.setAttribute('aria-expanded', false);
  }
}

// Gather and format data from a form
export function getFormData(form, initData, id) {
  // Initialize an empty object to store the form data
  const todoData = {};
  // Select all input and textarea elements within the form
  const allFormInputs = [...form.querySelectorAll('input, textarea')];
  
  // Iterate over each form input element
  allFormInputs.forEach(input => {
    // Trim whitespace from the input value and assign it to the todoData object
    todoData[input.name] = input.value.trim();
  });

  if (initData) {
    // Check if an id is provided
    if (id) {
      // Assign the provided id to the todoData object instead of setting a new one
      todoData.id = id;
    } 
    else {
      // If no id is provided, generate a new unique id based on the current timestamp
      todoData.id = `task-${Date.now()}`;
    }

    // Set the default completion status to false
    todoData.completed = false;
  }

  
  // Return the populated todoData object
  return todoData;
}

export function playSound(audio) {
  audio.currentTime = 0; // Reset to the start
  audio.play().catch(error => {
    console.error('Playback error:', error);
  });
}

export function stopSound(audio) {
  audio.pause();
  audio.currentTime = 0;
}

export function isSoundPlaying(audio) {
  return !audio.paused && audio.currentTime > 0;
}
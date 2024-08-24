export const formatCurrentDate = date => date.toLocaleDateString('en-US', { dateStyle: 'long' });

export const formatDate = date => date.split('-').reverse().join('-');

export function getRandomIndex(arr, lastIndex) {
  const randomIndex = Math.floor(Math.random() * arr.length);
  if (randomIndex !== lastIndex) {
    return randomIndex;
  } 
  else {
    return getRandomIndex(arr, lastIndex);
  }
}

export const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

// Keeps a reference of the preloaded images to prevent the browser from sending them to the garbage collector
const preloadImgs = [];

function preloadImage(imgUrl) {
  const img = new Image();
  img.src = imgUrl;
  preloadImgs.push(img);
}

export function preloadDialogImages() {
  preloadImage('images/cute-animals-drawings/croco-capybara.png');
  preloadImage('images/cute-animals-drawings/croco-capybara-todos.png');
  preloadImage('images/cute-animals-drawings/capybara.jpg');
  for (let i = 1; i <= 6; i++) {
    preloadImage(`images/recycle-icons/garbage-collector-${i}.jpg`);
  }
}

export function toggleModalFocus(focusBehaviour, firstFocusableLm, lastFocusedLm) {
  if (focusBehaviour === 'add') {
    const lastFocusedLm = document.activeElement;
    firstFocusableLm.focus();
    return lastFocusedLm;
  } 
  else if (focusBehaviour === 'return') {
    lastFocusedLm.focus();
  }
}

export function trapFocus(e, element) {
  const focusableLms = element.querySelectorAll('a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])');
  const firstFocusableLm = focusableLms[0]; 
  const lastFocusableLm = focusableLms[focusableLms.length - 1];

  const isTabPressed = (e.key === 'Tab');
  
  if (!isTabPressed) { 
    return; 
  }

  if (e.shiftKey) /* shift + tab */ {
    if (document.activeElement === firstFocusableLm ) {
      lastFocusableLm.focus();
      e.preventDefault();
    }
  } 
  else /* tab */ {
    if (document.activeElement === lastFocusableLm) {
      firstFocusableLm.focus();
      e.preventDefault();
    }
  }
}

// Event handler function for closing modal on Escape key
const handleModalCloseAtEscapeKey = (closeFun, matchingClass) => e => {
  if (
    e.key === 'Escape' && 
    matchingClass === '.add-todo-prompt' && 
    document.body.style.overflow === 'hidden'
  ) return;
  
  if (e.key === 'Escape') closeFun();
};

// Event handler function for closing modal on outside click
const handleModalOutsideClick = (closeFun, matchingClass) => e => {
  if (matchingClass === '.add-todo-prompt') {
    if (
      !e.target.closest(matchingClass) && 
      !e.target.closest('.todo-app-intro__add-btn') && 
      !e.target.closest('.confirm-dialog-container') && 
      !e.target.closest('.info-dialog-container')
    ) {
      closeFun();
    }
  } 
  else if (matchingClass === '.search-todo-prompt') {
    if (
      !e.target.closest(matchingClass) && 
      !e.target.closest('.todo-app-intro__search-btn') && 
      !e.target.closest('.todo-sections')
    ) {
      closeFun();
    }
  } 
  else if (e.target.matches(matchingClass)){
    closeFun();
  }
};

// Event handler function for trapping focus within the modal content
const handleTrapFocus = modalContentLm => e => {
  trapFocus(e, modalContentLm);
  console.log('trap focus')
}

// Toggle modal events (add or remove event listeners)
export function toggleModalEvents(eventsHandler, action, closeFun, closeLms, modalContentLm, modalContainerLm, matchingClass) {
  // Create bound event handler functions
  function addEventListeners() {
    const escKeyHandler = handleModalCloseAtEscapeKey(closeFun, matchingClass);
    const outsideClickHandler = handleModalOutsideClick(closeFun, matchingClass);
    const trapFocusHandler = handleTrapFocus(modalContentLm);

    // Add event listeners if elements exist
    document.body.addEventListener('keydown', escKeyHandler);
    modalContentLm?.addEventListener('keydown', trapFocusHandler);
    modalContainerLm?.addEventListener('click', outsideClickHandler);

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
  
  // Split the text into parts based on the regular expression
  const parts = text.split(regex);

  // Map through the parts, wrapping highlighted parts in a span with a specific class
  return parts.map((part) => {
    if (regex.test(part)) {
      // If the part matches the highlight, wrap it in a span
      return `<span class="${isCompleted ? 'highlighted-2' : 'highlighted'}">${part}</span>`;
    } else {
      // Otherwise, return the part as is
      return part;
    }
  }).join(''); // Join the parts back into a single string
}

export function setActiveBtn(btnLm) {
  // Check if the button's 'aria-expanded' attribute is set to 'false'
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

export function getFormData(form, formatDateBoolean, id) {
  const todoData = {};
  const allFormInputs = [...form.querySelectorAll('input, textarea')];
  
  allFormInputs.forEach(input => {
    if (input.name === 'date' && formatDateBoolean) {
      todoData[input.name] = formatDate(input.value);
    }   
    else {
      todoData[input.name] = input.value.trim();
    }
  });

  if (id) {
    todoData.id = id;
  } 
  else {
    todoData.id = `task-${Date.now()}`;
  }

  todoData.completed = false;
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
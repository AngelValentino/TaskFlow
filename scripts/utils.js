let lastFocusedLmBeforeModalOpened;

export const getRandomIndex = (arr) => Math.floor(Math.random() * arr.length);

export const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

// Keeps a reference of the preloaded images to prevent the browser from sending them to the garbage collector.
const preloadImgs = [];

function preloadImage(imgUrl) {
  const img = new Image();
  img.src = imgUrl;
  preloadImgs.push(img);
}

export function preloadDialogImages() {
  preloadImage('img/cute-animals-drawings/croco-capybara.png');
  preloadImage('img/cute-animals-drawings/croco-capybara-todos.png');
  preloadImage('img/cute-animals-drawings/capybara.jpg');
  for (let i = 1; i <= 6; i++) {
    preloadImage(`img/recycle-icons/garbage-collector-${i}.jpg`);
  }
}

export function toggleModalFocus(focusBehaviour, firstFocusableLm) {
  if (focusBehaviour === 'addFocus') {
    lastFocusedLmBeforeModalOpened = document.activeElement;
    firstFocusableLm.focus();
  } 
  else if (focusBehaviour === 'returnFocus') {
    lastFocusedLmBeforeModalOpened.focus();
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
export default class ModalHandler {
  constructor() {
    this.eventsHandler = {};
  }

  setActiveBtn(btnLm) {
    if (btnLm.getAttribute('aria-expanded') === 'false') {
      btnLm.classList.add('btn--active');
      btnLm.setAttribute('aria-expanded', true);
    } 
    else {  
      btnLm.classList.remove('btn--active');
      btnLm.setAttribute('aria-expanded', false);
    }
  }

  toggleModalFocus(focusBehaviour, firstFocusableLm, lastFocusedLm) {
    if (focusBehaviour === 'add') {
      // Save the currently focused element
      const lastFocusedLm = document.activeElement;
      firstFocusableLm.focus();
      return lastFocusedLm;
    } 
    else if (focusBehaviour === 'return') {
      // Restore focus to the last focused element before the modal was opened
      lastFocusedLm.focus();
    }
  }

  trapFocus(e, element) {
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

  handleTrapFocus(modalLm) {
    return e => {
      console.warn('trap focus');
      this.trapFocus(e, modalLm);
    }
  }

  handleEscapeKeyClose(closeHandler) {
    return e => {
      if (e.key === 'Escape') {
        console.warn('close at escape key');
        closeHandler();
      }
    }
  }

  handleOutsideClickClose(closeHandler, className) {
    return e => {
      if (e.target.matches(className)) {
        console.warn('close at outside click');
        closeHandler();
      }
    }
  }

  addModalEvents(eventHandlerKey, className, modalContainerLm, modalLm, closeLms, closeHandler) {
    const escapeKeyHandler = this.handleEscapeKeyClose(closeHandler);
    const outsideClickHandler = this.handleOutsideClickClose(closeHandler, className);
    const trapFocusHandler = this.handleTrapFocus(modalLm);
  
    // Add accessible functionality
    document.body.addEventListener('keydown', escapeKeyHandler);
    modalContainerLm?.addEventListener('click', outsideClickHandler);
    modalLm?.addEventListener('keydown', trapFocusHandler);
  
    // Add close function to specified element(s)
    if (closeLms && Array.isArray(closeLms)) {
      closeLms.forEach(closeLm => {
        closeLm.addEventListener('click', closeHandler);
      });
    }
    
    if (!this.eventsHandler[eventHandlerKey]) {
      this.eventsHandler[eventHandlerKey] = {};
    };
    const eventsHandler = this.eventsHandler[eventHandlerKey];

    // Store event handlers references in the eventsHandler object to remove them later
    eventsHandler.escapeKeyHandler = escapeKeyHandler;
    modalContainerLm && (eventsHandler.outsideClickHandler = outsideClickHandler);
    modalLm && (eventsHandler.trapFocusHandler = trapFocusHandler);
    closeLms && (eventsHandler.closeHandler = closeHandler);

    console.log('event listeners added');
  }

  removeModalEvents(eventHandlerKey, modalContainerLm, modalLm, closeLms) {
    const eventsHandler = this.eventsHandler[eventHandlerKey];
    
    // Remove event listeners from elements
    document.body.removeEventListener('keydown', eventsHandler.escapeKeyHandler);
    modalContainerLm?.removeEventListener('click', eventsHandler.outsideClickHandler);
    modalLm?.removeEventListener('keydown', eventsHandler.trapFocusHandler);

    if (closeLms && Array.isArray(closeLms)) {
      closeLms.forEach(closeLm => {
        closeLm.removeEventListener('click', eventsHandler.closeHandler);
      });
    }

    // Clean up stored handlers
    delete eventsHandler.escKeyHandler;
    modalLm && delete eventsHandler.trapFocusHandler;
    modalContainerLm && delete eventsHandler.outsideClickHandler;
    closeLms && delete eventsHandler.closeHandler;

    console.log('event listeners removed');
  }
}
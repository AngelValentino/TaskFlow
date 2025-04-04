export default class ModalHandler {
  constructor() {
    if (ModalHandler.instance) return ModalHandler.instance; // Prevents multiple instances
    this.eventsHandler = {};
    ModalHandler.instance = this; // Store the instance
  }

  toggleModalFocus(focusBehaviour, firstFocusableLm, lastFocusedLm) {
    if (focusBehaviour === 'add') {
      const storedLastFocusedLm = lastFocusedLm ? lastFocusedLm : document.activeElement
      firstFocusableLm.focus();
      return storedLastFocusedLm;
    } 
    else if (focusBehaviour === 'return') {
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

  handleEscapeKeyClose(closeHandler, className) {
    return e => {
      if (
        e.key === 'Escape' && 
        (className === '.task-manager__add-prompt' || className === '.task-manager__search-prompt') && 
        document.body.style.overflow === 'hidden'
      ) {
        return; // Prevents closing add or search task prompts at escape if a modal has been opened
      }

      if (e.key === 'Escape') {
        console.warn('close at escape key');
        closeHandler();
      }
    }
  }

  isModalClosed(e) {
    // We cannot check for the document overflow directly because the close modal at overlay click 
    // function is triggered before the prompt one, causing the body overflow to be not hidden 
    // and the prompt to close automatically immediately after the modal was closed.
    // To prevent this, We can check if the modal container is still visible. This is possible because 
    // the modal has a 250ms timeout, giving us a small window to verify its visibility before it disappears.
    return (
      !e.target.closest('.confirm-modal-container') &&
      !e.target.closest('.info-modal-container') &&
      !e.target.closest('.edit-modal-container')
    );
  }

  handleOutsideClickClose(closeHandler, className) {
    return e => {
      if (className === 'user-menu') {
        if (!e.target.closest('.user-menu') && !e.target.closest('.user-menu__btn')) {
          closeHandler();
        }
        return;
      }

      if (
        (!e.target.closest('.task-manager-container') && !e.target.closest('.enhanced-task-manager')) &&
        (className === '.task-manager__add-prompt' || className === '.task-manager__search-prompt') &&
        this.isModalClosed(e)
      ) {
        closeHandler();
      } 
      
      if (
        e.target.matches(className) && 
        !(className === '.task-manager__add-prompt' || className === '.task-manager__search-prompt')
      ) {        
        closeHandler();
        console.warn('close modal at outside click');
      }
    }
  }

  clearRemainingDocumentBodyEvents() {
    const documentEvents = this.eventsHandler.documentBody;

    if (documentEvents) {
      documentEvents.forEach(eventHandler => {
        console.log('cleared', eventHandler.type)
        document.body.removeEventListener(eventHandler.type, eventHandler.reference);
      });

      documentEvents.length = 0;
    }
  }

  addModalEvents(eventHandlerKey, className, modalContainerLm, modalLm, closeLms, closeHandler) {
    const escapeKeyHandler = this.handleEscapeKeyClose(closeHandler, className);
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

    // Store document body related events to manage them in the view via the router.
    // Since the body doesn't re-render, previous events may persist if the user switches views
    // without closing the modal, potentially causing issues within the SPA routing.
    
    if (!this.eventsHandler.documentBody) {
      this.eventsHandler.documentBody = [];
    };
    const documentEvents = this.eventsHandler.documentBody;

    // Clear stored document body event handler references
    documentEvents.length = 0;

    documentEvents.push({ type: 'keydown', reference: escapeKeyHandler });
    if (modalContainerLm === document.body) {
      documentEvents.push({ type: 'click', reference: outsideClickHandler });
    }

    console.log(this.eventsHandler);
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
    delete eventsHandler.escapeKeyHandler;
    modalLm && delete eventsHandler.trapFocusHandler;
    modalContainerLm && delete eventsHandler.outsideClickHandler;
    closeLms && delete eventsHandler.closeHandler;

    console.log(this.eventsHandler);
    console.log('event listeners removed');
  }
}
export default class ModalHandler {
  constructor(router = null) {
    if (ModalHandler.instance) return ModalHandler.instance;
    ModalHandler.instance = this;
    this.router = router;
    this.eventsHandler = {};
    this.activeModals = [];
  }

  setRouterInstance(router) {
    this.router = router;
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
    const focusableLms = element.querySelectorAll(`
      a[href]:not([disabled]), 
      button:not([disabled]), 
      textarea:not([disabled]), 
      input:not([disabled]), 
      select:not([disabled]),
      [tabindex]:not([tabindex="-1"])
    `);
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
      this.trapFocus(e, modalLm);
    }
  }

  handleEscapeKeyClose(closeHandler) {
    return e => {
      if (e.key === 'Escape') {
        closeHandler(e);
      }
    }
  }

  registerModal(modalLm) {
    this.activeModals.push(modalLm);
  }
  
  unregisterModal(modalLm) {
    this.activeModals = this.activeModals.filter(modal => modal !== modalLm);
  }
  
  isActiveModal(modalLm) {
    const modals = this.activeModals;
    return modals.length && modals[modals.length - 1] === modalLm;
  }

  handleOutsideClickClose(closeHandler, modalLmOuterLimits, exemptLms = []) {
    return e => {
      const clickedLm = e.target;
      
      // Click was inside the modal
      if (modalLmOuterLimits.contains(clickedLm)) {
        return;
      } 

      // Click was outside the modal
      const isClickOnExempt = exemptLms.some(exemptEl => exemptEl?.contains(clickedLm));
      if (isClickOnExempt) {
        return;
      }

      closeHandler(e);
    }
  }

  clearDocumentBodyEvents() {
    const documentBodyEvents = this.eventsHandler.documentBody;

    if (documentBodyEvents) {
      for (const key in documentBodyEvents) {
        const events = documentBodyEvents[key];

        events.forEach(eventHandler => {
          document.body.removeEventListener(eventHandler.type, eventHandler.reference);
        });

        events.length = 0;
      }
    }
  }

  clearActiveModals() {
    this.activeModals.length = 0;
  }

  addModalEvents({
    eventHandlerKey,
    modalLm = null, 
    closeLms = null, 
    closeHandler, 
    modalLmOuterLimits,
    exemptLms = []
  } = {}) {
    this.router.abortActiveFetches();

    const handleActiveModalClose = e => {
      e.stopPropagation();
      if (!this.isActiveModal(modalLm)) {
        return;
      }

      closeHandler();  // Only close if this is the topmost modal
    };

    const escapeKeyHandler = this.handleEscapeKeyClose(handleActiveModalClose);
    const outsideClickHandler = this.handleOutsideClickClose(handleActiveModalClose, modalLmOuterLimits, exemptLms);
    const trapFocusHandler = this.handleTrapFocus(modalLm);
  
    // Add modal events
    document.body.addEventListener('keydown', escapeKeyHandler);
    if (modalLmOuterLimits) {
      document.body.addEventListener('click', outsideClickHandler);
    }
    modalLm?.addEventListener('keydown', trapFocusHandler);

    // Add close function to specified element(s)
    if (closeLms && Array.isArray(closeLms)) {
      closeLms.forEach(closeLm => {
        closeLm.addEventListener('click', handleActiveModalClose);
      });
    }

    this.registerModal(modalLm);
    
    if (!this.eventsHandler[eventHandlerKey]) {
      this.eventsHandler[eventHandlerKey] = {};
    }
    const eventsHandler = this.eventsHandler[eventHandlerKey];

    // Store event handlers references in the eventsHandler object to remove them later
    eventsHandler.escapeKeyHandler = escapeKeyHandler;
    eventsHandler.outsideClickHandler = outsideClickHandler;
    modalLm && (eventsHandler.trapFocusHandler = trapFocusHandler);
    closeLms && (eventsHandler.closeHandler = handleActiveModalClose);

    // Store document body related events to manage them via router change view.
    // Since the body doesn't re-render, previous events may persist if the user switches views
    // without closing the modal, potentially causing issues within the SPA routing.

    if (!this.eventsHandler.documentBody) {
      this.eventsHandler.documentBody = {};
    }
  
    if (!this.eventsHandler.documentBody[eventHandlerKey]) {
      this.eventsHandler.documentBody[eventHandlerKey] = [];
    }

    const documentEvents = this.eventsHandler.documentBody[eventHandlerKey];
    documentEvents.push({ type: 'keydown', reference: escapeKeyHandler });
    documentEvents.push({ type: 'click', reference: outsideClickHandler });
  }

  removeModalEvents({
    eventHandlerKey,
    modalLm = null, 
    closeLms = null
  } = {}) {
    const eventsHandler = this.eventsHandler[eventHandlerKey];
    if (!eventsHandler) {
      console.warn(`Event handler for key "${eventHandlerKey}" not found. Unable to clear modal events.`);
      return;
    }

    // Remove event listeners from elements
    document.body.removeEventListener('keydown', eventsHandler.escapeKeyHandler);
    document.body.removeEventListener('click', eventsHandler.outsideClickHandler);
    modalLm?.removeEventListener('keydown', eventsHandler.trapFocusHandler);

    if (closeLms && Array.isArray(closeLms)) {
      closeLms.forEach(closeLm => {
        closeLm.removeEventListener('click', eventsHandler.closeHandler);
      });
    }
    
    // Clean up stored handlers
    delete this.eventsHandler[eventHandlerKey]; 
    const documentEvents = this.eventsHandler.documentBody[eventHandlerKey];
    documentEvents.length = 0;

    this.unregisterModal(modalLm);
  }
}
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
      console.warn('trap focus');
      this.trapFocus(e, modalLm);
    }
  }

  handleEscapeKeyClose(closeHandler) {
    return e => {
      if (e.key === 'Escape') {
        console.warn('close at escape key');
        closeHandler(e);
      }
    }
  }

  registerModal(modalLm) {
    this.activeModals.push(modalLm);
  }
  
  unregisterModal() {
    this.activeModals.pop();
  }
  
  isActiveModal(modalLm) {
    const modals = this.activeModals;
    return modals.length && modals[modals.length - 1] === modalLm;
  }

  handleOutsideClickClose(closeHandler, modalLm, modalLmOuterLimits, exemptLms = []) {
    return e => {
      const clickedLm = e.target;

      if (!this.isActiveModal(modalLm)) {
        console.warn('Not topmost modal, skipping close at overlay click');
        return;
      }
      
      // Click was inside the modal
      if (modalLmOuterLimits.contains(clickedLm)) {
        console.warn('click mas inside the modal, do nothin');
        return;
      } 

      // Click was outside the modal
      const isClickOnExempt = exemptLms.some(exemptEl => exemptEl?.contains(clickedLm));
      if (isClickOnExempt) {
        console.warn('Click was on exempt element, do nothing');
        return;
      }

      console.warn('click was outside the modal, close modal');
      closeHandler(e);
    }
  }

  clearDocumentBodyEvents() {
    const documentBodyEvents = this.eventsHandler.documentBody;

    console.log(this.eventsHandler.documentBody);

    if (documentBodyEvents) {
      for (const key in documentBodyEvents) {
        const events = documentBodyEvents[key];

        events.forEach(eventHandler => {
          document.body.removeEventListener(eventHandler.type, eventHandler.reference);
        });

        events.length = 0;
      }
    }

    console.log(this.eventsHandler.documentBody);
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
        console.warn('Not topmost modal, ignore close');
        return;
      }

      console.log('close modal at close btn click');
      closeHandler();  // Only close if this is the topmost modal
    };

    const escapeKeyHandler = this.handleEscapeKeyClose(handleActiveModalClose);
    const outsideClickHandler = this.handleOutsideClickClose(handleActiveModalClose, modalLm, modalLmOuterLimits, exemptLms);
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

    this.registerModal(modalLm); // Add modal to active set
    console.warn('added -> ' + modalLm?.className);
    console.log(this.activeModals);
    
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
    };
    if (!this.eventsHandler.documentBody[eventHandlerKey]) {
      this.eventsHandler.documentBody[eventHandlerKey] = [];
    }
    const documentEvents = this.eventsHandler.documentBody[eventHandlerKey];

    documentEvents.push({ type: 'keydown', reference: escapeKeyHandler });
    documentEvents.push({ type: 'click', reference: outsideClickHandler });

    console.log(this.eventsHandler.documentBody)
  }

  removeModalEvents({
    eventHandlerKey,
    modalLm = null, 
    closeLms = null
  } = {}) {
    const eventsHandler = this.eventsHandler[eventHandlerKey];
    
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
    console.log(this.eventsHandler.documentBody)

    this.unregisterModal(); // Mark the modal as inactive by removing it from the set
    console.warn('removed -> ' + modalLm?.className)
    console.log(modalLm)
    console.log(this.activeModals);
  }
}
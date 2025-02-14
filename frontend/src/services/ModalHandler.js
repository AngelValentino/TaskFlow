export default class ModalHandler {
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
}
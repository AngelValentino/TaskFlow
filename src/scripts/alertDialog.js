const alertDialogLm = document.getElementById('alert-dialog');
const dialogBackdropLm = document.getElementById('dialog-backdrop');
const discardBtn = document.getElementById('alert-dialog__discard-btn');
const closeDialogBtn = document.getElementById('alert-dialog__cancel-btn');
const confirmationBtn = document.getElementById('alert-dialog__confirmation-btn');
let closeAlertDialogTim;
let lastFocusLmBeforeAlertDialog;

export function openModal() {
  clearTimeout(closeAlertDialogTim);
  lastFocusLmBeforeAlertDialog = document.activeElement;
  dialogBackdropLm.style.display = 'flex';
  discardBtn.focus();
  setTimeout(() => {
    dialogBackdropLm.classList.add('alert-dialog-backdrop--active');
    alertDialogLm.classList.add('alert-dialog--active');
  });
}

export function addEventsToAlertDialogBtns(confirmationFunction) {
  function trapFocus(element) {
    const focusableLms = element.querySelectorAll('a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])');
    const firstFocusableLm = focusableLms[0]; 
    const lastFocusableLm = focusableLms[focusableLms.length - 1];

    element.addEventListener('keydown', (e) => {
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
    });
  }

  function closeModal(e) {
    e.stopPropagation();
    console.log('close function');
    dialogBackdropLm.classList.remove('alert-dialog-backdrop--active')
    alertDialogLm.classList.remove('alert-dialog--active');
    closeAlertDialogTim = setTimeout(() => {
      dialogBackdropLm.style.display = 'none';
    }, 250);
    lastFocusLmBeforeAlertDialog.focus();
  }

  trapFocus(alertDialogLm);

  dialogBackdropLm.addEventListener('click', (e) => {
    if (!e.target.matches('.dialog-backdrop')) {
      return;
    } 
    closeModal(e);
  });
  
  closeDialogBtn.addEventListener('click', closeModal);
  
  confirmationBtn.addEventListener('click', (e) => {
    closeModal(e);
    confirmationFunction();
  });
  
  discardBtn.addEventListener('click', closeModal);
  
  discardBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal(e);
    }
  });
}
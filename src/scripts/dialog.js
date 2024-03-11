const dialogBackdropLm = document.getElementById('dialog-backdrop');
let closeAlertDialogTim;

export function generateConfirmAddPromptDialogHTML() {
  dialogBackdropLm.innerHTML = `
    <div class="alert-dialog" id="alert-dialog" role="alertdialog" aria-label="Confirm discard changes." aria-describedby="alert-dialog__desc">
      <img src="img/garbage-collector-2.jpg" alt=""/>
      <button aria-label="Close dialog." type="button" class="alert-dialog__cancel-btn" id="alert-dialog__cancel-btn">
        <span aria-hidden="true" class="material-symbols-outlined">cancel</span>
      </button>
      <p class="alert-dialog__desc" id="alert-dialog__desc">Are you sure you want to discard all changes made in form?</p>
      <div>
        <button class="alert-dialog__confirmation-btn" id="alert-dialog__confirmation-btn" type="button">Yes</button>
        <button class="alert-dialog__discard-btn" id="alert-dialog__discard-btn" type="button">No</button>
      </div>
    </div>
  `;
}

function generateEditTodoDialogHTML() {

}

export function openModal(closeLms, firstLmToFocus, confirmationLm, confirmFunction) {
  const alertDialogLm = document.getElementById('alert-dialog');
  const lastFocusLmBeforeAlertDialog = document.activeElement;

  clearTimeout(closeAlertDialogTim);
  dialogBackdropLm.style.display = 'flex';
  firstLmToFocus.focus();
  setTimeout(() => {
    dialogBackdropLm.classList.add('alert-dialog-backdrop--active');
    alertDialogLm.classList.add('alert-dialog--active');
  });

  function closeModal() {
    firstLmToFocus.removeEventListener('keydown', closeModalWithEscKey);
    alertDialogLm.removeEventListener('keydown', trapFocus)
    dialogBackdropLm.removeEventListener('click', addFunctionsWF);
    dialogBackdropLm.classList.remove('alert-dialog-backdrop--active')
    alertDialogLm.classList.remove('alert-dialog--active');
    closeAlertDialogTim = setTimeout(() => {
      dialogBackdropLm.style.display = 'none';
    }, 250);
    lastFocusLmBeforeAlertDialog.focus();
  }

  function closeModalWithEscKey(e) {
    if (e.key === 'Escape') {
      closeModal();
    }
  }

  function trapFocus(e) {
    const focusableLms = alertDialogLm.querySelectorAll('a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])');
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

  function addFunctions(e, closeLms, confirmationLm = 1, confirmFunction) {
    if (e.target.matches('#dialog-backdrop')) {
      closeModal();
      return;
    }
    if (e.target.closest('#' + confirmationLm.id)) {
      closeModal();
      confirmFunction();
      return;
    }
    for (let i = 0; i < closeLms.length; i++) {
      if (e.target.closest('#' + closeLms[i].id)) {
        closeModal();
        break;
      }
    }
  } 

  function addFunctionsWF(e) {
    addFunctions(e, closeLms, confirmationLm, confirmFunction);
  }

  // if (form exist) {
  //   add submit event {
  //     closeModal();
  //     submitData();
  //   }

  dialogBackdropLm.addEventListener('click', addFunctionsWF);
  alertDialogLm.addEventListener('keydown', trapFocus);
  firstLmToFocus.addEventListener('keydown', closeModalWithEscKey);
}
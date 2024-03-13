import { addTodo, deleteTodo } from './data/todo.js';

const dialogBackdropLm = document.getElementById('dialog-backdrop');
let closeAlertDialogTim;

export function generateConfirmAddPromptDialogHTML() {
  dialogBackdropLm.innerHTML = `
    <div class="dialog" id="dialog" role="alertdialog" aria-label="Confirm discard changes." aria-describedby="dialog__desc">
      <img src="img/garbage-collector-2.jpg" alt=""/>
      <button aria-label="Close dialog." type="button" class="dialog__cancel-btn" id="dialog__cancel-btn">
        <span aria-hidden="true" class="material-symbols-outlined">cancel</span>
      </button>
      <p class="dialog__desc" id="dialog__desc">Are you sure you want to discard all changes made in form?</p>
      <div>
        <button class="dialog__confirmation-btn" id="dialog__confirmation-btn" type="button">Yes</button>
        <button class="dialog__discard-btn" id="dialog__discard-btn" type="button">No</button>
      </div>
    </div>
  `;
}

export function generateEditTodoDialogHTML() {
  dialogBackdropLm.innerHTML = `
    <div class="dialog" id="dialog" role="dialog" aria-label="Edit dialog.">
      <form class="form-dialog" id="form-dialog">
        <button aria-label="Close dialog." type="button" class="form-dialog__cancel-btn" id="form-dialog__cancel-btn">
          <span aria-hidden="true" class="material-symbols-outlined">cancel</span>
        </button>
        <label for="form-dialog__task">Task</label>
        <input class="form-dialog__task" id="form-dialog__task" type="text" name="task">
        <label for="form-dialog__date">Date</label>
        <input class="form-dialog__date" id="form-dialog__date" type="date" name="date">
        <label for="form-dialog__desc">Description</label>
        <textarea class="form-dialog__desc" id="form-dialog__desc" name="description" rows="7"></textarea>
        <button class="form-dialog__submit-btn" type="submit">Edit todo</button>
      </form>
    </div>
  `;
}

export function openModal(targetId, closeLms, firstLmToFocus, confirmationLm, confirmFunction) {
  const formDialogLm = document.getElementById('form-dialog');
  const alertDialogLm = document.getElementById('dialog');
  const lastFocusLmBeforeAlertDialog = document.activeElement;

  document.body.style.overflow = 'hidden';
  clearTimeout(closeAlertDialogTim);
  dialogBackdropLm.style.display = 'flex';
  firstLmToFocus.focus();
  // The timeout isn't really necessary, as the import delay is enough to activate transitions.
  setTimeout(() => {
    dialogBackdropLm.classList.add('dialog-backdrop--active');
    alertDialogLm.classList.add('dialog--active');
  });

  function closeModal() {
    if (formDialogLm) {
      formDialogLm.removeEventListener('submit', editTodo);
      alertDialogLm.classList.remove('form-dialog--active');
    }
    document.body.style.overflow = 'initial';
    document.body.removeEventListener('keydown', closeModalWithEscKey);
    alertDialogLm.removeEventListener('keydown', trapFocus)
    dialogBackdropLm.removeEventListener('click', addFunctionsWF);
    dialogBackdropLm.classList.remove('dialog-backdrop--active')
    alertDialogLm.classList.remove('dialog--active');
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
    const fmtdCloseLms = closeLms.length ? closeLms : [closeLms];

    for (let i = 0; i < fmtdCloseLms.length; i++) {
      if (e.target.closest('#' + fmtdCloseLms[i].id)) {
        closeModal();
        break;
      }
    }
  } 

  function addFunctionsWF(e) {
    addFunctions(e, closeLms, confirmationLm, confirmFunction);
  }

  function editTodo(e) {
    e.preventDefault();
    //check if user has changed anything
    closeModal();
    deleteTodo(targetId) 
    addTodo('unshift', formDialogLm);
  }

  if (formDialogLm) {
    formDialogLm.addEventListener('submit', editTodo);
    alertDialogLm.classList.add('form-dialog--active');
  }

  dialogBackdropLm.addEventListener('click', addFunctionsWF);
  alertDialogLm.addEventListener('keydown', trapFocus);
  document.body.addEventListener('keydown', closeModalWithEscKey);
}
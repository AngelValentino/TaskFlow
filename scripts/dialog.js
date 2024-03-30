import { addTodo, deleteTodo } from './data/todo.js';
import { getTodoInfo } from './main.js';
import { getRandomNumber } from './utils.js';

const dialogBackdropLm = document.getElementById('dialog-backdrop');
let closeAlertDialogTim;

export function generateInfoDialogHTML(descText, ariaLabel) {
  dialogBackdropLm.innerHTML = `
    <div class="dialog" id="dialog" role="dialog" aria-label="${ariaLabel}" aria-describedby="dialog__desc">
      <img class="dialog__capybara-placeholder-img" src="img/cute-animals-drawings/capybara.jpg" alt="A drawing of capybara having a bath in a hot tub with a rubber duck on its head."/>
      <button aria-label="Close dialog." type="button" class="dialog__cancel-btn" id="dialog__cancel-btn">
        <span aria-hidden="true" class="material-symbols-outlined">cancel</span>
      </button>
      <p class="dialog__desc" id="dialog__desc">${descText}</p>
      <button style="padding: 12px 20px" class="dialog__confirmation-btn" id="dialog__confirmation-btn" type="button">Ok</button>
    </div>
  `;
  const closeLm = document.getElementById('dialog__cancel-btn');
  const confirmationLm = document.getElementById('dialog__confirmation-btn');
  return {closeLm, confirmationLm};
}

export function generateConfirmDialogHTML() {
  dialogBackdropLm.innerHTML = `
    <div class="dialog" id="dialog" role="alertdialog" aria-label="Confirm discard changes." aria-describedby="dialog__desc">
      <div id="dialog__image-container">
        <img class="dialog__recycle-placeholder-img" src="img/recycle-icons/garbage-collector-${getRandomNumber(1, 6)}.jpg" alt="A drawing of a garbage collector taking out the trash."/>
      </div>
      <button aria-label="Close dialog." type="button" class="dialog__cancel-btn" id="dialog__cancel-btn">
        <span aria-hidden="true" class="material-symbols-outlined">cancel</span>
      </button>
      <p class="dialog__desc" id="dialog__desc">Are you sure you want to discard all changes made in form?</p>
      <div class="dialog__btns" id="dialog__btns">
        <button class="dialog__confirmation-btn" id="dialog__confirmation-btn" type="button">Yes</button>
        <button class="dialog__discard-btn" id="dialog__discard-btn" type="button">No</button>
      </div>
    </div>
  `;
  const closeLms = document.querySelectorAll('#dialog__discard-btn, #dialog__cancel-btn');
  const confirmationLm = document.getElementById('dialog__confirmation-btn');
  const discardBtn = document.getElementById('dialog__discard-btn');
  const dialogDescLm = document.getElementById('dialog__desc');
  const dialogImgContainer = document.getElementById('dialog__image-container');
  return {closeLms, confirmationLm, discardBtn, dialogDescLm, dialogImgContainer};
}

export function generateEditTodoDialogHTML() {
  dialogBackdropLm.innerHTML = `
    <div class="dialog" id="dialog" role="dialog" aria-label="Edit dialog.">
      <form class="form-dialog" id="form-dialog">
        <button aria-label="Close dialog." type="button" class="form-dialog__cancel-btn" id="form-dialog__cancel-btn">
          <span aria-hidden="true" class="material-symbols-outlined">cancel</span>
        </button>
        <label for="form-dialog__task">Task</label>
        <input required class="form-dialog__task" id="form-dialog__task" type="text" name="task">
        <label for="form-dialog__date">Date</label>
        <input required class="form-dialog__date" id="form-dialog__date" type="date" name="date">
        <label for="form-dialog__desc">Description</label>
        <textarea required class="form-dialog__desc" id="form-dialog__desc" name="description" rows="7"></textarea>
        <button class="form-dialog__submit-btn" type="submit">Edit todo</button>
      </form>
    </div>
  `;
  const closeBtn = document.getElementById('form-dialog__cancel-btn');
  const formDialogLm = document.getElementById('form-dialog');
  const formInputs = formDialogLm.querySelectorAll('input, textarea');
  return {closeBtn, formDialogLm, formInputs};
}

export function openModal(targetId, todoInfo, closeLms, firstLmToFocus, confirmationLm, confirmFunction) {
  const clearAllTodosBtn = document.getElementById('todo-app-intro__clear-btn');
  const formDialogLm = document.getElementById('form-dialog');
  const alertDialogLm = document.getElementById('dialog');
  const lastFocusLmBeforeAlertDialog = document.activeElement;

  document.body.children[2].inert = true;
  document.body.style.overflow = 'hidden';
  clearTimeout(closeAlertDialogTim);
  dialogBackdropLm.style.display = 'flex';
  firstLmToFocus.focus();
  if (formDialogLm) {
    alertDialogLm.classList.add('form-dialog--active');
  }
  // The timeout isn't really necessary, as the import delay is enough to activate transitions.
  setTimeout(() => {
    dialogBackdropLm.classList.add('dialog-backdrop--active');
    alertDialogLm.classList.add('dialog--active');
  });

  function removeEventsListeners() {
    if (formDialogLm) {
      formDialogLm.removeEventListener('submit', editTodo);
    }
    document.body.removeEventListener('keydown', closeModalWithEscKey);
    alertDialogLm.removeEventListener('keydown', trapFocus)
    dialogBackdropLm.removeEventListener('click', addFunctionsWF);
  }

  function closeModal() {
    removeEventsListeners();
    document.body.children[2].inert = false;
    clearAllTodosBtn.classList.remove('todo-app-intro__clear-btn--active');
    document.body.style.overflow = 'initial';
    dialogBackdropLm.classList.remove('dialog-backdrop--active');
    alertDialogLm.classList.remove('dialog--active');
    closeAlertDialogTim = setTimeout(() => {
      alertDialogLm.classList.remove('form-dialog--active');
      dialogBackdropLm.style.display = 'none';
    }, 250);
    // Once the confirm edit modal appears. Focus moves to the body, so the if statement tells the browser to focus back the buttonLm.
    // We need to get the element again because it has just been generated and lastFocusLmBeforeAlertDialog can't target it anymore.
    if (lastFocusLmBeforeAlertDialog.matches('body') || lastFocusLmBeforeAlertDialog.matches(`#todo__edit-btn-${targetId}`)) {
      const editTodoBtn = document.getElementById(`todo__edit-btn-${targetId}`);
      editTodoBtn.focus();
    } 
    else {
      lastFocusLmBeforeAlertDialog.focus();
    }
  }

  function closeEditDialog() {
    setTimeout(() => {
      alertDialogLm.classList.remove('form-dialog--active');
    }, 250)
    removeEventsListeners();
    alertDialogLm.classList.remove('dialog--active');
    // Calling generateEditTodoDialogHTML() already removes the class.
    alertDialogLm.classList.remove('dialog--edit');
  }

  function openConfirmEditDialog() {
    closeEditDialog()
    setTimeout(() => {
      const { closeLms, confirmationLm, discardBtn } = generateConfirmDialogHTML();
      const alertDialogLm = document.getElementById('dialog');
      alertDialogLm.classList.add('dialog--edit');
      openModal(targetId, {formerEdit: todoInfo.formerEdit, currentEdit: getTodoInfo(formDialogLm)}, closeLms, discardBtn, confirmationLm);
    }, 400)
  }

  function closeConfirmEditDialog() {
    closeEditDialog();
    setTimeout(() => {
      const { closeBtn, formInputs } = generateEditTodoDialogHTML();
      formInputs.forEach((input) => {
        input.value = todoInfo.currentEdit[input.name];
      })
      openModal(targetId, todoInfo, closeBtn, closeBtn);
    }, 400);
  }

  function closeModalWithEscKey(e) {
    if (e.key === 'Escape') {
      if (isFormEdited()) {
        openConfirmEditDialog();
        return;
      } 
      if (alertDialogLm.matches('.dialog--edit')) {
        closeConfirmEditDialog();
      } 
      else {
        closeModal();
      }
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

  function isFormEdited() {
    if (!formDialogLm) {
      return 0;
    }
    const currentTodoInfo = getTodoInfo(formDialogLm);
    if (
      currentTodoInfo.task !== todoInfo.formerEdit.task || 
      currentTodoInfo.date !== todoInfo.formerEdit.date || 
      currentTodoInfo.description !== todoInfo.formerEdit.description
      ) {
      return true;
    } 
    else {
      return false;
    }
  }

  function addFunctions(e, closeLms, confirmationLm = 1, confirmFunction) {
    if (e.target.matches('#dialog-backdrop')) {
      if (isFormEdited()) {
        openConfirmEditDialog();
      } 
      else if (alertDialogLm.matches('.dialog--edit')) {
        closeConfirmEditDialog();
      } 
      else {
        closeModal();
      }
      return;
    } 
    else if (e.target.closest('#' + confirmationLm.id)) {
      closeModal();
      if (!alertDialogLm.matches('.dialog--edit')) {
        confirmFunction();
      }
      return;
    } 

    const fmtdCloseLms = closeLms.length ? closeLms : [closeLms];

    for (let i = 0; i < fmtdCloseLms.length; i++) {
      if (e.target.closest('#' + fmtdCloseLms[i].id)) {
        if (isFormEdited()) {
          openConfirmEditDialog();
          break;
        } 
        else {
          if (alertDialogLm.matches('.dialog--edit')) {
            closeConfirmEditDialog();
          } 
          else {
            closeModal();
          }
        }
        break;
      }
    }
  } 

  function addFunctionsWF(e) {
    addFunctions(e, closeLms, confirmationLm, confirmFunction);
  }

  function editTodo(e) {
    e.preventDefault();
    if (!isFormEdited()) {
      // form has not been edited
      closeModal();
      return;
    }
    // form has been edited
    deleteTodo(targetId);
    addTodo('unshift', formDialogLm, targetId);
    closeModal();
  }

  function addEventsListeners() {
    if (formDialogLm) {
      formDialogLm.addEventListener('submit', editTodo);
    }
    // It needs the timeout because the user can also close the addTodoPrompt with 'Escape'. And if there's info in it, it opens the confirmational modal it detects the 'Escape' key pressed and instantly closes the modal.
    setTimeout(() => {
      document.body.addEventListener('keydown', closeModalWithEscKey);
    });
    dialogBackdropLm.addEventListener('click', addFunctionsWF);
    alertDialogLm.addEventListener('keydown', trapFocus);
  }

  addEventsListeners();
}

export function openConfirmDialog(confirmFunction, descText, changeImage) {
  const { closeLms, confirmationLm, discardBtn, dialogDescLm, dialogImgContainer } = generateConfirmDialogHTML();
  if (changeImage) {
    dialogImgContainer.innerHTML = '<img class="dialog__capybara-placeholder-img" src="img/cute-animals-drawings/capybara.jpg" alt="A drawing of capybara having a bath in a hot tub with a rubber duck on its head."/>';
  }
  dialogDescLm.innerText = descText;
  openModal(null, null, closeLms, discardBtn, confirmationLm, confirmFunction);
}
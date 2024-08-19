import { 
  addTodo, 
  deleteTodo 
} from './data/todo.js';

import { 
  getTodoInfo 
} from './main.js';

import { 
  getRandomNumber, 
  toggleModalFocus, 
  toggleModalEvents, 
  setActiveBtn 
} from './utils.js';

const clearAllTodosBtn = document.getElementById('todo-app-intro__clear-btn');

// Confirm dialog DOM references
const confrimDialogContainerLm = document.getElementById('confirm-dialog-container');
const confrimDailogOveralyLm = document.getElementById('confirm-dialog-overlay')
const confirmDialogLm = document.getElementById('confirm-dialog');
const confirmDialogImgContainerLm = document.getElementById('confirm-dialog__image-container');
const confirmDialogCloseBtn = document.getElementById('confirm-dialog__close-btn');
const confirmDialogAcceptBtn = document.getElementById('confirm-dialog__accept-btn');
const confirmDialogCancelBtn = document.getElementById('confirm-dialog__cancel-btn');
const confrimDialogDescLm = document.getElementById('confirm-dialog__desc');

// Edit dialog DOM references
const editDialogContainerLm = document.getElementById('edit-dialog-container');
const editDialogOverlayLm = document.getElementById('edit-dialog-overlay');
const editDialogLm = document.getElementById('edit-dialog');
const editDialogCloseBtn = document.getElementById('edit-dialog__close-btn');
const editDialogFormLm = document.getElementById('edit-dialog__form');
const editDialogFormInputLms = editDialogFormLm.querySelectorAll('input, textarea');

// Info dialog DOM references
const infoDialogContainerLm = document.getElementById('info-dialog-container');
const infoDialogOverlayLm = document.getElementById('info-dialog-overlay');
const infoDialogLm = document.getElementById('info-dialog');
const infoDialogCloseBtn = document.getElementById('info-dialog__close-btn');
const infoDialogAcceptBtn = document.getElementById('info-dialog__accept-btn');
const infoDailogDescLm = document.getElementById('info-dialog__desc');

// Reassignment variables and timeout ids
let closeEditDialogTimId;
let closeInfoDialogTimId;
let closeConfirmDialogTimId;
let openConfirmDialogTimId;
let lastTargetId;
let lastFocusedLmBeforeModal;

function closeDialog(modalContentLm, modalContainerLm, modalOverlayLm) {
  document.body.style.overflow = '';
  modalContentLm.style.transform = 'scale(0)';
  modalContentLm.style.opacity = 0;
  modalOverlayLm.style.opacity = 0;
  const timId = setTimeout(() => {
    modalContainerLm.style.display = 'none';
    toggleModalFocus('return', null, lastFocusedLmBeforeModal);
  }, 250);
  return timId;
}

function openDialog(timId, firstFocusableLm, modalContentLm, modalContainerLm, modalOverlayLm, modalDescLm, descText) {
  clearTimeout(timId);
  document.body.style.overflow = 'hidden';
  modalDescLm && (modalDescLm.innerText = descText);
  modalContainerLm.style.display = 'flex';
  lastFocusedLmBeforeModal = toggleModalFocus('add', firstFocusableLm);

  // Added a timeout to ensure the animations always play 
  setTimeout(() => {
    modalContainerLm.style.opacity = 1;
    modalContentLm.style.transform = 'scale(1)';
    modalContentLm.style.opacity = 1;
    modalOverlayLm.style.opacity = 1;
  });
}

export function openInfoDialog(descText, confirmFun) {
  console.log('info dialog opened')
  const eventsHandler = {};
  
  openDialog(closeInfoDialogTimId, infoDialogCloseBtn, infoDialogLm, infoDialogContainerLm, infoDialogOverlayLm, infoDailogDescLm, descText);

  const checkCloseLms = () => confirmFun ? infoDialogCloseBtn : [ infoDialogCloseBtn, infoDialogAcceptBtn ];

  function closeInfoDialog() {
    console.log('info dialog closed');
    closeInfoDialogTimId = closeDialog(infoDialogLm, infoDialogContainerLm, infoDialogOverlayLm);

    if (clearAllTodosBtn.getAttribute('aria-expanded') === 'true') {
      setActiveBtn(clearAllTodosBtn);
    }

    // Remove event listeners
    toggleModalEvents(eventsHandler, 'remove', null, checkCloseLms(), infoDialogLm, infoDialogContainerLm);
    confirmFun && infoDialogAcceptBtn.removeEventListener('click', closeInfoDialogWithFun);
  }

  function closeInfoDialogWithFun() {
    closeInfoDialog();
    confirmFun();
  }

  // Add event listeners
  toggleModalEvents(eventsHandler, 'add', closeInfoDialog, checkCloseLms(), infoDialogLm, infoDialogContainerLm, '.info-dialog-overlay');
  confirmFun && infoDialogAcceptBtn.addEventListener('click', closeInfoDialogWithFun);
}

export function openEditDialog(targetId, todoInfo) {
  const eventsHandler = {};
  lastTargetId = targetId;
  console.log('edit dialog opened');
  clearTimeout(openConfirmDialogTimId);
  openDialog(closeEditDialogTimId, editDialogCloseBtn, editDialogLm, editDialogContainerLm, editDialogOverlayLm);

  function closeEditDialog() {
    closeEditDialogTimId = closeDialog(editDialogLm, editDialogContainerLm, editDialogOverlayLm);

    toggleModalEvents(eventsHandler, 'remove', null, editDialogCloseBtn, editDialogLm, editDialogContainerLm);
    editDialogFormLm.removeEventListener('submit', editTodo);
  }

  function isFormEdited() {
    const currentTodoInfo = getTodoInfo(editDialogFormLm);
    
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

  function editTodo(e) {
    e.preventDefault();

    // form has been edited
    if (isFormEdited()) {
      console.log('form has been edited');
      deleteTodo(targetId);
      addTodo('unshift', editDialogFormLm, targetId);
      closeEditDialog();
      /* It generates the todo again so we have to get a new reference to the edit button 
      in order to return focus to it */
      const editTodoBtn = document.getElementById(`todo__edit-btn-${targetId}`);
      editTodoBtn.focus();
    } 
    // form has not been edited
    else {
      console.log('form has not been edited');
      closeEditDialog();
    }
  }
  
  function exitAndReturnEdit(targetId, todoInfo) {
    setTimeout(() => {
      openEditDialog(targetId, todoInfo);
    }, 100);
    
    // Add current info back again to inputs
    editDialogFormInputLms.forEach(input => {
      input.value = todoInfo.currentEdit[input.name];
    });
  }

  function checkUnsavedChanges() {
    console.log('edit dialog closed')

    // If the form has been edited open the confirm discard changes modal
    if (isFormEdited()) {
      console.log('form has been edited');
      // Close edit modal
      closeEditDialog();
      // Open confirm modal
      openConfirmDialogTimId = setTimeout(() => {
        openConfirmDialog(exitAndReturnEdit.bind(null, targetId, { ...todoInfo, currentEdit: getTodoInfo(editDialogFormLm) }), 'Are you sure that you want to discard the current changes made in form?', null, true);
      }, 100);
    } 
    // Else if the form has not been edited just close the edit dialog
    else {
      console.log('form has not been edited');
      closeEditDialog();
    }
  }

  // Add event listeners
  toggleModalEvents(eventsHandler, 'add', checkUnsavedChanges, editDialogCloseBtn, editDialogLm, editDialogContainerLm, '.edit-dialog-overlay');
  editDialogFormLm.addEventListener('submit', editTodo);
}

export function openConfirmDialog(confirmFun, descText, changeImage, confirmEdit) {
  console.log('confirm modal opened');
  const eventsHandler = {};
  const closeLms = [ confirmDialogCloseBtn, confirmDialogCancelBtn ];
  
  if (changeImage) {
    confirmDialogImgContainerLm.innerHTML = '<img class="dialog__capybara-placeholder-img" src="img/cute-animals-drawings/capybara.jpg" alt="A drawing of capybara having a bath in a hot tub with a rubber duck on its head."/>';
  } 
  else {
    confirmDialogImgContainerLm.innerHTML = `<img class="confirm-dialog__recycle-placeholder-img" src="img/recycle-icons/garbage-collector-${getRandomNumber(1, 6)}.jpg" alt="A drawing of a garbage collector taking out the trash."/>`;
  }

  openDialog(closeConfirmDialogTimId, confirmDialogCloseBtn, confirmDialogLm, confrimDialogContainerLm, confrimDailogOveralyLm, confrimDialogDescLm, descText);

  function closeConfirmDialog() {
    console.log('confirm dialog closed')
    closeConfirmDialogTimId = closeDialog(confirmDialogLm, confrimDialogContainerLm, confrimDailogOveralyLm);

    if (clearAllTodosBtn.getAttribute('aria-expanded') === 'true') {
      setActiveBtn(clearAllTodosBtn);
    }

    // Remove event listeners
    if (confirmEdit) {
      toggleModalEvents(eventsHandler, 'remove', null, closeLms, confirmDialogLm, confrimDialogContainerLm);
      confirmDialogAcceptBtn.removeEventListener('click', confirmDiscardEdit);
    } 
    else {
      toggleModalEvents(eventsHandler, 'remove', null, closeLms, confirmDialogLm, confrimDialogContainerLm);
      confirmDialogAcceptBtn.removeEventListener('click', closeConfirmDialogWithFun);
    }
  }

  function confirmDiscardEdit() {
    closeConfirmDialog()
    // Code necessary to return focus to the edit button after the user decides to discard the current todo edit
    if (confirmEdit && lastTargetId) {
      const editTodoBtn = document.getElementById(`todo__edit-btn-${lastTargetId}`);
      editTodoBtn.focus();
    }
  }

  function closeConfirmDialogWithFun() {
    closeConfirmDialog();
    confirmFun();
  }

  // Add event listeners
  if (confirmEdit) {
    toggleModalEvents(eventsHandler, 'add', closeConfirmDialogWithFun, closeLms, confirmDialogLm, confrimDialogContainerLm, '.confirm-dialog-overlay');
    confirmDialogAcceptBtn.addEventListener('click', confirmDiscardEdit);
  } 
  else {
    toggleModalEvents(eventsHandler, 'add', closeConfirmDialog, closeLms, confirmDialogLm, confrimDialogContainerLm, '.confirm-dialog-overlay');
    confirmDialogAcceptBtn.addEventListener('click', closeConfirmDialogWithFun);
  }
}
import { addTodo, deleteTodo } from './data/todo.js';
import { getTodoInfo } from './main.js';
import { getRandomNumber, toggleModalFocus, toggleModalEvents } from './utils.js';

// Confirm dialog DOM references
const confrimDialogBackdropLm = document.getElementById('confirm-dialog-backdrop');
const confirmDialogLm = document.getElementById('confirm-dialog');
const confirmDialogImgContainerLm = document.getElementById('confirm-dialog__image-container');
const confirmDialogCloseBtn = document.getElementById('confirm-dialog__close-btn');
const confirmDialogAcceptBtn = document.getElementById('confirm-dialog__accept-btn');
const confirmDialogCancelBtn = document.getElementById('confirm-dialog__cancel-btn');
const confrimDialogDescLm = document.getElementById('confirm-dialog__desc');

// Edit dialog DOM references
const editDialogBackdropLm = document.getElementById('edit-dialog-backdrop');
const editDialogLm = document.getElementById('edit-dialog');
const editDialogCloseBtn = document.getElementById('edit-dialog__close-btn');
const editDialogFormLm = document.getElementById('edit-dialog__form')
const editDialogFormInputLms = editDialogFormLm.querySelectorAll('input, textarea');

// Info dialog DOM references
const infoDialogBackdropLm = document.getElementById('info-dialog-backdrop');
const infoDialogLm = document.getElementById('info-dialog');
const infoDialogCloseBtn = document.getElementById('info-dialog__close-btn');
const infoDialogAcceptBtn = document.getElementById('info-dialog__accept-btn');
const infoDailogDescLm = document.getElementById('info-dialog__desc');

// Reassignment variables and timout ids
let closeEditDialogTimId;
let closeInfoDialogTimId;
let closeConfirmDialogTimId;
let openConfirmDialogTimId;
let lastTargetId;

function closeDialog(modalContentLm, modalContainerLm, timId) {
  modalContainerLm.style.opacity = 0;
  modalContentLm.style.transform = 'scale(0)';
  timId = setTimeout(() => {
    modalContainerLm.style.display = 'none';
    toggleModalFocus('return');
  }, 250);
}

function openDialog(timId, firstFocusableLm, modalContentLm, modalContainerLm, modalDescLm, descText) {
  clearTimeout(timId);
  modalDescLm && (modalDescLm.innerText = descText);
  modalContainerLm.style.display = 'flex';
  toggleModalFocus('add', firstFocusableLm);

  // Added a timeout to ensure the animations always play 
  setTimeout(() => {
    modalContainerLm.style.opacity = 1;
    modalContentLm.style.transform = 'scale(1)';
  });
}

//TODO Refactor dialog css
//TODO Fix edit todo horizontal screen overflow bug
//TODO Add the last accessibility features to open and close dialog functions

export function openInfoDialog(descText, confirmFun) {
  console.log('info dialog opened')
  const eventsHandler = {};
  
  openDialog(closeInfoDialogTimId, infoDialogCloseBtn, infoDialogLm, infoDialogBackdropLm, infoDailogDescLm, descText);

  const checkCloseLms = () => confirmFun ? infoDialogCloseBtn : [ infoDialogCloseBtn, infoDialogAcceptBtn ];

  function closeInfoDialog() {
    console.log('info dialog closed');
    closeDialog(infoDialogLm, infoDialogBackdropLm, closeInfoDialogTimId);

    // Remove event listeners
    toggleModalEvents(eventsHandler, 'remove', null, checkCloseLms(), infoDialogLm, infoDialogBackdropLm);
    confirmFun && infoDialogAcceptBtn.removeEventListener('click', closeInfoDialogWithFun);
  }

  function closeInfoDialogWithFun() {
    closeInfoDialog();
    confirmFun();
  }

  // Add event listeners
  toggleModalEvents(eventsHandler, 'add', closeInfoDialog, checkCloseLms(), infoDialogLm, infoDialogBackdropLm, '.info-dialog-backdrop');
  confirmFun && infoDialogAcceptBtn.addEventListener('click', closeInfoDialogWithFun);
}

export function openEditDialog(targetId, todoInfo) {
  const eventsHandler = {};
  lastTargetId = targetId;
  console.log('edit dialog opened');
  clearTimeout(openConfirmDialogTimId);
  openDialog(closeEditDialogTimId, editDialogCloseBtn, editDialogLm, editDialogBackdropLm);

  function closeEditDialog() {
    closeDialog(editDialogLm, editDialogBackdropLm, closeEditDialogTimId);

    toggleModalEvents(eventsHandler, 'remove', null, editDialogCloseBtn, editDialogLm, editDialogBackdropLm);
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
    
    // add current info back again to inputs
    editDialogFormInputLms.forEach(input => {
      input.value = todoInfo.currentEdit[input.name];
    })
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
  toggleModalEvents(eventsHandler, 'add', checkUnsavedChanges, editDialogCloseBtn, editDialogLm, editDialogBackdropLm, '.edit-dialog-backdrop');
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

  openDialog(closeConfirmDialogTimId, confirmDialogCloseBtn, confirmDialogLm, confrimDialogBackdropLm, confrimDialogDescLm, descText);

  function closeConfirmDialog() {
    console.log('confirm dialog closed')
    closeDialog(confirmDialogLm, confrimDialogBackdropLm, closeConfirmDialogTimId);

    // Remove event listeners
    if (confirmEdit) {
      toggleModalEvents(eventsHandler, 'remove', null, closeLms, confirmDialogLm, confrimDialogBackdropLm);
      confirmDialogAcceptBtn.removeEventListener('click', confirmDiscardEdit);
    } 
    else {
      toggleModalEvents(eventsHandler, 'remove', null, closeLms, confirmDialogLm, confrimDialogBackdropLm);
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
    toggleModalEvents(eventsHandler, 'add', closeConfirmDialogWithFun, closeLms, confirmDialogLm, confrimDialogBackdropLm, '.confirm-dialog-backdrop');
    confirmDialogAcceptBtn.addEventListener('click', confirmDiscardEdit);
  } 
  else {
    toggleModalEvents(eventsHandler, 'add', closeConfirmDialog, closeLms, confirmDialogLm, confrimDialogBackdropLm, '.confirm-dialog-backdrop');
    confirmDialogAcceptBtn.addEventListener('click', closeConfirmDialogWithFun);
  }
}
import { 
  addTodo, 
  deleteTodo 
} from './data/todo.js';

import { 
  getRandomNumber, 
  toggleModalFocus, 
  toggleModalEvents, 
  setActiveBtn,
  getFormData
} from './utils.js';

// DOM reference for the clear all todos button
const clearAllTodosBtn = document.getElementById('todo-app-intro__clear-btn');

// Confirm dialog DOM references
const confirmDialogContainerLm = document.getElementById('confirm-dialog-container');
const confirmDialogOveralyLm = document.getElementById('confirm-dialog-overlay')
const confirmDialogLm = document.getElementById('confirm-dialog');
const confirmDialogImgContainerLm = document.getElementById('confirm-dialog__image-container');
const confirmDialogCloseBtn = document.getElementById('confirm-dialog__close-btn');
const confirmDialogAcceptBtn = document.getElementById('confirm-dialog__accept-btn');
const confirmDialogCancelBtn = document.getElementById('confirm-dialog__cancel-btn');
const confirmDialogDescLm = document.getElementById('confirm-dialog__desc');

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
  document.body.style.overflow = ''; // Reset body overflow
  modalContentLm.style.transform = 'scale(0)'; // Scale down the modal content
  modalContentLm.style.opacity = 0; // Fade out the modal content
  modalOverlayLm.style.opacity = 0; // Fade out the overlay
  
  const timId = setTimeout(() => {
    modalContainerLm.style.display = 'none'; // Hide the modal container
    toggleModalFocus('return', null, lastFocusedLmBeforeModal); // Return focus to the last focused element
  }, 250);

  return timId; // Return the timeout ID
}

function openDialog(timId, firstFocusableLm, modalContentLm, modalContainerLm, modalOverlayLm, modalDescLm, descText) {
  clearTimeout(timId); // Clear any existing timeout
  document.body.style.overflow = 'hidden'; // Prevent scrolling while modal is open
  modalDescLm && (modalDescLm.innerText = descText); // Set the description text if provided
  modalContainerLm.style.display = 'flex'; // Show the modal container
  lastFocusedLmBeforeModal = toggleModalFocus('add', firstFocusableLm); // Focus the first element inside the modal

  // Added a timeout to ensure the animations always play 
  setTimeout(() => {
    modalContainerLm.style.opacity = 1; // Fade in the modal container
    modalContentLm.style.transform = 'scale(1)'; // Scale up the modal content
    modalContentLm.style.opacity = 1; // Fade in the modal content
    modalOverlayLm.style.opacity = 1; // Fade in the overlay
  });
}

export function openInfoDialog(descText, confirmFun) {
  const eventsHandler = {}; // Object to handle event listeners
  
  // Open the info dialog with the provided description text
  openDialog(closeInfoDialogTimId, infoDialogCloseBtn, infoDialogLm, infoDialogContainerLm, infoDialogOverlayLm, infoDailogDescLm, descText);

  // Determine which buttons to use for closing the dialog
  const checkCloseLms = () => confirmFun ? infoDialogCloseBtn : [ infoDialogCloseBtn, infoDialogAcceptBtn ];

  function closeInfoDialog() {
    // Closes info dialog
    closeInfoDialogTimId = closeDialog(infoDialogLm, infoDialogContainerLm, infoDialogOverlayLm);

    // Update the clear all todos button active state if needed
    if (clearAllTodosBtn.getAttribute('aria-expanded') === 'true') {
      setActiveBtn(clearAllTodosBtn);
    }

    // Remove event listeners
    toggleModalEvents(eventsHandler, 'remove', null, checkCloseLms(), infoDialogLm, infoDialogContainerLm);
    confirmFun && infoDialogAcceptBtn.removeEventListener('click', closeInfoDialogWithFun);
  }

  // Close the info dialog and execute the provided function
  function closeInfoDialogWithFun() {
    closeInfoDialog();
    confirmFun();
  }

  // Add event listeners
  toggleModalEvents(eventsHandler, 'add', closeInfoDialog, checkCloseLms(), infoDialogLm, infoDialogContainerLm, '.info-dialog-overlay');
  confirmFun && infoDialogAcceptBtn.addEventListener('click', closeInfoDialogWithFun);
}

export function openEditDialog(targetId, todoInfo) {
  const eventsHandler = {}; // Object to handle event listeners
  lastTargetId = targetId; // Store the target's ID
  clearTimeout(openConfirmDialogTimId); // Clear any existing timeout for confirm dialog
  
  // Open the edit dialog
  openDialog(closeEditDialogTimId, editDialogCloseBtn, editDialogLm, editDialogContainerLm, editDialogOverlayLm);

  function closeEditDialog() {
    // Close edit dialog
    closeEditDialogTimId = closeDialog(editDialogLm, editDialogContainerLm, editDialogOverlayLm);

    // Remove event listeners
    toggleModalEvents(eventsHandler, 'remove', null, editDialogCloseBtn, editDialogLm, editDialogContainerLm);
    editDialogFormLm.removeEventListener('submit', editTodo);
  }

  // Check if the form has been edited
  function isFormEdited() {
    const currentTodoInfo = getFormData(editDialogFormLm);
    
    // Compare current form values with the original todo info
    return (
      currentTodoInfo.task !== todoInfo.formerEdit.task || 
      currentTodoInfo.date !== todoInfo.formerEdit.date || 
      currentTodoInfo.description !== todoInfo.formerEdit.description
    );
  }

  // Handle form submission and edit todo
  function editTodo(e) {
    e.preventDefault(); // Prevent default form submission

    // If the form has been edited, update the todo item
    if (isFormEdited()) {
      deleteTodo(targetId); // Delete the existing todo
      addTodo('unshift', editDialogFormLm, targetId); // Add the updated todo
      closeEditDialog(); // Close the edit dialog
      // Focus on the edit button after re-adding the todo
      const editTodoBtn = document.getElementById(`todo__edit-btn-${targetId}`);
      editTodoBtn.focus();
    } 
    // If the form has not been edited, just close the edit dialog
    else {
      closeEditDialog();
    }
  }
  
  /* Function to reopen the edit dialog with the current edited info 
  if the user doesnt't want to lose the current changes made in form */
  function exitAndReturnEdit(targetId, todoInfo) {
    setTimeout(() => {
      openEditDialog(targetId, todoInfo);
    }, 100);
    
    // Add current info back again to inputs
    editDialogFormInputLms.forEach(input => {
      input.value = todoInfo.currentEdit[input.name];
    });
  }

  // Function to check for unsaved changes and prompt the user to confirm
  function checkUnsavedChanges() {
    // If the form has been edited, open the confirm discard changes modal
    if (isFormEdited()) {
      // Close edit modal
      closeEditDialog();
      // Open confirm modal
      openConfirmDialogTimId = setTimeout(() => {
        openConfirmDialog(exitAndReturnEdit.bind(null, targetId, { ...todoInfo, currentEdit: getFormData(editDialogFormLm) }), 'Are you sure that you want to discard the current changes made in form?', null, true);
      }, 100);
    } 
    // Else if the form has not been edited, just close the edit dialog
    else {
      closeEditDialog();
    }
  }

  // Add event listeners for handling unsaved changes and form submission
  toggleModalEvents(eventsHandler, 'add', checkUnsavedChanges, editDialogCloseBtn, editDialogLm, editDialogContainerLm, '.edit-dialog-overlay');
  editDialogFormLm.addEventListener('submit', editTodo);
}

export function openConfirmDialog(confirmFun, descText, changeImage, confirmEdit) {
  const eventsHandler = {}; // Object to handle event listeners
  const closeLms = [ confirmDialogCloseBtn, confirmDialogCancelBtn ]; // Buttons to close the dialog
  
  // Set the image in the confirm dialog based on the changeImage parameter
  if (changeImage) {
    confirmDialogImgContainerLm.innerHTML = '<img class="dialog__capybara-placeholder-img" src="images/cute-animals-drawings/capybara.jpg" alt="A drawing of capybara having a bath in a hot tub with a rubber duck on its head."/>';
  } 
  else {
    confirmDialogImgContainerLm.innerHTML = `<img class="confirm-dialog__recycle-placeholder-img" src="images/recycle-icons/garbage-collector-${getRandomNumber(1, 6)}.jpg" alt="A drawing of a garbage collector taking out the trash."/>`;
  }

  // Open the confirm dialog with the provided description text
  openDialog(closeConfirmDialogTimId, confirmDialogCloseBtn, confirmDialogLm, confirmDialogContainerLm, confirmDialogOveralyLm, confirmDialogDescLm, descText);

  function closeConfirmDialog() {
    // Close confirm dialog
    closeConfirmDialogTimId = closeDialog(confirmDialogLm, confirmDialogContainerLm, confirmDialogOveralyLm);

    // Update the clear all todos button state if needed
    if (clearAllTodosBtn.getAttribute('aria-expanded') === 'true') {
      setActiveBtn(clearAllTodosBtn);
    }

    // Remove event listeners
    if (confirmEdit) {
      toggleModalEvents(eventsHandler, 'remove', null, closeLms, confirmDialogLm, confirmDialogContainerLm);
      confirmDialogAcceptBtn.removeEventListener('click', confirmDiscardEdit);
    } 
    else {
      toggleModalEvents(eventsHandler, 'remove', null, closeLms, confirmDialogLm, confirmDialogContainerLm);
      confirmDialogAcceptBtn.removeEventListener('click', closeConfirmDialogWithFun);
    }
  }

  // Handle discard edit confirmation
  function confirmDiscardEdit() {
    closeConfirmDialog()
    // Code necessary to return focus to the edit button after the user decides to discard the current todo edit
    if (confirmEdit && lastTargetId) {
      const editTodoBtn = document.getElementById(`todo__edit-btn-${lastTargetId}`);
      editTodoBtn.focus();
    }
  }

  // Close the confirm dialog and execute the provided function
  function closeConfirmDialogWithFun() {
    closeConfirmDialog();
    confirmFun();
  }

  // Add event listeners
  if (confirmEdit) {
    toggleModalEvents(eventsHandler, 'add', closeConfirmDialogWithFun, closeLms, confirmDialogLm, confirmDialogContainerLm, '.confirm-dialog-overlay');
    confirmDialogAcceptBtn.addEventListener('click', confirmDiscardEdit);
  } 
  else {
    toggleModalEvents(eventsHandler, 'add', closeConfirmDialog, closeLms, confirmDialogLm, confirmDialogContainerLm, '.confirm-dialog-overlay');
    confirmDialogAcceptBtn.addEventListener('click', closeConfirmDialogWithFun);
  }
}
import { addTodo, deleteTodo, todos } from './data/todo.js';
import { getTodoInfo } from './main.js';
import { getRandomNumber } from './utils.js';

// const dialogBackdropLm = document.getElementById('dialog-backdrop');
// let closeAlertDialogTim;

// export function generateInfoDialogHTML(descText, ariaLabel) {
//   dialogBackdropLm.innerHTML = `
//     <div class="dialog" id="dialog" role="dialog" aria-label="${ariaLabel}" aria-describedby="dialog__desc">
//       <img class="dialog__capybara-placeholder-img" src="img/cute-animals-drawings/capybara.jpg" alt="A drawing of capybara having a bath in a hot tub with a rubber duck on its head."/>
//       <button aria-label="Close dialog." type="button" class="dialog__cancel-btn" id="dialog__cancel-btn">
//         <span aria-hidden="true" class="material-symbols-outlined">cancel</span>
//       </button>
//       <p class="dialog__desc" id="dialog__desc">${descText}</p>
//       <button style="padding: 12px 20px" class="dialog__confirmation-btn" id="dialog__confirmation-btn" type="button">Ok</button>
//     </div>
//   `;
//   const closeLm = document.getElementById('dialog__cancel-btn');
//   const confirmationLm = document.getElementById('dialog__confirmation-btn');
//   return {closeLm, confirmationLm};
// }

// export function generateConfirmDialogHTML() {
//   dialogBackdropLm.innerHTML = `
//     <div class="dialog" id="dialog" role="alertdialog" aria-label="Confirm discard changes." aria-describedby="dialog__desc">
//       <div id="dialog__image-container">
//         <img class="dialog__recycle-placeholder-img" src="img/recycle-icons/garbage-collector-${getRandomNumber(1, 6)}.jpg" alt="A drawing of a garbage collector taking out the trash."/>
//       </div>
//       <button aria-label="Close dialog." type="button" class="dialog__cancel-btn" id="dialog__cancel-btn">
//         <span aria-hidden="true" class="material-symbols-outlined">cancel</span>
//       </button>
//       <p class="dialog__desc" id="dialog__desc">Are you sure you want to discard all changes made in form?</p>
//       <div class="dialog__btns" id="dialog__btns">
//         <button class="dialog__confirmation-btn" id="dialog__confirmation-btn" type="button">Yes</button>
//         <button class="dialog__discard-btn" id="dialog__discard-btn" type="button">No</button>
//       </div>
//     </div>
//   `;
//   const closeLms = document.querySelectorAll('#dialog__discard-btn, #dialog__cancel-btn');
//   const confirmationLm = document.getElementById('dialog__confirmation-btn');
//   const discardBtn = document.getElementById('dialog__discard-btn');
//   const dialogDescLm = document.getElementById('dialog__desc');
//   const dialogImgContainer = document.getElementById('dialog__image-container');

//   return { closeLms, confirmationLm, discardBtn, dialogDescLm, dialogImgContainer };
// }

// export function generateEditTodoDialogHTML() {
//   dialogBackdropLm.innerHTML = `
//     <div class="dialog" id="dialog" role="dialog" aria-label="Edit dialog.">
//       <form class="form-dialog" id="form-dialog">
//         <button aria-label="Close dialog." type="button" class="form-dialog__cancel-btn" id="form-dialog__cancel-btn">
//           <span aria-hidden="true" class="material-symbols-outlined">cancel</span>
//         </button>
//         <label for="form-dialog__task">Task</label>
//         <input required class="form-dialog__task" id="form-dialog__task" type="text" name="task">
//         <label for="form-dialog__date">Date</label>
//         <input required class="form-dialog__date" id="form-dialog__date" type="date" name="date">
//         <label for="form-dialog__desc">Description</label>
//         <textarea required class="form-dialog__desc" id="form-dialog__desc" name="description" rows="7"></textarea>
//         <button class="form-dialog__submit-btn" type="submit">Edit todo</button>
//       </form>
//     </div>
//   `;
//   const closeBtn = document.getElementById('form-dialog__cancel-btn');
//   const formDialogLm = document.getElementById('form-dialog');
//   const formInputs = formDialogLm.querySelectorAll('input, textarea');
//   return {closeBtn, formDialogLm, formInputs};
// }

// export function openModal(targetId, todoInfo, closeLms, firstLmToFocus, confirmationLm, confirmFunction) {
//   const clearAllTodosBtn = document.getElementById('todo-app-intro__clear-btn');
//   const formDialogLm = document.getElementById('form-dialog');
//   const alertDialogLm = document.getElementById('dialog');
//   const lastFocusLmBeforeAlertDialog = document.activeElement;

//   document.body.children[2].inert = true;
//   document.body.style.overflow = 'hidden';
//   clearTimeout(closeAlertDialogTim);
//   dialogBackdropLm.style.display = 'flex';
//   firstLmToFocus.focus();
//   if (formDialogLm) {
//     alertDialogLm.classList.add('form-dialog--active');
//   }
//   // The timeout isn't really necessary, as the import delay is enough to activate transitions.
//   setTimeout(() => {
//     dialogBackdropLm.classList.add('dialog-backdrop--active');
//     alertDialogLm.classList.add('dialog--active');
//   });

//   function removeEventsListeners() {
//     if (formDialogLm) {
//       formDialogLm.removeEventListener('submit', editTodo);
//     }
//     document.body.removeEventListener('keydown', closeModalWithEscKey);
//     alertDialogLm.removeEventListener('keydown', trapFocus)
//     dialogBackdropLm.removeEventListener('click', addFunctionsWF);
//   }

//   function closeModal() {
//     removeEventsListeners();
//     document.body.children[2].inert = false;
//     clearAllTodosBtn.classList.remove('todo-app-intro__clear-btn--active');
//     document.body.style.overflow = 'initial';
//     dialogBackdropLm.classList.remove('dialog-backdrop--active');
//     alertDialogLm.classList.remove('dialog--active');
//     closeAlertDialogTim = setTimeout(() => {
//       alertDialogLm.classList.remove('form-dialog--active');
//       dialogBackdropLm.style.display = 'none';
//     }, 250);
//     // Once the confirm edit modal appears. Focus moves to the body, so the if statement tells the browser to focus back the buttonLm.
//     // We need to get the element again because it has just been generated and lastFocusLmBeforeAlertDialog can't target it anymore.
//     if (lastFocusLmBeforeAlertDialog.matches('body') || lastFocusLmBeforeAlertDialog.matches(`#todo__edit-btn-${targetId}`)) {
//       const editTodoBtn = document.getElementById(`todo__edit-btn-${targetId}`);
//       editTodoBtn.focus();
//     } 
//     else {
//       lastFocusLmBeforeAlertDialog.focus();
//     }
//   }

//   function closeEditDialog() {
//     setTimeout(() => {
//       alertDialogLm.classList.remove('form-dialog--active');
//     }, 250)
//     removeEventsListeners();
//     alertDialogLm.classList.remove('dialog--active');
//     // Calling generateEditTodoDialogHTML() already removes the class.
//     alertDialogLm.classList.remove('dialog--edit');
//   }

//   function openConfirmEditDialog() {
//     closeEditDialog()
//     setTimeout(() => {
//       const { closeLms, confirmationLm, discardBtn } = generateConfirmDialogHTML();
//       const alertDialogLm = document.getElementById('dialog');
//       alertDialogLm.classList.add('dialog--edit');
//       openModal(targetId, {formerEdit: todoInfo.formerEdit, currentEdit: getTodoInfo(formDialogLm)}, closeLms, discardBtn, confirmationLm);
//     }, 400)
//   }

//   function closeConfirmEditDialog() {
//     closeEditDialog();
//     setTimeout(() => {
//       const { closeBtn, formInputs } = generateEditTodoDialogHTML();
//       formInputs.forEach((input) => {
//         input.value = todoInfo.currentEdit[input.name];
//       })
//       openModal(targetId, todoInfo, closeBtn, closeBtn);
//     }, 400);
//   }

//   function closeModalWithEscKey(e) {
//     if (e.key === 'Escape') {
//       if (isFormEdited()) {
//         openConfirmEditDialog();
//         return;
//       } 
//       if (alertDialogLm.matches('.dialog--edit')) {
//         closeConfirmEditDialog();
//       } 
//       else {
//         closeModal();
//       }
//     }
//   }

//   function trapFocus(e) {
//     const focusableLms = alertDialogLm.querySelectorAll('a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])');
//     const firstFocusableLm = focusableLms[0]; 
//     const lastFocusableLm = focusableLms[focusableLms.length - 1];

//     const isTabPressed = (e.key === 'Tab');
    
//     if (!isTabPressed) { 
//       return; 
//     }

//     if (e.shiftKey) /* shift + tab */ {
//       if (document.activeElement === firstFocusableLm ) {
//         lastFocusableLm.focus();
//         e.preventDefault();
//       }
//     } 
//     else /* tab */ {
//       if (document.activeElement === lastFocusableLm) {
//         firstFocusableLm.focus();
//         e.preventDefault();
//       }
//     }
//   }

//   function isFormEdited() {
//     if (!formDialogLm) {
//       return 0;
//     }
//     const currentTodoInfo = getTodoInfo(formDialogLm);
//     if (
//       currentTodoInfo.task !== todoInfo.formerEdit.task || 
//       currentTodoInfo.date !== todoInfo.formerEdit.date || 
//       currentTodoInfo.description !== todoInfo.formerEdit.description
//       ) {
//       return true;
//     } 
//     else {
//       return false;
//     }
//   }

//   function addFunctions(e, closeLms, confirmationLm = 1, confirmFunction) {
//     if (e.target.matches('#dialog-backdrop')) {
//       if (isFormEdited()) {
//         openConfirmEditDialog();
//       } 
//       else if (alertDialogLm.matches('.dialog--edit')) {
//         closeConfirmEditDialog();
//       } 
//       else {
//         closeModal();
//       }
//       return;
//     } 
//     else if (e.target.closest('#' + confirmationLm.id)) {
//       closeModal();
//       if (!alertDialogLm.matches('.dialog--edit')) {
//         confirmFunction();
//       }
//       return;
//     } 

//     const fmtdCloseLms = closeLms.length ? closeLms : [closeLms];

//     for (let i = 0; i < fmtdCloseLms.length; i++) {
//       if (e.target.closest('#' + fmtdCloseLms[i].id)) {
//         if (isFormEdited()) {
//           openConfirmEditDialog();
//           break;
//         } 
//         else {
//           if (alertDialogLm.matches('.dialog--edit')) {
//             closeConfirmEditDialog();
//           } 
//           else {
//             closeModal();
//           }
//         }
//         break;
//       }
//     }
//   } 

//   function addFunctionsWF(e) {
//     addFunctions(e, closeLms, confirmationLm, confirmFunction);
//   }

//   function isFormEdited() {
//     const currentTodoInfo = getTodoInfo(formDialogLm);
    
//     if (
//       currentTodoInfo.task !== todoInfo.formerEdit.task || 
//       currentTodoInfo.date !== todoInfo.formerEdit.date || 
//       currentTodoInfo.description !== todoInfo.formerEdit.description
//       ) {
//       return true;
//     } 
//     else {
//       return false;
//     }
//   }

//   function editTodo(e) {
//     e.preventDefault();
//     if (!isFormEdited()) {
//       // form has not been edited
//       closeModal();
//       return;
//     }
//     // form has been edited
//     deleteTodo(targetId);
//     addTodo('unshift', formDialogLm, targetId);
//     closeModal();
//   }

//   function addEventsListeners() {
//     if (formDialogLm) {
//       formDialogLm.addEventListener('submit', editTodo);
//     }
//     // It needs the timeout because the user can also close the addTodoPrompt with 'Escape'. And if there's info in it, it opens the confirmational modal it detects the 'Escape' key pressed and instantly closes the modal.
//     setTimeout(() => {
//       document.body.addEventListener('keydown', closeModalWithEscKey);
//     });
//     dialogBackdropLm.addEventListener('click', addFunctionsWF);
//     alertDialogLm.addEventListener('keydown', trapFocus);
//   }

//   addEventsListeners();
// }

// export function generateConfirmDialogHTML2() {
//   dialogBackdropLm.innerHTML = `
//     <div class="dialog" id="dialog" role="alertdialog" aria-label="Confirm discard changes." aria-describedby="dialog__desc">
//       <div id="dialog__image-container">
//         <img class="dialog__recycle-placeholder-img" src="img/recycle-icons/garbage-collector-${getRandomNumber(1, 6)}.jpg" alt="A drawing of a garbage collector taking out the trash."/>
//       </div>
//       <button aria-label="Close dialog." type="button" class="dialog__cancel-btn" id="dialog__cancel-btn">
//         <span aria-hidden="true" class="material-symbols-outlined">cancel</span>
//       </button>
//       <p class="dialog__desc" id="dialog__desc">Are you sure you want to discard all changes made in form?</p>
//       <div class="dialog__btns" id="dialog__btns">
//         <button class="dialog__confirmation-btn" id="dialog__confirmation-btn" type="button">Yes</button>
//         <button class="dialog__discard-btn" id="dialog__discard-btn" type="button">No</button>
//       </div>
//     </div>
//   `;
//   const confirmationBtn = document.getElementById('dialog__confirmation-btn');
//   const closeBtn = document.getElementById('dialog__cancel-btn')
//   const noBtn = document.getElementById('dialog__discard-btn');
//   const dialogDescLm = document.getElementById('dialog__desc');
//   const dialogImgContainer = document.getElementById('dialog__image-container');

//   return { closeBtn, noBtn, confirmationBtn, dialogDescLm, dialogImgContainer };
// }

// const { closeBtn, noBtn, confirmationBtn, dialogDescLm, dialogImgContainer } = generateConfirmDialogHTML2();

const confrimDialogBackdropLm = document.getElementById('confirm-dialog-backdrop');
const confirmDialogLm = document.getElementById('confirm-dialog');
const confirmDialogImgContainerLm = document.getElementById('confirm-dialog__image-container');
const confirmDialogCloseBtn = document.getElementById('confirm-dialog__close-btn');
const confirmDialogAcceptBtn = document.getElementById('confirm-dialog__accept-btn');
const confirmDialogCancelBtn = document.getElementById('confirm-dialog__cancel-btn');
const confrimDialogDescLm = document.getElementById('confirm-dialog__desc');

const editDialogBackdropLm = document.getElementById('edit-dialog-backdrop');
const editDialogLm = document.getElementById('edit-dialog');
const editDialogCloseBtn = document.getElementById('edit-dialog__close-btn');
const editDialogFormLm = document.getElementById('edit-dialog__form')
const editDialogFormInputLms = editDialogFormLm.querySelectorAll('input, textarea');

const infoDialogBackdropLm = document.getElementById('info-dialog-backdrop');
const infoDialogLm = document.getElementById('info-dialog');
const infoDialogCloseBtn = document.getElementById('info-dialog__close-btn');
const infoDialogAcceptBtn = document.getElementById('info-dialog__accept-btn');
const infoDailogDescLm = document.getElementById('info-dialog__desc');

//TODO Add trapFocus and close at 'Escape' key
//TODO Add a toggleModalEvents that adds the most used modal events
//TODO Refactor all modal to have reusable functions

let closeEditDialogTimId;
let closeInfoDialogTimId;

let lastFocusedLmBeforeModalOpened;

function toggleModalFocus(focusBehaviour, firstFocusableLm) {
  if (focusBehaviour === 'addFocus') {
    lastFocusedLmBeforeModalOpened = document.activeElement;
    firstFocusableLm.focus();
  } 
  else if (focusBehaviour === 'returnFocus') {
    lastFocusedLmBeforeModalOpened.focus();
  }
}


// Event handler function for closing modal on Escape key
const handleModalCloseAtEscapeKey = closeFun => e => {
  if (e.key === 'Escape') closeFun();
};

// Event handler function for closing modal on outside click
const handleModalOutsideClick = (closeFun, matchingClass) => e => {
  if (e.target.matches(matchingClass)) {
    closeFun();
  }
};

// Event handler function for trapping focus within the modal content
const handleTrapFocus = modalContentLm => e => {
  trapFocus(e, modalContentLm);
  console.log('trap focus')
}

// Toggle modal events (add or remove event listeners)
export function toggleModalEvents(eventsHandler, action, closeFun, closeLms, modalContentLm, modalContainerLm, matchingClass) {
  // Create bound event handler functions
  function addEventListeners() {
    const escKeyHandler = handleModalCloseAtEscapeKey(closeFun);
    const outsideClickHandler = handleModalOutsideClick(closeFun, matchingClass);
    const trapFocusHandler = handleTrapFocus(modalContentLm);

    // Add event listeners if elements exist
    document.body.addEventListener('keydown', escKeyHandler);
    modalContentLm?.addEventListener('keydown', trapFocusHandler);
    modalContainerLm?.addEventListener('click', outsideClickHandler);
    closeLms && closeLms.forEach(closeLm => {
      closeLm.addEventListener('click', closeFun);
    })

    // Store handlers on the eventsHandler object to remove them later
    eventsHandler.escKeyHandler = escKeyHandler;
    modalContentLm && (eventsHandler.trapFocusHandler = trapFocusHandler);
    modalContainerLm && (eventsHandler.outsideClickHandler = outsideClickHandler);
    closeLms && (eventsHandler.closeFun = closeFun);
  }

  function removeEventListeners() {
    // Remove event listeners if elements exist
    document.body.removeEventListener('keydown', eventsHandler.escKeyHandler);
    modalContentLm?.removeEventListener('keydown', eventsHandler.trapFocusHandler);
    modalContainerLm?.removeEventListener('click', eventsHandler.outsideClickHandler);
    closeLms && closeLms.forEach(closeLm => {
      closeLm.removeEventListener('click', eventsHandler.closeFun);
    })

    // Clean up stored handlers
    delete eventsHandler.escKeyHandler;
    modalContentLm && delete eventsHandler.trapFocusHandler;
    modalContainerLm && delete eventsHandler.outsideClickHandler;
    closeLms && delete eventsHandler.closeFun;
  }

  if (action === 'add') {
    addEventListeners();
  } 
  else if (action === 'remove') {
    removeEventListeners();
  }
}


export function openInfoDialog(descText) {
  console.log('info dialog opened')
  const eventsHandler = {};
  const closeLms = [ infoDialogCloseBtn, infoDialogAcceptBtn ];
  clearTimeout(closeInfoDialogTimId)

  infoDailogDescLm.innerText = descText;
  infoDialogBackdropLm.style.display = 'flex';
  toggleModalFocus('addFocus', infoDialogCloseBtn);

  infoDialogBackdropLm.style.opacity = 1;
  infoDialogLm.style.transform = 'scale(1)';

  function closeInfoDialog() {
    console.log('info dialog closed')
    infoDialogBackdropLm.style.opacity = 0;
    infoDialogLm.style.transform = 'scale(0)';
    closeInfoDialogTimId = setTimeout(() => {
      infoDialogBackdropLm.style.display = 'none';
      toggleModalFocus('returnFocus');
    }, 250);

    toggleModalEvents(eventsHandler, 'remove', null, closeLms, infoDialogLm, infoDialogBackdropLm);
  }

  toggleModalEvents(eventsHandler, 'add', closeInfoDialog, closeLms, infoDialogLm, infoDialogBackdropLm, '.info-dialog-backdrop');
}

export function openEditDialog(targetId, todoInfo) {
  clearTimeout(closeEditDialogTimId)

  editDialogBackdropLm.style.display = 'flex';
  toggleModalFocus('addFocus', editDialogCloseBtn);

  editDialogBackdropLm.style.opacity = 1;
  editDialogLm.style.transform = 'scale(1)';

  console.log('edit dialog opened')

  function closeEditDialog() {
    editDialogBackdropLm.style.opacity = 0;
    editDialogLm.style.transform = 'scale(0)';
    closeEditDialogTimId = setTimeout(() => {
      editDialogBackdropLm.style.display = 'none';
      toggleModalFocus('returnFocus');
    }, 250);

    editDialogFormLm.removeEventListener('submit', editTodo);
    editDialogBackdropLm.removeEventListener('click', closeDialogAtOutsideClick);
    editDialogCloseBtn.removeEventListener('click', checkCloseEditDialog);
  }



  function closeConfirmEditDialog(targetId, todoInfo) {
    console.log(targetId)
    
    setTimeout(() => {
      openEditDialog(targetId, todoInfo)
    }, 400);
    
    // add current info back again to inputs
    editDialogFormInputLms.forEach(input => {
      input.value = todoInfo.currentEdit[input.name];
    })
  }

  function checkCloseEditDialog() {
    console.log('edit dialog closed')
    console.log(isFormEdited())

    //if form has been edited open the confirm discard changes modal


    if (isFormEdited()) {
      console.log('form has been edited')
      // close edit modal
      closeEditDialog();
      setTimeout(() => {
        openConfirmDialog(closeConfirmEditDialog.bind(null, targetId, { formerEdit: todoInfo.formerEdit, currentEdit: getTodoInfo(editDialogFormLm) }), 'Are you sure that you want to discard the current changes made in form?', false, true)
      }, 400)
      // open confirm modal
    } 
    else {
      closeEditDialog();
    }
    
    //else just close the modal
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
    } 
    // form has not been edited
    else {
      console.log('form has not been edited');
      closeEditDialog();
    }
  }

  function closeDialogAtOutsideClick(e) {
    if (e.target.matches('.edit-dialog-backdrop')) {
      checkCloseEditDialog();
    }
  }

  editDialogFormLm.addEventListener('submit', editTodo);
  editDialogBackdropLm.addEventListener('click', closeDialogAtOutsideClick);
  editDialogCloseBtn.addEventListener('click', checkCloseEditDialog);
}

export function openConfirmDialog(confirmFunction, descText, changeImage) {
  const eventHandler = {};
  const closeLms = [ confirmDialogCloseBtn, confirmDialogCancelBtn ];
  
  if (changeImage) {
    confirmDialogImgContainerLm.innerHTML = '<img class="dialog__capybara-placeholder-img" src="img/cute-animals-drawings/capybara.jpg" alt="A drawing of capybara having a bath in a hot tub with a rubber duck on its head."/>';
  } 
  else {
    confirmDialogImgContainerLm.innerHTML = `<img class="confirm-dialog__recycle-placeholder-img" src="img/recycle-icons/garbage-collector-${getRandomNumber(1, 6)}.jpg" alt="A drawing of a garbage collector taking out the trash."/>`;
  }
  confrimDialogDescLm.innerText = descText;

  // open modal

  confrimDialogBackdropLm.style.display = 'flex';
  toggleModalFocus('addFocus', confirmDialogCloseBtn);

  confrimDialogBackdropLm.style.opacity = 1;
  confirmDialogLm.style.transform = 'scale(1)';

  let closeConfirmDialogTimId;

  function closeConfirmDialog() {
    clearTimeout(closeConfirmDialogTimId);

    // if (isForm && !e.target.matches('.confirm-dialog__accept-btn')) {
    //   confirmFunction();
    // }

    console.log('confirm dialog closed')
    confrimDialogBackdropLm.style.opacity = 0;
    confirmDialogLm.style.transform = 'scale(0)';
    closeConfirmDialogTimId = setTimeout(() => {
      confrimDialogBackdropLm.style.display = 'none';
      toggleModalFocus('returnFocus');
    }, 250);

    toggleModalEvents(eventHandler, 'remove', null, closeLms, confirmDialogLm, confrimDialogBackdropLm);
    confirmDialogAcceptBtn.removeEventListener('click', confirmCloseDialog);
  }

  function confirmCloseDialog() {
    closeConfirmDialog();
    confirmFunction();
  }

  // add events to close modal
  console.log('confirm modal opened')

  toggleModalEvents(eventHandler, 'add', closeConfirmDialog, closeLms, confirmDialogLm, confrimDialogBackdropLm, '.confirm-dialog-backdrop');
  confirmDialogAcceptBtn.addEventListener('click', confirmCloseDialog);
}




function trapFocus(e, element) {
  const focusableLms = element.querySelectorAll('a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])');
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







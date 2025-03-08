import EditModal from "../components/EditModal.js";
import ConfirmDiscardModal from "../components/ConfirmDiscardModal.js";
import ConfirmDeleteAllTasksModal from "../components/ConfirmDeleteAllTasksModal.js";
import ConfirmCompleteTaskModal from "../components/ConfirmCompleteTaskModal.js";
import ConfirmDeleteTaskModal from "../components/ConfirmDeleteTaskModal.js";
import InfoMaxTasksModal from "../components/InfoMaxTasksModal.js";
import InfoEmptyTaskListModal from "../components/InfoEmptyTaskListModal.js";

export default class ModalView {
  constructor(modalHandler, utils) {
    this.modalHandler = modalHandler;
    this.utils = utils;

    this.lms = {};

    this.timIds = {};
    this.lastFocusedLmBeforeModal = null;
  }

  setModalDomRefs() {
    this.lms = {
      infoModalContainerLm: document.getElementById('info-modal-container'),
      infoModalOverlayLm: document.getElementById('info-modal-overlay'),
      infoModalLm: document.getElementById('info-modal'),
      infoModalCloseBtn: document.getElementById('info-modal__close-btn'),
      infoModalAcceptBtn: document.getElementById('info-modal__accept-btn'),
      infoModalDescLm: document.getElementById('info-modal__desc'),
      confirmModalContainerLm: document.getElementById('confirm-modal-container'),
      confirmModalOverlayLm: document.getElementById('confirm-modal-overlay'),
      confirmModalLm: document.getElementById('confirm-modal'),
      confirmModalImgContainerLm: document.getElementById('confirm-modal__image-container'),
      confirmModalCloseBtn: document.getElementById('confirm-modal__close-btn'),
      confirmModalAcceptBtn: document.getElementById('confirm-modal__accept-btn'),
      confirmModalCancelBtn: document.getElementById('confirm-modal__cancel-btn'),
      confirmModalDescLm: document.getElementById('confirm-modal__desc'),
      confirmModalBtnsContainerLm: document.getElementById('confirm-modal__btns-container'),
      confirmModalDeleteActiveBtn: document.getElementById('confirm-modal__delete-active-btn'),
      confirmModalDeleteCompletedBtn: document.getElementById('confirm-modal__delete-completed-btn'),
      confirmModalDeleteOptionsContainerLm: document.getElementById('confirm-modal__delete-options-container'),
      confirmModalInfoMessageLm: document.getElementById('confirm-modal__info-message'),
      editModalContainerLm: document.getElementById('edit-modal-container'),
      editModalOverlayLm: document.getElementById('edit-modal-overlay'),
      editModalLm: document.getElementById('edit-modal'),
      editModalCloseBtn: document.getElementById('edit-modal__close-btn'),
      editModalFormLm: document.getElementById('edit-modal__form'),
      editModalFormSubmitBtn: document.getElementById('edit-modal__submit-btn'),
      editModalTitleErrorLm: document.getElementById('edit-modal__title-error'),
      editModalDueDateErrorLm: document.getElementById('edit-modal__due-date-error'),
      editModalDescErrorLm: document.getElementById('edit-modal__desc-error'),
      editModalErrorLm: document.getElementById('edit-modal__error'),
    };
  }

  showModal(modalOverlayLm, modalContainerLm, modalLm, firstFocusableLm, timId, lastFocusedLmBeforeModal) {
    clearTimeout(timId); // Clear any existing timeout
    document.body.style.overflow = 'hidden'; // Prevent scrolling while modal is open
    modalContainerLm.style.display = 'flex'; // Show the modal container
    this.lastFocusedLmBeforeModal = this.modalHandler.toggleModalFocus('add', firstFocusableLm, lastFocusedLmBeforeModal); // Focus the first element inside the modal
  
    // Added a timeout to ensure the animations always play 
    setTimeout(() => {
      modalContainerLm.style.opacity = 1; // Fade in the modal container
      modalLm.style.transform = 'scale(1)'; // Scale up the modal content
      modalLm.style.opacity = 1; // Fade in the modal content
      modalOverlayLm.style.opacity = 1; // Fade in the overlay
    });
  }

  hideModal(modalOverlayLm, modalContainerLm, modalLm, returnFocus = true) {
    document.body.style.overflow = ''; // Reset body overflow
    modalLm.style.transform = 'scale(0)'; // Scale down the modal content
    modalLm.style.opacity = 0; // Fade out the modal content
    modalOverlayLm.style.opacity = 0; // Fade out the overlay

    if (returnFocus) {
      // Return focus to the last focused element
      this.modalHandler.toggleModalFocus('return', null, this.lastFocusedLmBeforeModal);
    }

    const timId = setTimeout(() => {
      modalContainerLm.style.display = 'none'; // Hide the modal container
    }, 250);
  
    return timId; // Return the timeout ID
  }

  generateInfoModal(modalType) {
    if (this.lms.infoModalContainerLm) {
      this.lms.infoModalContainerLm.remove();
    }

    let infoModalHtml;

    switch (modalType) {
      case 'infoMaxTasks':
        infoModalHtml = InfoMaxTasksModal.getHtml();
        break;
      case 'InfoEmptyTaskList':
        infoModalHtml = InfoEmptyTaskListModal.getHtml();
        break;
    }

    document.body.insertAdjacentHTML('afterbegin', infoModalHtml);
    this.setModalDomRefs();
  }

  generateConfirmModal(modalType) {
    if (this.lms.confirmModalContainerLm) {
      this.lms.confirmModalContainerLm.remove();
    }

    let confirmModalHtml;
    
    switch (modalType) {
      case 'confirmDiscardChanges':
        confirmModalHtml = ConfirmDiscardModal.getHtml();
        break;
      case 'confirmDeleteAllTasks':
        confirmModalHtml = ConfirmDeleteAllTasksModal.getHtml();
        break;
      case 'confirmDeleteTask':
        confirmModalHtml = ConfirmDeleteTaskModal.getHtml();
        break;
      case 'confirmComplete':
        confirmModalHtml = ConfirmCompleteTaskModal.getHtml();
        break;
    }

  document.body.insertAdjacentHTML('afterbegin', confirmModalHtml);
  this.setModalDomRefs();
  }

  generateEditModal() {
    if (this.lms.editModalContainerLm) {
      this.lms.editModalContainerLm.remove();
    }

    const editModal = EditModal.getHtml();
    document.body.insertAdjacentHTML('afterbegin', editModal);
    
    this.setModalDomRefs();
  }

  openInfoModal(confirmHandler, modalType, returnFocus = true) {
    this.generateInfoModal(modalType);

    this.showModal(
      this.lms.infoModalOverlayLm,
      this.lms.infoModalContainerLm,
      this.lms.infoModalLm,
      this.lms.infoModalCloseBtn,
      this.timIds.closeInfoModal
    );

    const closeInfoModal = (returnFocus = true) => {
      this.timIds.closeInfoModal = this.hideModal(
        this.lms.infoModalOverlayLm,
        this.lms.infoModalContainerLm,
        this.lms.infoModalLm,
        returnFocus
      );

      this.lms.infoModalAcceptBtn.removeEventListener('click', confirmAndDismissModal);
      this.modalHandler.removeModalEvents(
        'infoModal',
        this.lms.infoModalContainerLm,
        this.lms.infoModalLm,
        [this.lms.infoModalCloseBtn]
      );
    }

    const confirmAndDismissModal = () => {
      closeInfoModal(returnFocus);
      if (confirmHandler) {
        confirmHandler();
      }
    }

    this.lms.infoModalAcceptBtn.addEventListener('click', confirmAndDismissModal);
    this.modalHandler.addModalEvents(
      'infoModal',
      '.info-modal-overlay',
      this.lms.infoModalContainerLm,
      this.lms.infoModalLm,
      [this.lms.infoModalCloseBtn],
      closeInfoModal
    );
  }

  openConfirmModal(
    confirmHandler, 
    isFetch = false, 
    modalType, 
    isEdit = false, 
    returnFocusAtConfirmHandler = true, 
    taskId
  ) {
    this.generateConfirmModal(modalType);

    const closelms = [
      this.lms.confirmModalCloseBtn, 
      this.lms.confirmModalCancelBtn
    ];
  
    this.showModal(
      this.lms.confirmModalOverlayLm,
      this.lms.confirmModalContainerLm,
      this.lms.confirmModalLm,
      this.lms.confirmModalCloseBtn,
      this.timIds.closeConfirmModal
    );

    const closeConfirmModal = (returnFocus = true) => {
      if (isFetch) {
        clearTimeout(this.timIds.closeConfirmModalAfterFetch);
      }
      
      this.timIds.closeConfirmModal = this.hideModal(
        this.lms.confirmModalOverlayLm,
        this.lms.confirmModalContainerLm,
        this.lms.confirmModalLm,
        returnFocus
      );

      if (isEdit) {
        this.lms.confirmModalAcceptBtn.removeEventListener('click', confirmAndDiscardEdit);
        this.modalHandler.removeModalEvents(
          'confirmModal',
          this.lms.confirmModalContainerLm,
          this.lms.confirmModalLm,
          closelms
        );
      }
      else {
        if (modalType ===  'confirmDeleteAllTasks') {
          this.lms.confirmModalDeleteActiveBtn.removeEventListener('click', deleteAllIncomplete);
          this.lms.confirmModalDeleteCompletedBtn.removeEventListener('click', deleteAllCompleted);
        }

        this.lms.confirmModalAcceptBtn.removeEventListener('click', confirmAndDismissModal)
        this.modalHandler.removeModalEvents(
          'confirmModal',
          this.lms.confirmModalContainerLm,
          this.lms.confirmModalLm,
          closelms
        );
      }
    }

    const deleteAllIncomplete = () => {
      confirmHandler(closeConfirmModal, false);
      if (isFetch === false) {
        closeConfirmModal();
      }
    };

    const deleteAllCompleted = () => {
      confirmHandler(closeConfirmModal, true);
      if (isFetch === false) {
        closeConfirmModal();
      }
    }

    const confirmAndDismissModal = () => {
      if (isFetch) {
        confirmHandler(closeConfirmModal.bind(this, returnFocusAtConfirmHandler));
      } 
      else {
        closeConfirmModal(returnFocusAtConfirmHandler);
        confirmHandler();
      }
    }

    const confirmAndDiscardEdit = () => {
      closeConfirmModal(returnFocusAtConfirmHandler);
      const editTaskBtn = document.getElementById(`task-manager__edit-task-btn-${taskId}`);
      editTaskBtn.focus();
    }

    // Add event listeners

    if (isEdit) {
      this.lms.confirmModalAcceptBtn.addEventListener('click', confirmAndDiscardEdit);
      this.modalHandler.addModalEvents(
        'confirmModal',
        '.confirm-modal-overlay',
        this.lms.confirmModalContainerLm,
        this.lms.confirmModalLm,
        closelms,
        confirmAndDismissModal
      );
    } 
    else {
      if (modalType === 'confirmDeleteAllTasks') {
        this.lms.confirmModalDeleteActiveBtn.addEventListener('click', deleteAllIncomplete);
        this.lms.confirmModalDeleteCompletedBtn.addEventListener('click', deleteAllCompleted);
      }

      this.lms.confirmModalAcceptBtn.addEventListener('click', confirmAndDismissModal);
      this.modalHandler.addModalEvents(
        'confirmModal',
        '.confirm-modal-overlay',
        this.lms.confirmModalContainerLm,
        this.lms.confirmModalLm,
        closelms,
        closeConfirmModal
      );
    }
  }

  openEditModal(
    taskData, 
    editHandler, 
    currentEdit = false,
    taskId, 
    lastFocusedLmBeforeModal
  ) {
    this.generateEditModal();

    const form = this.lms.editModalFormLm;

    // Populates the inputs with task data or current edit
    this.utils.populateFormInputs(form, currentEdit ? currentEdit : taskData);

    this.showModal(
      this.lms.editModalOverlayLm,
      this.lms.editModalContainerLm,
      this.lms.editModalLm,
      this.lms.editModalCloseBtn,
      this.timIds.closeEditModal,
      lastFocusedLmBeforeModal
    );

    const closeEditModal = (returnFocus = true) => {
      this.timIds.closeEditModal = this.hideModal(
        this.lms.editModalOverlayLm,
        this.lms.editModalContainerLm,
        this.lms.editModalLm,
        returnFocus
      );

      this.lms.editModalFormLm.removeEventListener('submit', handleEdit);
      this.modalHandler.removeModalEvents(
        'editModal',
        this.lms.editModalContainerLm,
        this.lms.editModalLm,
        [this.lms.editModalCloseBtn]
      );
    }

    const isFormEdited = () => {
      const currentEditedTask = this.utils.getFormData(this.lms.editModalFormLm);

      return (
        currentEditedTask.title !== taskData.title || 
        currentEditedTask.due_date !== taskData.due_date || 
        currentEditedTask.description !== taskData.description
      );
    }

    const handleEdit = e => {
      e.preventDefault();
      if (isFormEdited()) {
        editHandler(this.utils.getFormData(this.lms.editModalFormLm), closeEditModal.bind(this, false));
      }
      else {
        closeEditModal();
      }
    }

    const exitAndReturnToEdit = () => {
      const editTaskBtn = document.getElementById(`task-manager__edit-task-btn-${taskId}`);
      setTimeout(() => {
        this.openEditModal(
          taskData, 
          editHandler, 
          this.utils.getFormData(this.lms.editModalFormLm),
          taskId, 
          editTaskBtn
        );
      }, 100);
    } 
    
    const handleUnsavedChanges = () => {
      if (isFormEdited()) {
        closeEditModal(false);
        setTimeout(() => {
          this.openConfirmModal(
            exitAndReturnToEdit, 
            false,
            'confirmDiscardChanges',
            true,
            false,
            taskId
          );
        }, 100);
      } 
      else {
        closeEditModal();
      }
    }

    this.lms.editModalFormLm.addEventListener('submit', handleEdit);
    this.modalHandler.addModalEvents(
      'editModal',
      '.edit-modal-overlay',
      this.lms.editModalContainerLm,
      this.lms.editModalLm,
      [this.lms.editModalCloseBtn],
      handleUnsavedChanges
    );
  }

  updateConfirmModalInfoMessage(message, success, error) {
    this.lms.confirmModalBtnsContainerLm.classList.add('hidden');
    this.lms.confirmModalDeleteOptionsContainerLm?.classList.add('hidden');
    this.lms.confirmModalInfoMessageLm.innerText = message
    this.lms.confirmModalInfoMessageLm.classList.add('active');

    if (success) {
      this.lms.confirmModalInfoMessageLm.classList.add('success');
    } 
    else if (error) {
      this.lms.confirmModalInfoMessageLm.classList.add('error');
    }
  }

  updateConfirmModalDeleteMessage(completed, message) {
    if (completed !== null) {
      if (completed === undefined) {
        this.updateConfirmModalInfoMessage('All tasks were successfully deleted.', true);
      } 
      else if (completed === true) {
        this.updateConfirmModalInfoMessage('All completed tasks were successfully deleted.', true);
      } 
      else if (completed === false) {
        this.updateConfirmModalInfoMessage('All active tasks were successfully deleted.', true);
      }
    }

    if (message) {
      this.lms.confirmModalBtnsContainerLm.innerHTML = message;
    }
  }

  updateEditModalSubmitBtn(message) {
    this.lms.editModalFormSubmitBtn.innerText = message;
  }

  renderGeneralEditTaskFormError(error) {
    this.lms.editModalErrorLm.classList.add('active');
    this.lms.editModalErrorLm.innerText = error.message;
  }

  renderEditTaskFormErrors(errors) {
    this.utils.renderFormErrors(errors, {
      title: this.lms.editModalTitleErrorLm,
      due_date: this.lms.editModalDueDateErrorLm,
      description: this.lms.editModalDescErrorLm
    });
  }

  clearEditTaskFormErrors() {
    this.utils.clearFromErrors([
      this.lms.editModalTitleErrorLm,
      this.lms.editModalDueDateErrorLm,
      this.lms.editModalDescErrorLm,
      this.lms.editModalErrorLm
    ]);
  }
}
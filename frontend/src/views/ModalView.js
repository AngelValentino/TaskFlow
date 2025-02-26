import ConfirmModal from "../components/ConfirmModal.js";
import EditModal from "../components/EditModal.js";

export default class ModalView {
  constructor(modalHandler) {
    this.modalHandler = modalHandler;

    this.lms = {};

    this.timIds = {};
    this.lastFocusedLmBeforeModal = null;
  }

  setModalDomRefs() {
    this.lms = {
      confirmModalContainerLm: document.getElementById('confirm-modal-container'),
      confirmModalOverlayLm: document.getElementById('confirm-modal-overlay'),
      confirmModalLm: document.getElementById('confirm-modal'),
      confirmModalImgContainerLm: document.getElementById('confirm-modal__image-container'),
      confirmModalCloseBtn: document.getElementById('confirm-modal__close-btn'),
      confirmModalAcceptBtn: document.getElementById('confirm-modal__accept-btn'),
      confirmModalCancelBtn: document.getElementById('confirm-modal__cancel-btn'),
      confirmModalDescLm: document.getElementById('confirm-modal__desc'),
      confirmModalBtnsContainerLm: document.getElementById('confirm-modal__btns-container'),
      editModalContainerLm: document.getElementById('edit-dialog-container'),
      editModalOverlayLm: document.getElementById('edit-dialog-overlay'),
      editModalLm: document.getElementById('edit-dialog'),
      editModalCloseBtn: document.getElementById('edit-dialog__close-btn'),
      editModalFormLm: document.getElementById('edit-dialog__form'),
      editModalFormSubmitBtn: document.getElementById('edit-dialog__submit-btn')
    };
  }

  showModal(modalOverlayLm, modalContainerLm, modalLm, firstFocusableLm, timId) {
    clearTimeout(timId); // Clear any existing timeout
    document.body.style.overflow = 'hidden'; // Prevent scrolling while modal is open
    modalContainerLm.style.display = 'flex'; // Show the modal container
    this.lastFocusedLmBeforeModal = this.modalHandler.toggleModalFocus('add', firstFocusableLm); // Focus the first element inside the modal
  
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

    const timId = setTimeout(() => {
      modalContainerLm.style.display = 'none'; // Hide the modal container
      if (returnFocus) {
        // Return focus to the last focused element
        this.modalHandler.toggleModalFocus('return', null, this.lastFocusedLmBeforeModal);
      }
    }, 250);
  
    return timId; // Return the timeout ID
  }

  generateConfirmModal(description) {
    if (this.lms.confirmModalContainerLm) {
      this.lms.confirmModalContainerLm.remove();
    }

    const confirmModal = ConfirmModal.getHtml();
    document.body.insertAdjacentHTML('afterbegin', confirmModal);
    
    this.setModalDomRefs();
    this.lms.confirmModalDescLm.innerText = description;
  }

  generateEditModal() {
    if (this.lms.editModalContainerLm) {
      this.lms.editModalContainerLm.remove();
    }

    const editModal = EditModal.getHtml();
    document.body.insertAdjacentHTML('afterbegin', editModal);
    
    this.setModalDomRefs();
  }

  openConfirmModal(confirmHandler, isFetch = false, description, isEdit = false) {
    this.generateConfirmModal(description);

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
        this.lms.confirmModalAcceptBtn.removeEventListener('click', closeConfirmModal)
        this.modalHandler.removeModalEvents(
          'confirmModal',
          this.lms.confirmModalContainerLm,
          this.lms.confirmModalLm,
          closelms
        );
      } 
      else {
        this.lms.confirmModalAcceptBtn.removeEventListener('click', confirmAndDismissModal)
        this.modalHandler.removeModalEvents(
          'confirmModal',
          this.lms.confirmModalContainerLm,
          this.lms.confirmModalLm,
          closelms
        );
      }
    }

    const confirmAndDismissModal = () => {
      if (isFetch) {
        confirmHandler(closeConfirmModal.bind(this, true));
      } 
      else {
        closeConfirmModal();
        confirmHandler();
      }
    }

    // Add event listeners

    if (isEdit) {
      this.lms.confirmModalAcceptBtn.addEventListener('click', closeConfirmModal);
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

  openInfoModal() {
    console.log('open info modal')
  }

  openEditModal(taskData, editHandler, currentEdit = false) {
    this.generateEditModal();

    const form = this.lms.editModalFormLm;

    // Populates the inputs with task data or current edit
    if (currentEdit) {
      for (const key in currentEdit) {
        const field = form.querySelector(`[name="${key}"]`);
        if (currentEdit[key]) {
          field.value = currentEdit[key];
        }
      }
    } 
    else {
      for (const key in taskData) {
        const field = form.querySelector(`[name="${key}"]`);
        if (taskData[key]) {
          field.value = taskData[key];
        }
      }
    }

    this.showModal(
      this.lms.editModalOverlayLm,
      this.lms.editModalContainerLm,
      this.lms.editModalLm,
      this.lms.editModalCloseBtn,
      this.timIds.closeEditModal
    );

    const closeEditModal = () => {
      this.timIds.closeEditModal = this.hideModal(
        this.lms.editModalOverlayLm,
        this.lms.editModalContainerLm,
        this.lms.editModalLm
      );

      this.lms.editModalFormLm.removeEventListener('submit', handleEdit);
      this.modalHandler.removeModalEvents(
        'editModal',
        this.lms.editModalContainerLm,
        this.lms.editModalLm,
        [this.lms.editModalCloseBtn]
      );
    }

    const getFormData = () => {
      const formData = new FormData(this.lms.editModalFormLm);
      const data = {};
  
      formData.forEach((value, key) => {
        data[key] = value;
      });

      return data
    }

    const isFormEdited = () => {
      const currentEditedTask = getFormData();

      console.log(taskData);
      console.log(currentEditedTask);

      return (
        currentEditedTask.title !== taskData.title || 
        currentEditedTask.due_date !== taskData.due_date || 
        currentEditedTask.description !== taskData.description
      );
    }

    const handleEdit = e => {
      e.preventDefault();
      if (isFormEdited()) {
        console.log('submit');
        editHandler(getFormData(), closeEditModal);
      } 
      else {
        console.log('same data');
        closeEditModal();
      }
    }

    const exitAndReturnToEdit = () => {
      setTimeout(() => {
        this.openEditModal(taskData, editHandler, getFormData());
      }, 100);
    } 
    
    const handleUnsavedChanges = () => {
      if (isFormEdited()) {
        closeEditModal();
        setTimeout(() => {
          this.openConfirmModal(
            exitAndReturnToEdit, 
            false,
            'Are you sure that you want to discard the updated task information?',
            true
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
      '.edit-dialog-overlay',
      this.lms.editModalContainerLm,
      this.lms.editModalLm,
      [this.lms.editModalCloseBtn],
      handleUnsavedChanges
    );
  }
}
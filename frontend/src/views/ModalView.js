import ConfirmModal from "../components/ConfirmModal.js";

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
      confirmModalBtnsContainerLm: document.getElementById('confirm-modal__btns-container')
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

  hideModal(modalOverlayLm, modalContainerLm, modalLm, returnFocus) {
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

  openConfirmModal(confirmHandler, isFetch = false, description) {
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

      this.lms.confirmModalAcceptBtn.removeEventListener('click', confirmAndDismissModal)
      this.modalHandler.removeModalEvents(
        'confirmModal',
        this.lms.confirmModalContainerLm,
        this.lms.confirmModalLm,
        closelms
      );
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

  openInfoModal() {
    console.log('open info modal');
  }

  openEditModal() {
    console.log('open edit modal');
  }
}
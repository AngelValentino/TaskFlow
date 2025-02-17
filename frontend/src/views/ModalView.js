export default class ModalView {
  constructor(modalHandler) {
    this.modalHandler = modalHandler;

    this.lms = {
      confirmModalContainerLm: document.getElementById('confirm-dialog-container'),
      confirmModalOverlayLm: document.getElementById('confirm-dialog-overlay'),
      confirmModalLm: document.getElementById('confirm-dialog'),
      confirmModalImgContainerLm: document.getElementById('confirm-dialog__image-container'),
      confirmModalCloseBtn: document.getElementById('confirm-dialog__close-btn'),
      confirmModalAcceptBtn: document.getElementById('confirm-dialog__accept-btn'),
      confirmModalCancelBtn: document.getElementById('confirm-dialog__cancel-btn'),
      confirmModalDescLm: document.getElementById('confirm-dialog__desc')
    }

    this.timIds = {};
    this.lastFocusedLmBeforeModal = null;
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

  hideModal(modalOverlayLm, modalContainerLm, modalLm) {
    document.body.style.overflow = ''; // Reset body overflow
    modalLm.style.transform = 'scale(0)'; // Scale down the modal content
    modalLm.style.opacity = 0; // Fade out the modal content
    modalOverlayLm.style.opacity = 0; // Fade out the overlay

    const timId = setTimeout(() => {
      modalContainerLm.style.display = 'none'; // Hide the modal container
      console.log(this.lastFocusedLmBeforeModal);
      this.modalHandler.toggleModalFocus('return', null, this.lastFocusedLmBeforeModal); // Return focus to the last focused element
    }, 250);
  
    return timId; // Return the timeout ID
  }

  openConfirmModal(confirmHandler) {
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

    const closeConfirmModal = () => {
      this.timIds.closeConfirmModal = this.hideModal(
        this.lms.confirmModalOverlayLm,
        this.lms.confirmModalContainerLm,
        this.lms.confirmModalLm
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
      // TODO Fix return focus bug, because modal close with a timeout, after 250ms foucs escape the prompt button
      // TODO and goes back to the last active element in closed form
      closeConfirmModal();
      confirmHandler();
    }

    // Add event listeners
    this.lms.confirmModalAcceptBtn.addEventListener('click', confirmAndDismissModal);
    this.modalHandler.addModalEvents(
      'confirmModal',
      '.confirm-dialog-overlay',
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
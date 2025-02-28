export default class ConfirmModal {
  static getHtml(
    { 
      description = 'Are you sure you want to discard your changes?',
      isDeleteAllTasksModal = false
    } = {}
  ) {
    const optionalActiveOrCompletedTasksDelete = () => {
      return `
        <div class="confirm-modal__delete-options-container">
          <button id="confirm-modal__delete-incomplete-btn" class="confirm-modal__delete-option-btn">Only delete incomplete tasks</button>
          <button id="confirm-modal__delete-completed-btn" class="confirm-modal__delete-option-btn">Only delete completed taks</button>
        </div>
      `;
    }

    return `
      <div id="confirm-modal-container" class="confirm-modal-container">
        <div class="confirm-modal" id="confirm-modal" role="alertdialog" aria-describedby="confirm-modal__desc">
          <div id="confirm-modal__image-container">
            <img class="confirm-modal__recycle-placeholder-img" src="public/assets/images/recycle/garbage-collector-1.jpg" alt="A drawing of a garbage collector taking out the trash." />
          </div>
          <button title="Close dialog" aria-label="Close modal." type="button" class="confirm-modal__close-btn appear-bg-from-center rounded dark-soft" id="confirm-modal__close-btn">
            <svg aria-hidden="true" focusable="false" role="presentation" class="confirm-modal__close-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 6L6 18M6 6l12 12"></path>
            </svg>
          </button>
          <p class="confirm-modal__desc" id="confirm-modal__desc">${description}</p>
          <div id="confirm-modal__btns-container">
            <button class="confirm-modal__accept-btn" id="confirm-modal__accept-btn" type="button">Yes</button>
            <button class="confirm-modal__cancel-btn" id="confirm-modal__cancel-btn" type="button">No</button>
          </div>
          ${isDeleteAllTasksModal ? optionalActiveOrCompletedTasksDelete() : ''}
        </div>
        <div id="confirm-modal-overlay" class="confirm-modal-overlay"></div>
      </div>    
    `;
  }
}
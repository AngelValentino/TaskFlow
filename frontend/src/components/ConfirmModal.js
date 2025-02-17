export default class ConfirmModal {
  static getHtml() {
    return `
      <div id="confirm-dialog-container" class="confirm-dialog-container">
        <div class="confirm-dialog" id="confirm-dialog" role="alertdialog" aria-describedby="dialog__desc">
          <div id="confirm-dialog__image-container">
            <img class="confirm-dialog__recycle-placeholder-img" src="public/assets/images/recycle/garbage-collector-1.jpg" alt="A drawing of a garbage collector taking out the trash." />
          </div>
          <button title="Close dialog" aria-label="Close dialog." type="button" class="confirm-dialog__close-btn appear-bg-from-center rounded dark-soft" id="confirm-dialog__close-btn">
            <svg aria-hidden="true" focusable="false" role="presentation" class="confirm-dialog__close-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 6L6 18M6 6l12 12"></path>
            </svg>
          </button>
          <p class="confirm-dialog__desc" id="confirm-dialog__desc">Are you sure you want to discard all changes made in form?</p>
          <div class="confirm-dialog__btns">
            <button class="confirm-dialog__accept-btn" id="confirm-dialog__accept-btn" type="button">Yes</button>
            <button class="confirm-dialog__cancel-btn" id="confirm-dialog__cancel-btn" type="button">No</button>
          </div>
        </div>
        <div id="confirm-dialog-overlay" class="confirm-dialog-overlay"></div>
      </div>    
    `;
  }
}
export default class EditModal {
  static getHtml() {
    return `
      <div id="edit-dialog-container" class="edit-dialog-container">
        <div class="edit-dialog form-dialog" id="edit-dialog" role="dialog" aria-label="Edit dialog.">
          <form class="edit-dialog__form" id="edit-dialog__form">
            <button title="Close edit dialog" aria-label="Close edit dialog." type="button" class="edit-dialog__close-btn appear-bg-from-center rounded dark-soft" id="edit-dialog__close-btn">
              <svg aria-hidden="true" focusable="false" role="presentation" class="edit-dialog__close-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 6L6 18M6 6l12 12"></path>
              </svg>
            </button>
            <div class="edit-dialog__task-container">
              <label for="edit-dialog__task">Task</label>
              <input class="edit-dialog__task" id="edit-dialog__task" type="text" name="title">
              <label for="edit-dialog__date">Date</label>
              <input class="edit-dialog__date" id="edit-dialog__date" type="date" name="due_date">
            </div>
            <div class="edit-dialog__desc-container">
              <label for="edit-dialog__desc">Description</label>
              <textarea class="edit-dialog__desc" id="edit-dialog__desc" name="description" rows="7"></textarea>
            </div>
            <button id="edit-dialog__submit-btn" class="edit-dialog__submit-btn slide-button" type="submit">Edit task</button>
          </form>
        </div>
        <div id="edit-dialog-overlay" class="edit-dialog-overlay"></div>
      </div> 
    `;
  }
}
import ThreeDotsLoader from "./ThreeDotsLoader.js";

export default class EditModal {
  static getHtml() {
    const threeDotsLoader = ThreeDotsLoader.getHtml();
    
    return `
      <div id="edit-modal-container" class="edit-modal-container">
        <div class="edit-modal form-modal" id="edit-modal" role="dialog" aria-label="Edit task modal.">
          <form class="edit-modal__form" id="edit-modal__form">
            <button title="Close edit modal" aria-label="Close edit modal." type="button" class="edit-modal__close-btn appear-bg-from-center rounded dark-soft" id="edit-modal__close-btn">
              <svg aria-hidden="true" focusable="false" role="presentation" class="edit-modal__close-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 6L6 18M6 6l12 12"></path>
              </svg>
            </button>
            <div>
              <label for="edit-modal__title-input">Title</label>
              <input class="edit-modal__title-input" id="edit-modal__title-input" type="text" name="title">
              <p id="edit-modal__title-error" class="edit-modal__input-error"></p>
              <label for="edit-modal__due-date-input">Due date</label>
              <input class="edit-modal__due-date-input" id="edit-modal__due-date-input" type="date" name="due_date">
              <p id="edit-modal__due-date-error" class="edit-modal__input-error"></p>
            </div>
            <div>
              <label for="edit-modal__desc-textarea">Description</label>
              <textarea class="edit-modal__desc-textarea" id="edit-modal__desc-textarea" name="description" rows="7"></textarea>
              <p id="edit-modal__desc-error" class="edit-modal__input-error edit-modal__desc-error"></p> 
            </div>
            <p id="edit-modal__error" class="edit-modal__error"></p>
            <button id="edit-modal__submit-btn" class="edit-modal__submit-btn slide-button" type="submit">
              <span id="edit-modal__submit-btn-text" class="edit-modal__submit-btn-text">Edit task</span>
              ${threeDotsLoader}
            </button>
          </form>
        </div>
        <div id="edit-modal-overlay" class="edit-modal-overlay"></div>
      </div> 
    `;
  }
}
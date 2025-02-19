export default class AddTaskPrompt {
  static getHtml() {
    return `
      <div id="task-manager__add-prompt" class="task-manager__add-prompt" role="region" aria-labelledby="task-manager__add-prompt-submit-btn" hidden>
        <form id="task-manager__add-prompt-form" class="task-manager__add-prompt-form">
          <button title="Close prompt" aria-label="Close add new todo prompt." type="button" class="task-manager__add-prompt-close-btn appear-bg-from-center rounded" id="task-manager__add-prompt-close-btn">
            <svg aria-hidden="true" focusable="false" role="presentation" class="task-manager__add-prompt-close-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 6L6 18M6 6l12 12"></path>
            </svg>
          </button>
          <div>
            <label for="task-manager__add-prompt-title-input">Title</label>
            <input type="text" name="title" id="task-manager__add-prompt-title-input" aria-required="true"/>
            <label for="task-manager__add-prompt-date-input">Due date</label>
            <input type="date" name="due_date" id="task-manager__add-prompt-date-input" aria-required="true"/>   
          </div>
          <div>
            <label for="task-manager__add-prompt-desc-textarea">Description</label>
            <textarea name="description" id="task-manager__add-prompt-desc-textarea" rows="7"></textarea>
          </div>
          <button id="task-manager__add-prompt-submit-btn" class="task-manager__add-prompt-submit-btn slide-button" type="submit">Add new task</button>
        </form>
      </div>
    `;
  }
}
export default class AddTaskPrompt {
  static getHtml() {
    return `
      <div id="add-todo-prompt" class="add-todo-prompt" role="region" aria-labelledby="add-todo-prompt__submit-btn" hidden>
        <form id="add-todo-prompt__form" class="add-todo-prompt__form">
          <button title="Close prompt" aria-label="Close add new todo prompt." type="button" class="add-todo-prompt__close-btn appear-bg-from-center rounded" id="add-todo-prompt__close-btn">
            <svg aria-hidden="true" focusable="false" role="presentation" class="add-todo-prompt__close-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 6L6 18M6 6l12 12"></path>
            </svg>
          </button>
          <div>
            <label for="add-todo-prompt__task">Task</label>
            <input required type="text" name="task" id="add-todo-prompt__task" aria-required="true"/>
            <label for="add-todo-prompt__date">Date</label>
            <input required type="date" name="date" id="add-todo-prompt__date" aria-required="true"/>   
          </div>
          <div>
            <label for="add-todo-prompt__desc">Description</label>
            <textarea required name="description" id="add-todo-prompt__desc" rows="7" aria-required="true"></textarea>
          </div>
          <button id="add-todo-prompt__submit-btn" class="add-todo-prompt__submit-btn slide-button" type="submit">Add new todo</button>
        </form>
      </div>
    `;
  }
}
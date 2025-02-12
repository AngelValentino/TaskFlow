export default class SearchTaskPrompt {
  static getHtml() {
    return `
      <div class="search-todo-prompt" id="search-todo-prompt" role="region" aria-label="Seach todo." hidden>
        <div class="search-todo-prompt__container">
          <label class="visually-hidden" for="search-todo-prompt__search-input">Search todo</label>
          <input type="text" name="search-input" id="search-todo-prompt__search-input" class="search-todo-prompt__search-input"/>
          <svg id="search-todo-prompt__search-icon" aria-hidden="true" focusable="false" role="presentation" class="search-todo-prompt__search-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path fill="currentColor" d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/>
          </svg>
          <button id="search-todo-prompt__close-btn" title="Clear search" class="search-todo-prompt__close-btn" aria-label="Clear search input.">
            <svg aria-hidden="true" focusable="false" role="presentation" class="search-todo-prompt__close-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 6L6 18M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
    `;
  }
}
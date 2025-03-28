export default class TaskManagerDashboard {
  static getHtml() {
    return `
      <div class="task-manager__dashboard">
        <div class="task-manager__dashboard-info-container">
          <h3>
            <time aria-label="Current date." class="task-manager__dashboard-date" id="task-manager__dashboard-date"></time>
          </h3>
          <h3 aria-live="polite" class="task-manager__dashboard-tasks-count" id="task-manager__dashboard-tasks-count">-</h3>
          <p id="task-manager__dashboard-tasks-count-error" class="task-manager__dashboard-tasks-count-error"></p>
        </div>
        <ul aria-label="Task manager control buttons." class="task-manager__dashboard-btns-list">
          <li class="task-manager__dashboard-add-btn-container">
            <button title="Add task" class="task-manager__dashboard-btn" id="task-manager__dashboard-add-btn" type="button" aria-label="Add new task." aria-controls="task-manager__add-prompt" aria-expanded="false">
              <svg class="task-manager__dashboard-add-svg" aria-hidden="true" focusable="false" role="presentation" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path fill="currentColor" d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/>
              </svg>
            </button>
          </li>
          <li>
            <button title="Search task" class="task-manager__dashboard-btn" id="task-manager__dashboard-search-btn" aria-label="Search task." type="button" aria-controls="task-manager__search-prompt" aria-expanded="false">
              <svg class="task-manager__dashboard-search-svg" aria-hidden="true" focusable="false" role="presentation" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path fill="currentColor" d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/>
              </svg>
            </button>
          </li>
          <li>
            <button aria-haspopup="dialog" title="Clear all tasks" class="task-manager__dashboard-btn" id="task-manager__dashboard-clear-btn" aria-label="Clear all tasks." type="button">
              <svg class="task-manager__dashboard-clear-svg" aria-hidden="true" focusable="false" role="presentation" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                <path fill="currentColor" d="M566.6 54.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192-34.7-34.7c-4.2-4.2-10-6.6-16-6.6c-12.5 0-22.6 10.1-22.6 22.6v29.1L364.3 320h29.1c12.5 0 22.6-10.1 22.6-22.6c0-6-2.4-11.8-6.6-16l-34.7-34.7 192-192zM341.1 353.4L222.6 234.9c-42.7-3.7-85.2 11.7-115.8 42.3l-8 8C76.5 307.5 64 337.7 64 369.2c0 6.8 7.1 11.2 13.2 8.2l51.1-25.5c5-2.5 9.5 4.1 5.4 7.9L7.3 473.4C2.7 477.6 0 483.6 0 489.9C0 502.1 9.9 512 22.1 512l173.3 0c38.8 0 75.9-15.4 103.4-42.8c30.6-30.6 45.9-73.1 42.3-115.8z"/>
              </svg>
            </button>
          </li>
        </ul>
      </div>
    `;
  }
}
import EnhancedTaskManagerTabs from "./EnhancedTaskManagerTabs.js";

export default class EnhancedTaskManagerNavigation {
  static getHtml() {
    const enhancedTaskManagerTabs = EnhancedTaskManagerTabs.getHtml();

    return `
      <ul class="enhanced-task-manager__nav-list" aria-label="Tasks manager tab sections list.">
        <li>
          ${enhancedTaskManagerTabs}
        </li>
        <li>
          <button title="Search task" class="enhanced-task-manager__search-btn enhanced-task-manager__nav-btn" id="task-manager__dashboard-search-btn" aria-label="Search task." type="button" aria-controls="task-manager__search-prompt" aria-expanded="false">
            <svg class="enhanced-task-manager__search-svg" aria-hidden="true" focusable="false" role="presentation" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path fill="currentColor" d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"></path>
            </svg>
          </button>
        </li>
        <li>
          <button aria-haspopup="dialog" title="Clear all tasks" class="enhanced-task-manager__clear-btn enhanced-task-manager__nav-btn" id="task-manager__dashboard-clear-btn" aria-label="Clear all tasks." type="button">
            <svg class="enhanced-task-manager__dashboard-clear-svg" aria-hidden="true" focusable="false" role="presentation" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
              <path fill="currentColor" d="M566.6 54.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192-34.7-34.7c-4.2-4.2-10-6.6-16-6.6c-12.5 0-22.6 10.1-22.6 22.6v29.1L364.3 320h29.1c12.5 0 22.6-10.1 22.6-22.6c0-6-2.4-11.8-6.6-16l-34.7-34.7 192-192zM341.1 353.4L222.6 234.9c-42.7-3.7-85.2 11.7-115.8 42.3l-8 8C76.5 307.5 64 337.7 64 369.2c0 6.8 7.1 11.2 13.2 8.2l51.1-25.5c5-2.5 9.5 4.1 5.4 7.9L7.3 473.4C2.7 477.6 0 483.6 0 489.9C0 502.1 9.9 512 22.1 512l173.3 0c38.8 0 75.9-15.4 103.4-42.8c30.6-30.6 45.9-73.1 42.3-115.8z"></path>
            </svg>
          </button>
        </li>
        <li class="enhanced-task-manager__scroll-to-top-btn-container">
          <button title="Scroll to top of list" id="task-manger__scroll-to-top-btn" class="enhanced-task-manager__scroll-to-top-btn enhanced-task-manager__nav-btn">
            <svg aria-hidden="true" focusable="false" role="presentation" class="enhanced-task-manager__tab-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path fill="currentColor" d="M15 20H9v-8H4.16L12 4.16L19.84 12H15z"></path>
            </svg>
          </button>
        </li>
      </ul>
    `;
  }
}
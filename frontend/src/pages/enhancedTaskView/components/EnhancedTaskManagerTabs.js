export default class EnhancedTaskManagerTabs {
  static getHtml() {
    return `
      <ul id="task-manager__tab-list" class="enhanced-task-manager__tab-list" role="tablist">
        <li role="presentation" class="enhanced-task-manager__tab-btn-container">
          <button title="Show all tasks" aria-selected="true" aria-expanded="true" role="tab" class="enhanced-task-manager__tab-btn" id="task-manger__all-tasks-tab-btn" aria-label="Ahow all tasks." aria-controls="task-manager__tasks-list-container">
            <svg aria-hidden="true" focusable="false" role="presentation" class="enhanced-task-manager__tab-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path fill="currentColor" d="M17.9 17.39c-.26-.8-1.01-1.39-1.9-1.39h-1v-3a1 1 0 0 0-1-1H8v-2h2a1 1 0 0 0 1-1V7h2a2 2 0 0 0 2-2v-.41a7.984 7.984 0 0 1 2.9 12.8M11 19.93c-3.95-.49-7-3.85-7-7.93c0-.62.08-1.22.21-1.79L9 15v1a2 2 0 0 0 2 2m1-16A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2" />
            </svg>
          </button>
        </li> 
        <li role="presentation" class="enhanced-task-manager__tab-btn-container">
          <button title="Show active tasks" aria-selected="false" aria-expanded="false" role="tab" class="enhanced-task-manager__tab-btn" id="task-manager__active-tasks-tab-btn" aria-label="Show active tasks." aria-controls="task-manager__tasks-list-container">
            <svg aria-hidden="true" focusable="false" role="presentation" class="enhanced-task-manager__tab-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <g fill="none" fill-rule="evenodd">
                <path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z"></path>
                <path fill="currentColor" d="M15 2a2 2 0 0 1 1.732 1H18a2 2 0 0 1 2 2v12a5 5 0 0 1-5 5H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h1.268A2 2 0 0 1 9 2zM7 5H6v15h9a3 3 0 0 0 3-3V5h-1a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2m9.238 4.379a1 1 0 0 1 0 1.414l-4.95 4.95a1 1 0 0 1-1.414 0l-2.12-2.122a1 1 0 0 1 1.413-1.414l1.415 1.414l4.242-4.242a1 1 0 0 1 1.414 0M15 4H9v1h6z"></path>
              </g>
            </svg>
          </button>
        </li>
        <li role="presentation" class="enhanced-task-manager__tab-btn-container">
          <button title="Show completed tasks" aria-selected="false" aria-expanded="false" role="tab" class="enhanced-task-manager__tab-btn" id="task-manger__completed-tasks-tab-btn" aria-label="Show completed tasks." aria-controls="task-manager__tasks-list-container">
            <svg aria-hidden="true" focusable="false" role="presentation" class="enhanced-task-manager__tab-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <g fill="none" fill-rule="evenodd">
                <path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z"></path>
                <path fill="currentColor" d="M15 2a2 2 0 0 1 1.732 1H18a2 2 0 0 1 2 2v12a5 5 0 0 1-5 5H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h1.268A2 2 0 0 1 9 2zm-.176 7.379l-4.242 4.243l-1.415-1.415a1 1 0 0 0-1.414 1.414l2.05 2.051a1.1 1.1 0 0 0 1.556 0l4.88-4.879a1 1 0 1 0-1.415-1.414M14.5 4h-5a.5.5 0 0 0-.492.41L9 4.5v1a.5.5 0 0 0 .41.492L9.5 6h5a.5.5 0 0 0 .492-.41L15 5.5v-1a.5.5 0 0 0-.41-.492z"></path>
              </g>
            </svg>
          </button>
        </li>
      </ul>
    `;
  }
}
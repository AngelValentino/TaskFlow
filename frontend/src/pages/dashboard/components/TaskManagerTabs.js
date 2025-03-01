export default class TaskManagerTabs {
  static getHtml() {
    return `
      <ul aria-label="Tasks manager tab sections list.">
        <li class="task-manager__tab-btn-container">
          <h3 class="task-manager__tab-btn-header">
            <button class="task-manager__tab-btn appear-bg-from-center dark rounded" id="task-manger__all-tasks-tab-btn" type="button" aria-expanded="false" aria-label="Ahow all tasks." aria-controls="task-manager__tasks-list">
              All
            </button>
          </h3>
        </li> 
        <li class="task-manager__tab-btn-container">
          <h3 class="task-manager__tab-btn-header">
            <button class="task-manager__tab-btn appear-bg-from-center dark rounded" id="task-manager__active-tasks-tab-btn" type="button" aria-expanded="false" aria-label="Show active tasks." aria-controls="task-manager__tasks-list">
              Tasks
            </button>
          </h3>
        </li>
        <li class="task-manager__tab-btn-container">
          <h3 class="task-manager__tab-btn-header">
            <button class="task-manager__tab-btn appear-bg-from-center dark rounded" id="task-manger__completed-tasks-tab-btn" type="button" aria-expanded="false" aria-label="Show completed tasks." aria-controls="task-manager__tasks-list">
              Completed
            </button>
          </h3>
        </li>
      </ul>
    `;
  }
}
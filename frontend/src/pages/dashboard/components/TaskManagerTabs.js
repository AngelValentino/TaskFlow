export default class TaskManagerTabs {
  static getHtml() {
    return `
      <ul id="task-manager__tab-list" role="tablist" aria-label="Tasks manager tab sections list.">
        <li role="presentation" class="task-manager__tab-btn-container">
          <button aria-selected="false" aria-expanded="false" role="tab" class="task-manager__tab-btn appear-bg-from-center dark rounded" id="task-manger__all-tasks-tab-btn" aria-expanded="false" aria-label="Ahow all tasks." aria-controls="task-manager__task-list-container">
            All
          </button>
        </li> 
        <li role="presentation" class="task-manager__tab-btn-container">
          <button aria-selected="false" aria-expanded="false" role="tab" class="task-manager__tab-btn appear-bg-from-center dark rounded" id="task-manager__active-tasks-tab-btn" aria-expanded="false" aria-label="Show active tasks." aria-controls="task-manager__task-list-container">
            Tasks
          </button>
        </li>
        <li role="presentation" class="task-manager__tab-btn-container">
          <button aria-selected="false" aria-expanded="false" role="tab" class="task-manager__tab-btn appear-bg-from-center dark rounded" id="task-manger__completed-tasks-tab-btn" aria-expanded="false" aria-label="Show completed tasks." aria-controls="task-manager__task-list-container">
            Completed
          </button>
        </li>
      </ul>
    `;
  }
}
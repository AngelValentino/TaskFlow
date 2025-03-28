import TaskManagerTabs from "./TaskManagerTabs.js";
import AddTaskPrompt from "./AddTaskPrompt.js";
import SearchTaskPrompt from "./SearchTaskPrompt.js";
import TaskManagerDashboard from "./TaskManagerDashboard.js";

export default class TaskManager {
  static getHtml() {
    const taskManagerTabs = TaskManagerTabs.getHtml();
    const taskManagerDashboard = TaskManagerDashboard.getHtml();
    const addTaskPrompt = AddTaskPrompt.getHtml();
    const searchTaskPrompt = SearchTaskPrompt.getHtml();

    return `
      <article role="region" aria-label="task management widget." id="task-manager" class="task-manager">
        <h2 class="visually-hidden">Task manager</h2>
        <div class="task-manager__dashboard-container">
          ${taskManagerDashboard}
          ${addTaskPrompt}
          ${searchTaskPrompt}
        </div>
        <nav id="task-manager__tabs-nav" class="task-manager__tabs-nav">
          ${taskManagerTabs}
          <button title="Scroll to top of list." id="task-manger__scroll-to-top-btn" class="task-manger__scroll-to-top-btn">
            <svg aria-hidden="true" focusable="false" role="presentation" class="task-manager__scroll-to-top-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path fill="currentColor" d="M15 20H9v-8H4.16L12 4.16L19.84 12H15z" />
            </svg>
          </button>
        </nav>
        <ul aria-live="polite" role="tabpanel" aria-atomic="false" aria-label="Tasks list." id="task-manager__tasks-list" class="task-manager__tasks-list">
        </ul>
      </article>
    `;
  }
}
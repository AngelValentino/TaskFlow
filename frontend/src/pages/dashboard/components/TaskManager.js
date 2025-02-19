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
      <article role="region" aria-label="Todo task management widget." id="task-manager" class="task-manager">
        <h2 class="visually-hidden">Task manager</h2>
        <div class="task-manager__dashboard-container">
          ${taskManagerDashboard}
          ${addTaskPrompt}
          ${searchTaskPrompt}
        </div>
        <nav id="todo-sections" class="todo-sections">
          ${taskManagerTabs}
          <button title="Scroll to top" id="todo-sections__scroll-to-top-btn" class="todo-sections__scroll-to-top-btn">
            <svg aria-hidden="true" focusable="false" role="presentation" class="todo-sections__scroll-to-top-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path fill="currentColor" d="M15 20H9v-8H4.16L12 4.16L19.84 12H15z" />
            </svg>
          </button>
        </nav>
        <ul aria-live="polite" aria-atomic="false" aria-label="Todos list." id="todos-container" class="todos-container">
        </ul>
      </article>
    `;
  }
}
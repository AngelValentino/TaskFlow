import TaskManagerControlls from "./TaskManagerControls.js";
import TaskManagerTabs from "./TaskManagerTabs.js";

export default class TaskManager {
  static getHtml() {
    const taskManagerControlls = TaskManagerControlls.getHtml();
    const taskManagerTabs = TaskManagerTabs.getHtml();

    return `
      <article role="region" aria-label="Todo task management widget." id="todo-app" class="todo-app">
        <h2 class="visually-hidden">Task manager</h2>
        <div class="todo-app-controls-container">
          ${taskManagerControlls}
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
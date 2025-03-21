export default class TasksListLoader {
  static getHtml() {
    return `
      <li class="task-manager__list-loader-container">
        <div class="loading-circle">
        </div>
      </li>
    `;
  }
}
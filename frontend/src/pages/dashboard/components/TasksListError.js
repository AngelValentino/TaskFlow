export default class TasksListError {
  static getHtml(error) {
    return `
      <li class="task-manager__list-error-container">
        <p class="task-manager__list-error">${error}</p>
      </li>
    `;
  }
}
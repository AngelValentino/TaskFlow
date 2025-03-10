export default class EmptyTasksListPlaceholder {
  static getHtml() {
    return `
      <li class="task-manager__empty-list-placeholder-container">
        <img id="task-manager__empty-list-placeholder-img" class="task-manager__empty-list-placeholder-img" src="public/assets/images/drawings/no-tasks-found-placeholder.png" alt="Drawing of a capybara, with an orange on its head, riding another capybara that at the same time is riding a crocodile">
      </li>
    `;
  }
}
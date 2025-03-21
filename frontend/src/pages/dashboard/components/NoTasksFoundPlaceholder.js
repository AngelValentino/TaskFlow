export default class NoTasksFoundPlaceholder {
  static getHtml() {
    return `
      <li class="task-manager__empty-list-placeholder-container">
        <div style="background-image: url('public/assets/images/drawings/no-tasks-found-placeholder-low-res.jpg" class="task-manager__empty-list-placeholder-img-container blur-img-loader">
          <img id="task-manager__empty-list-placeholder-img" class="task-manager__empty-list-placeholder-img" src="public/assets/images/drawings/no-tasks-found-placeholder.jpg" alt="Drawing of a capybara, with an orange on its head, riding another capybara that at the same time is riding a crocodile">
        </div>
      </li>
    `;
  }
}
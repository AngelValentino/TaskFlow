export default class TaskManagerTabs {
  static getHtml() {
    return `
      <ul aria-label="Todo section tabs." class="todo-sections__btn-list">
        <li class="todo-sections__btn-container">
          <h3 class="todo-sections__header">
            <button class="todo-sections__btn todo-sections__all-btn appear-bg-from-center dark rounded" id="todo-sections__all-btn" type="button" aria-expanded="false" aria-label="All todos." aria-controls="todos-container">
              All
            </button>
          </h3>
        </li> 
        <li class="todo-sections__btn-container">
          <h3 class="todo-sections__header">
            <button class="todo-sections__btn todo-sections__tasks-btn appear-bg-from-center dark rounded" id="todo-sections__tasks-btn" type="button" aria-expanded="false" aria-label="Uncompleted tasks." aria-controls="todos-container">
              Tasks
            </button>
          </h3>
        </li>
        <li class="todo-sections__btn-container">
          <h3 class="todo-sections__header">
            <button class="todo-sections__btn todo-sections__completed-btn appear-bg-from-center dark rounded" id="todo-sections__completed-btn" type="button" aria-expanded="false" aria-label="Completed tasks." aria-controls="todos-container">
              Completed
            </button>
          </h3>
        </li>
      </ul>
    `;
  }
}
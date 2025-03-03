export default class CompletedTask {
  static getHtml(task) {
    return `
      <li aria-checked="true" id="task-manager__task-${task.id}" aria-label="Completed task." class="task-manager__task completed">
        <h4 aria-label="Task title." class="task-manager__task-title">${task.title}</h4>
        <time class="task-manger__task-due-date" aria-label="Task due date." datetime="${task.due_date}">Due to ${task.due_date}</time>
        ${task.description === null ? '' : `<p class="task-manager__task-desc">${task.description}</p>`}
        <div class="task-manager__control-btn-container">
          <button title="Delete completed task" class="task-manager__delete-task-btn appear-bg-from-center rounded light" aria-label="Delete completed task." type="button">
            <svg aria-hidden="true" focusable="false" role="presentation" class="task-manager__delete-task-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <g fill="none">
                <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                <path fill="currentColor" d="M14.28 2a2 2 0 0 1 1.897 1.368L16.72 5H20a1 1 0 1 1 0 2l-.003.071l-.867 12.143A3 3 0 0 1 16.138 22H7.862a3 3 0 0 1-2.992-2.786L4.003 7.07L4 7a1 1 0 0 1 0-2h3.28l.543-1.632A2 2 0 0 1 9.721 2zm3.717 5H6.003l.862 12.071a1 1 0 0 0 .997.929h8.276a1 1 0 0 0 .997-.929zM10 10a1 1 0 0 1 .993.883L11 11v5a1 1 0 0 1-1.993.117L9 16v-5a1 1 0 0 1 1-1m4 0a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0v-5a1 1 0 0 1 1-1m.28-6H9.72l-.333 1h5.226z" />
              </g>
            </svg>
          </button>
        </div>
      </li>
    `;
  }
}
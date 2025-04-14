export default class TaskListPlaceholder {
  static getHtml(
    {
      search = false,
      enhacedTaskView = false
    } = {}
  ) {
    const placeholderBlurImgFileName = search 
      ? 'no-tasks-found-placeholder-low-res.jpg'
      : 'empty-task-list-placeholder-low-res.jpg';
    const placeholderImgFileName = search
      ? 'no-tasks-found-placeholder.jpg'
      : 'empty-task-list-placeholder.jpg';

    const placeholder = enhacedTaskView 
      ? 
        `
          <div class="enhanced-task-manager__placeholder-img-container">
            <div style="background-image: url('assets/images/drawings/${placeholderBlurImgFileName}')" class="task-manager__empty-list-placeholder-img-container blur-img-loader${enhacedTaskView ? ' enhanced-task-manager__empty-list-placeholder-img-container' : ''}">
              <img id="task-manager__empty-list-placeholder-img" class="task-manager__empty-list-placeholder-img" src="assets/images/drawings/${placeholderImgFileName}" alt="Drawing of a capybara, with an orange on its head, riding another capybara that at the same time is riding a crocodile.">
            </div>
          </div>
        `
      :
        `
          <div style="background-image: url('assets/images/drawings/${placeholderBlurImgFileName}')" class="task-manager__empty-list-placeholder-img-container blur-img-loader${enhacedTaskView ? ' enhanced-task-manager__empty-list-placeholder-img-container' : ''}">
            <img id="task-manager__empty-list-placeholder-img" class="task-manager__empty-list-placeholder-img" src="assets/images/drawings/${placeholderImgFileName}" alt="Drawing of a capybara, with an orange on its head, riding another capybara that at the same time is riding a crocodile.">
          </div>
        `;
    

    return `
      <li class="task-manager__empty-list-placeholder-container${enhacedTaskView ? ' enhanced-task-manager__empty-list-placeholder-container' : ''}">
        ${placeholder}
      </li>
    `;
  }
}
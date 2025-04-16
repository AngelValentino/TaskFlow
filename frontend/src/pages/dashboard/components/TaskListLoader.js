import LoadingCircle from "../../../components/LoadingCircle.js";

export default class TaskListLoader {
  static getHtml(
    {
      isEnhacedTaskView = false
    } = {}
  ) {
    const loadingCircle = LoadingCircle.getHtml('large');

    return `
      <li class="task-manager__list-loader-container${isEnhacedTaskView ? ' enhanced-task-manager__list-loader-container' : ''}">
        ${loadingCircle}
      </li>
    `;
  }
}
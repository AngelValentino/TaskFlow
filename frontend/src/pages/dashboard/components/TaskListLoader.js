import LoadingCircle from "../../../components/LoadingCircle.js";

export default class TaskListLoader {
  static getHtml() {
    const loadingCircle = LoadingCircle.getHtml('large');

    return `
      <li class="task-manager__list-loader-container">
        ${loadingCircle}
      </li>
    `;
  }
}
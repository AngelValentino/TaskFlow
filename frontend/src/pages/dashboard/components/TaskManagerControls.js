import AddTaskPrompt from "./AddTaskPrompt.js";
import SearchTaskPrompt from "./SearchTaskPrompt.js";
import TaskManagerDashboard from "./TaskManagerDashboard.js";

export default class TaskManagerControlls {  
  static getHtml() {
    const taskManagerDashboard = TaskManagerDashboard.getHtml();
    const addTaskPrompt = AddTaskPrompt.getHtml();
    const searchTaskPrompt = SearchTaskPrompt.getHtml();

    return `
      <div class="todo-app-controls-container">
        ${taskManagerDashboard}
        ${addTaskPrompt}
        ${searchTaskPrompt}
      </div>      
    `;
  }
}
import Header from "../../layouts/Header.js";
import EnhancedTaskManagerNavigation from "./components/EnhancedTaskManagerNavigation.js";
import SearchTaskPrompt from "../dashboard/components/SearchTaskPrompt.js";

export default class EnhancedTaskView {
  static getHtml() {
    const header = Header.getHtml({ returnBackHome: true, taskCount: true });
    const enhancedTaskManagerNavigation = EnhancedTaskManagerNavigation.getHtml();
    const searchTaskPrompt = SearchTaskPrompt.getHtml({ isEnhancedTaskManager: true });
    
    return `
      ${header}
      <main class="enhanced-task-view">
        <div class="enhanced-task-mananger-container">
          <article class="enhanced-task-manager" id="task-manager">
            <nav id="task-manager__tabs-nav" class="enhanced-task-manager__tabs-nav"> 
              ${enhancedTaskManagerNavigation}
            </nav>
            <div role="tabpanel" id="task-manager__tasks-list-container" class="enhanced-task-manager__task-list-container">
              ${searchTaskPrompt}
              <ul aria-live="polite" aria-atomic="false" aria-label="Tasks list." id="task-manager__tasks-list" class="enhanced-task-manager__task-list">
              </ul>
            </div>
          </article>
        </div>
      </main>
    `;
  }
}
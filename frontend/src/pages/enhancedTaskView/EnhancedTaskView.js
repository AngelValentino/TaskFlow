import Header from "../../layouts/Header.js";
import EnhancedTaskManagerTabs from "./components/EnhancedTaskManagerTabs.js";

export default class EnhancedTaskView {
  static getHtml() {
    const header = Header.getHtml({ returnBackHome: true, taskCount: true });
    const enhancedTaskManagerTabs = EnhancedTaskManagerTabs.getHtml();
    
    return `
      ${header}
      <main class="enhanced-task-view">
        <div class="enhanced-task-mananger-container">
          <article class="enhanced-task-manager">
            <label class="visually-hidden" for="task-manager__search-prompt-input">Search task</label>
            <input placeholder="Search task" type="text" name="search-input" id="task-manager__search-prompt-input" class="enhanced-task-manager__search-prompt-input">
            <nav id="task-manager__tabs-nav" class="enhanced-task-manager__tabs-nav"> 
              ${enhancedTaskManagerTabs}
            </nav>
            <div role="tabpanel" id="task-manager__tasks-list-container" class="enhanced-task-manager__tasks-list-container">
              <ul aria-live="polite" aria-atomic="false" aria-label="Tasks list." id="task-manager__tasks-list" class="enhanced-task-manager__task-list">
              </ul>
            </div>
          </article>
        </div>
      </main>
    `;
  }
}
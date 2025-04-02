import Header from "../../layouts/Header.js";

export default class EnhancedTaskView {
  static getHtml() {
    const header = Header.getHtml();
    
    return `
      ${header}
      <main class="enhanced task view">
        tasks view
      </main>
    `;
  }
}
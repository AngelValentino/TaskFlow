import Header from "../../layouts/Header.js";
import PomodoroTimer from "./components/PomodoroTimer.js";
import QuoteMachine from "./components/QuoteMachine.js";
import TaskManager from "./components/TaskManager.js";

export default class DashboardPage {
  static getHtml() {
    const header = Header.getHtml();
    const pomodoroTimer = PomodoroTimer.getHtml();
    const quoteMchine = QuoteMachine.getHtml();
    const taskManager = TaskManager.getHtml();

    return `
      ${header}
      <div id="background-image" class="background-image"></div>
      <main class="dashboard">
        <h1 class="visually-hidden">
          TaskFlow, Your go-to app for effortless productivity.
        </h1>
        <ul aria-label="Productivity widgets list." class="widgets-list">
          <div role="presentation" class="timer-quote-container">
            <li>
              ${pomodoroTimer}
            </li>
            <li>
              ${quoteMchine}
            </li>
          </div>
          <li class="task-manager-container">
            ${taskManager}
          </li>
        </ul>
      </main>
    `;
  }
}
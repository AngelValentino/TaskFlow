import Header from "../../layouts/Header.js";
import PomodoroTimer from "./components/PomodoroTimer.js";
import QuoteMachine from "./components/QuoteMachine.js";
import TaskManager from "./components/TaskManager.js";
import '../../styles/dashboard.css';

export default class DashboardPage {
  static getHtml() {
    const header = Header.getHtml();
    const pomodoroTimer = PomodoroTimer.getHtml();
    const quoteMchine = QuoteMachine.getHtml();
    const taskManager = TaskManager.getHtml();

    return `
      ${header}
      <main class="dashboard-view">
        <h1 class="visually-hidden">
          TaskFlow, Your go-to app for effortless productivity.
        </h1>
        <ul aria-label="Productivity widgets list." class="widgets-list">
          <li class="timer-quote-container">
            <ul>
              <li>
                ${pomodoroTimer}
              </li>
              <li>
                ${quoteMchine}
              </li>
            </ul>
          </li>
          <li class="task-manager-container">
            ${taskManager}
          </li>
        </ul>
      </main>
    `;
  }
}
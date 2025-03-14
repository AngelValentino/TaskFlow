export default class PomodoroTimerController {
  constructor(pomodroTimerView, taskManagerView) {
    this.pomodoroTimerView = pomodroTimerView;
    this.lms = this.pomodoroTimerView.getDomRefs();
    this.taskManagerView = taskManagerView;

    this.pomodoroTimerView.updateTimerDisplay();

    this.lms.actionBtn.addEventListener('click', this.toggleTimer.bind(this));
    this.lms.resetBtn.addEventListener('click', this.handleRestartTimer.bind(this));
  }

  toggleTimer() {
    // If the timer is currently running or add todo form is edited, exit the function
    if (this.pomodoroTimerView.isTimer || this.taskManagerView.isAddTaskFormEdited()) return; 

    // If there's no active interval (timer is not running)
    if (!this.pomodoroTimerView.interval) {
      // Check if the current phase is rest
      if (this.pomodoroTimerView.isRest) {
        // Start the rest timer
        this.pomodoroTimerView.startTimer('rest');
      } 
      else {
        // Start the work timer
        this.pomodoroTimerView.startTimer('work');
      }
    } 
    else {
      // If the timer is running, stop the timer
      this.pomodoroTimerView.stopTimer();
    }
  }

  handleRestartTimer() {
    /* If the timer is currently running or the remaining seconds are equal to the work time 
    or add todo form is edited, exit the function */
    if (
      this.pomodoroTimerView.isTimer || 
      this.pomodoroTimerView.remainingSeconds === this.pomodoroTimerView.workTime || 
      this.taskManagerView.isAddTaskFormEdited()
    ) return;

    // Reset to the work phase
    this.pomodoroTimerView.isRest = false;
    // Restart the timer with the work time
    this.pomodoroTimerView.restartTimer(this.pomodoroTimerView.workTime);
  }
}
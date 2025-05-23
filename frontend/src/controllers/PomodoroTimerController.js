export default class PomodoroTimerController {
  constructor(pomodroTimerView, taskManagerView, timerModel) {
    this.pomodoroTimerView = pomodroTimerView;
    this.taskManagerView = taskManagerView;
    this.timerModel = timerModel;
    this.lms = this.pomodoroTimerView.getDomRefs();
  }

  init() {
    this.setTimerSession(localStorage.getItem('pomodoroTimerSession') || 'short', true);
    this.pomodoroTimerView.updateTimerDisplay(this.timerModel.getTimerSeconds());
    this.lms.actionBtn.addEventListener('click', this.toggleTimer.bind(this));
    this.lms.resetBtn.addEventListener('click', this.handleRestartTimer.bind(this));
    this.lms.timerOptionsLm.addEventListener('click', this.switchTimerSession.bind(this));
  }

  setTimerSession(session, ignoreNotice) {
    session === 'long' ? this.pomodoroTimerView.setLongSessionBtnActive() : this.pomodoroTimerView.setShortSessionBtnActive();
    this.timerModel.restartTimer(false, session, ignoreNotice);
  }

  switchTimerSession(e) {   
    // If reset animation is ACTIVE or add task form inputs have been filled, exit the function
    if (
      this.timerModel.isResetAnimationActive() || 
      this.taskManagerView.isAddTaskFormEdited()
    ) {
      return;
    }

    const target = e.target.closest('.pomodoro-timer__long-session-btn') || e.target.closest('.pomodoro-timer__short-session-btn');
    if (!target) return;

    const isLongSessionBtn = target.classList.contains('pomodoro-timer__long-session-btn');
    const isShortSessionBtn = target.classList.contains('pomodoro-timer__short-session-btn');
    const isActive = target.classList.contains('active');

    if (!isActive) {
      if (isLongSessionBtn) {
        this.setTimerSession('long');
      } 
      else if (isShortSessionBtn) {
        this.setTimerSession('short');
      }
    } 
  }

  toggleTimer() {
    // If the timer is currently running or add task form is edited, exit the function
    if (
      this.timerModel.isResetAnimationActive() || 
      this.taskManagerView.isAddTaskFormEdited()
    ) {
      return;
    }

    if (this.timerModel.isTimerRunning()) {
      this.timerModel.stopTimer();
    } 
    else {
      this.timerModel.startTimer();
    }
  }

  handleRestartTimer() {
    /* If the timer is currently running, the remaining seconds are equal to the work time 
    or add task form is edited, exit the function */
    if (
      this.timerModel.isResetAnimationActive() || 
      this.taskManagerView.isAddTaskFormEdited() ||
      this.timerModel.isInitialTime()
    ) {
      return;
    }

    this.timerModel.restartTimer(false);
  }
}
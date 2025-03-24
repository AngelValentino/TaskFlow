export default class PomodoroTimerController {
  constructor(pomodroTimerView, taskManagerView, timerModel) {
    this.pomodoroTimerView = pomodroTimerView;
    this.taskManagerView = taskManagerView;
    this.timerModel = timerModel;
    this.lms = this.pomodoroTimerView.getDomRefs();

    this.pomodoroTimerView.updateTimerDisplay(this.timerModel.getTimerSeconds());

    this.lms.actionBtn.addEventListener('click', this.toggleTimer.bind(this));
    this.lms.resetBtn.addEventListener('click', this.handleRestartTimer.bind(this));
  }

  toggleTimer() {
    // If the timer is currently running or add todo form is edited, exit the function
    if (
      this.timerModel.isResetAnimationActive() || 
      this.taskManagerView.isAddTaskFormEdited()
    ) {
      console.log('reset animation is ACTIVE or add task form is filled')
      return;
    }

    if (this.timerModel.isTimerRunning()) {
      console.log('timer is running, stop time')
      this.timerModel.stopTimer();
    } 
    else {
      console.log('start time')
      this.timerModel.startTimer();
    }
  }

  handleRestartTimer() {
    /* If the timer is currently running or the remaining seconds are equal to the work time 
    or add todo form is edited, exit the function */
    if (
      this.timerModel.isResetAnimationActive() || 
      this.taskManagerView.isAddTaskFormEdited() ||
      this.timerModel.isInitialTime()
    ) {
      console.log('reset animation is ACTIVE, add task form is filled or timer SOCONDS === WORKTIME')
      return;
    }

    this.timerModel.restartTimer(false);
  }
}
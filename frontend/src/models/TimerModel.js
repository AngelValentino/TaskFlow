export default class TimerModel {
  constructor(pomodoroTimerView, utils) {
    this.utils = utils;
    this.restTime = 10 * 60;
    this.workTime = 45 * 60;
    this.time = this.workTime;
    this.pomodoroTimerView = pomodoroTimerView;

    this.alarmClock = new Audio('/public/assets/audios/alarm-clock.mp3');
    this.alarmClockTicking = new Audio('/public/assets/audios/alarm-clock-ticking.mp3');
    // Set preload attribute to auto, preload when the browser sees fit
    this.alarmClock.preload = 'auto';
    this.alarmClockTicking.preload = 'auto';
    // Force immediate loading
    this.alarmClock.load();
    this.alarmClockTicking.load();

    this.interval = null;
    this.isWork = true;
    this.isRest = false;
    this.isResetAnimation = false;
  }

  getTimerSeconds() {
    return this.time;
  }

  isInitialTime() {
    return this.time === this.workTime;
  }

  isTimerRunning() {
    return this.interval;
  }

  isResetAnimationActive() {
    return this.isResetAnimation;
  }

  startTickingSound() {
    if (!this.utils.isSoundPlaying(this.alarmClockTicking)) {
      this.utils.playSound(this.alarmClockTicking);
    } 
  }

  stopTickingSound() {
    if (this.utils.isSoundPlaying(this.alarmClockTicking)) {
      this.utils.stopSound(this.alarmClockTicking);
    }
  }

  startAlarmSound() {
    if (!this.utils.isSoundPlaying(this.alarmClock)) {
      this.utils.playSound(this.alarmClock);
    } 
  }

  stopAlarmSound() {
    if (this.utils.isSoundPlaying(this.alarmClock)) {
      this.utils.stopSound(this.alarmClock);
    }
  }

  startTickingAtCountdown() {
    if (this.time <= 10) {
      this.startTickingSound();
    }
  }

  stopTimer() {
    clearInterval(this.interval);
    this.interval = null;
    this.stopTickingSound();
    this.pomodoroTimerView.updateActionBtn(this.interval);
  }

  setTimer(time) {
    this.isResetAnimation = true;
    this.time = time;
    this.pomodoroTimerView.startAlarmNotice();
    this.startAlarmSound();
    this.pomodoroTimerView.updateTimerDisplay(time);
    this.pomodoroTimerView.updateBtnsCursor(this.isResetAnimation);
  }

  restartTimer(restartLoop = true) {
    if (restartLoop) {
      this.isWork = !this.isWork;
      this.isRest = !this.isRest;

      if (this.isWork) {
        this.setTimer(this.workTime);
      } 
      else if (this.isRest) {
        this.setTimer(this.restTime);
      }
    }
    else {
      this.isWork = true;
      this.isRest = false;

      this.stopTimer();
      this.setTimer(this.workTime);
    }

    setTimeout(() => {
      this.isResetAnimation = false;
      this.stopAlarmSound();
      this.pomodoroTimerView.stopAlarmNotice();
      this.pomodoroTimerView.updateBtnsCursor();
      if (restartLoop) {
        this.startTimer()
      };
    }, 2600);
  }

  startTimer() {
    this.startTickingAtCountdown();

    this.interval = setInterval(() => {
      this.time--;
      this.pomodoroTimerView.updateTimerDisplay(this.time);
      this.startTickingAtCountdown();

      if (this.time === 0) {
        this.stopTimer();

        if (this.isWork) {
          console.log('starting rest time');
          this.restartTimer();
        } 
        else if (this.isRest) {
          console.log('starting work time');
          this.restartTimer();
        }
      }

      console.log(this.time);
    }, 1000);

    this.pomodoroTimerView.updateActionBtn(this.interval);
  }
}
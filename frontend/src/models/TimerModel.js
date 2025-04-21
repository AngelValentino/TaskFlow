export default class TimerModel {
  constructor(pomodoroTimerView, utils) {
    this.utils = utils;
    this.restTime = 10 * 60;
    this.workTime = 45 * 60;
    this.time = this.workTime;
    this.pomodoroTimerView = pomodoroTimerView;

    this.alarmClock = new Audio('assets/audios/wood-plank-flicks.mp3');
    this.alarmClockTicking = new Audio('assets/audios/alarm-clock-ticking.mp3');
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
    this.resetAnimationTimId = null;
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
    if (this.time <= 5) {
      this.startTickingSound();
    }
  }

  stopTimer() {
    clearInterval(this.interval);
    this.interval = null;
    this.stopTickingSound();
    this.pomodoroTimerView.updateActionBtn(this.interval);
  }

  setTimer(time, ignoreNotice = false) {
    this.time = time;
    this.startTimerNotice(ignoreNotice);
    this.pomodoroTimerView.updateTimerDisplay(time);
    this.pomodoroTimerView.updateBtnsCursor(this.isResetAnimation);
  }

  setLongSession() {
    this.workTime = 45 * 60;
    this.restTime = 10 * 60;
    localStorage.setItem('pomodoroTimerSession', 'long');
  }

  setShortSession() {
    this.workTime = 25 * 60;
    this.restTime = 5 * 60;
    localStorage.setItem('pomodoroTimerSession', 'short');
  }

  startTimerNotice(ignoreNotice) {
    !ignoreNotice && (this.isResetAnimation = true);
    !ignoreNotice && this.pomodoroTimerView.startAlarmNotice();
    !ignoreNotice && this.startAlarmSound();
  }

  stopTimerNotice() {
    this.isResetAnimation = false;
    this.stopAlarmSound();
    this.pomodoroTimerView.stopAlarmNotice();
  }

  restartTimer(restartLoop = true, sessionType = null, ignoreNotice = null) {
    clearTimeout(this.resetAnimationTimId);

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

      if (sessionType) {
        if (sessionType === 'long') {
          this.setLongSession();
        } 
        else if (sessionType === 'short') {
          this.setShortSession();
        }
      }

      this.setTimer(this.workTime, ignoreNotice);
    }

    // Stop/restart timer session and stop notice
    this.resetAnimationTimId = setTimeout(() => {
      this.stopTimerNotice();
      this.pomodoroTimerView.updateBtnsCursor();
      if (restartLoop) {
        this.startTimer();
      };
    }, ignoreNotice ? 0 : 620);
  }

  startTimer() {
    this.startTickingAtCountdown();

    this.interval = setInterval(() => {
      this.time--;
      this.pomodoroTimerView.updateTimerDisplay(this.time);
      this.startTickingAtCountdown();

      if (this.time === 0) {
        this.stopTimer();
        this.restartTimer();
      }
    }, 1000);

    this.pomodoroTimerView.updateActionBtn(this.interval);
  }
}
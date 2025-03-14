export default class PomodoroTimerView {
  constructor(utils) {
    this.utils = utils;
    this.lms = {
      clockLm: document.querySelector('.timer__clock'),
      minutesLm: document.querySelector('.timer__minutes'),
      secondsLm: document.querySelector('.timer__seconds'),
      actionBtn: document.querySelector('.timer__control-btn'),
      resetBtn: document.querySelector('.timer__reset-btn')
    }

    // Initialize Pomodoro timer settings
    this.restTime = 10 * 60;
    this.workTime = 45 * 60;
    this.remainingSeconds = this.workTime;
    // Create and configure the audio elements
    this.alarmClock = new Audio('/public/assets/audios/alarm-clock.mp3');
    this.alarmClockTicking = new Audio('/public/assets/audios/alarm-clock-ticking.mp3');
    // Set preload attribute to auto, preload when the browser sees fit
    this.alarmClock.preload = 'auto';
    this.alarmClockTicking.preload = 'auto';
    // Force immediate loading
    this.alarmClock.load();
    this.alarmClockTicking.load();

    // Reassignment variables 
    this.interval = null;
    this.isRest = null;
    this.isTimer = null;
  }

  getDomRefs() {
    return this.lms;
  }

  updateTimerDisplay() {
    const minutes = Math.floor(this.remainingSeconds / 60);
    const seconds = this.remainingSeconds % 60;
    
    this.lms.minutesLm.textContent = minutes.toString().padStart(2, "0");
    this.lms.secondsLm.textContent = seconds.toString().padStart(2, "0");
  }

  updateBtnsAria(button, title, cursorStyle, action) {
    cursorStyle && (button.style.cursor = cursorStyle);
    
    if (action === 'remove') {
      button.removeAttribute('title');
      button.removeAttribute('aria-label');
    } 
    else {
      button.title = title;
      button.ariaLabel = title + '.';
    }
  }

  // Update cursor if timer is active to show that the buttons are disabled or enabled
  updateBtnsCursor() {
    if (this.isTimer) {
      // Add 'default' cursor and remove accessibilty attributes when the timer is active
      this.updateBtnsAria(this.lms.actionBtn, null, 'default', 'remove');
      this.updateBtnsAria(this.lms.resetBtn, null, 'default','remove');
    } 
    else {
      // Add the accessibility attributes and cursor 'pointer' back to buttons
      this.updateBtnsAria(this.lms.actionBtn, 'Start timer', 'pointer');
      this.updateBtnsAria(this.lms.resetBtn, 'Reset timer', 'pointer');
    }
  }

  // Update the control button depending on whether the interval is active or not
  updateActionBtn() {
    if (!this.interval) {
      // Add play icon and remove active class
      this.lms.actionBtn.innerHTML = `
        <svg class="timer__btn-icon" aria-hidden="true" focusable="false" role="presentation" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
          <path fill="currentColor" d="m11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393" />
        </svg>`;
      this.lms.actionBtn.classList.remove('active');

      this.lms.actionBtn.ariaPressed = false;
      this.updateBtnsAria(this.lms.actionBtn, 'Start timer');
    } 
    else {
      // Add pause icon and active class
      this.lms.actionBtn.innerHTML = `
        <svg class="timer__btn-icon timer__pause-icon" aria-hidden="true" focusable="false" role="presentation" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
          <path fill="currentColor" d="M12 6h-2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2m10 0h-2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2" />
        </svg>
      `;
      this.lms.actionBtn.classList.add('active');

      this.lms.actionBtn.ariaPressed = true;
      this.updateBtnsAria(this.lms.actionBtn, 'Pause timer');
    }
  }

  stopTimer() {
    clearInterval(this.interval);
    this.interval = null;
    this.updateActionBtn();
    if (this.utils.isSoundPlaying(this.alarmClockTicking)) {
      this.utils.stopSound(this.alarmClockTicking);
    }
  }

  // Initializes the timer with a specific time and sets it as active
  initTimer(clockTime) {
    this.isTimer = true;
    this.utils.playSound(this.alarmClock);
    this.remainingSeconds = clockTime; // Sets the timer's countdown to the specified time
    this.lms.clockLm.classList.add('active');
    this.updateTimerDisplay();
    this.updateBtnsCursor();
  }

  stopAnimation() {
    this.isTimer = false;
    this.lms.clockLm.classList.remove('active');
    this.updateBtnsCursor();
    this.utils.stopSound(this.alarmClock);
  }

  // Restarts the timer by stopping the current interval and initializing a new one
  restartTimer(timerToInit, timerType) {
    this.stopTimer();
    this.initTimer(timerToInit); // Initializes the timer with the new time

    setTimeout(() => {
      this.stopAnimation();
      // Starts the new timer if a timer type is provided (work or rest)
      timerType && this.startTimer(timerType);
    }, 2600);
  }

  checkAndStartTicking() {
    if (this.remainingSeconds <= 10) {
      if (!this.utils.isSoundPlaying(this.alarmClockTicking)) {
        this.utils.playSound(this.alarmClockTicking);
      }
    }
  }

  // Starts the timer, switching between work and rest
  startTimer(isRest) {
    this.isRest = isRest === 'rest';
    this.checkAndStartTicking();

    this.interval = setInterval(() => {
      this.remainingSeconds--;
      this.updateTimerDisplay();

      this.checkAndStartTicking();

      if (this.remainingSeconds === 0) {
        // If rest has ended start work
        if (isRest === 'rest')  {
          this.restartTimer(this.workTime, 'work');
        } 
        // Else if work has ended start rest
        else {
          this.restartTimer(this.restTime, 'rest');
        }
      }
    }, 1000);

    // Updates the control elements to reflect the running timer
    this.updateActionBtn();
  }
}
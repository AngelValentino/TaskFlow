export default class PomodoroTimerView {
  constructor() {
    this.lms = {
      clockLm: document.getElementById('pomodoro-timer__clock'),
      minutesLm: document.getElementById('pomodoro-timer__minutes'),
      secondsLm: document.getElementById('pomodoro-timer__seconds'),
      actionBtn: document.getElementById('pomodoro-timer__control-btn'),
      resetBtn: document.getElementById('pomodoro-timer__reset-btn'),
      timerOptionsLm: document.getElementById('pomodoro-timer__options'),
      longSessionBtn: document.getElementById('pomodoro-timer__long-session-btn'),
      shortSessionBtn: document.getElementById('pomodoro-timer__short-session-btn')
    }
  }

  getDomRefs() {
    return this.lms;
  }

  setSessionButtonActive(sessionType) {
    const isLongSession = sessionType === 'long';
  
    this.lms.longSessionBtn.classList.toggle('active', isLongSession);
    this.lms.longSessionBtn.setAttribute('aria-pressed', isLongSession.toString());
    this.lms.longSessionBtn.setAttribute('title', isLongSession ? 'Long session is already set' : 'Set long session');
  
    this.lms.shortSessionBtn.classList.toggle('active', !isLongSession);
    this.lms.shortSessionBtn.setAttribute('aria-pressed', (!isLongSession).toString());
    this.lms.shortSessionBtn.setAttribute('title', isLongSession ? 'Set short session' : 'Short session is already set');
  }

  setLongSessionBtnActive() {
    this.setSessionButtonActive('long');
  }

  setShortSessionBtnActive() {
    this.setSessionButtonActive('short');
  }

  updateTimerDisplay(time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    
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

  updateBtnsCursor(isResetAnimation) {
    if (isResetAnimation) {
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

  updateActionBtn(isTimerRunning) {
    if (!isTimerRunning) {
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

  startAlarmNotice() {
    this.lms.clockLm.classList.add('active');
  }

  stopAlarmNotice() {
    this.lms.clockLm.classList.remove('active');
  }
}
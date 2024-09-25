import { isAddTodoFormEdited } from "./prompt.js";
import { playSound, stopSound, isSoundPlaying } from "./utils.js";

export class Timer {
  constructor(root) {
    if (!root) throw new Error("Root element is required");

    // Generate timer
    root.innerHTML = Timer.generateHTML();

    // DOM references
    this.lms = {
      clockLm: root.querySelector('.timer__clock'),
      minutesLm: root.querySelector('.timer__minutes'),
      secondsLm: root.querySelector('.timer__seconds'),
      controlLm: root.querySelector('.timer__control-btn'),
      resetLm: root.querySelector('.timer__reset-btn')
    }

    // Initialize Pomodoro timer settings
    this.restTime = 5 * 60;
    this.workTime = 25 * 60;
    this.remainingSeconds = this.workTime;
    // Create and configure the audio elements
    this.alarmClock = new Audio('../audios/alarm-clock.mp3');
    this.alarmClockTicking = new Audio('../audios/alarm-clock-ticking.mp3');
    // Set preload attribute to auto, preload when the browser sees fit
    this.alarmClock.preload = 'auto'; 
    this.alarmClockTicking.preload = 'auto';

    // Reassignment variables 
    this.interval = null;
    this.isRest = null;
    this.isTimer = null;

    // Set time
    this.updateClockLm();

    // Add event listeners
      // Add start/pause event listener to control button
      this.lms.controlLm.addEventListener('click', () => {
        // If the timer is currently running or add todo form is edited, exit the function
        if (this.isTimer || isAddTodoFormEdited()) return; 

        // If there's no active interval (timer is not running)
        if (!this.interval) {
          // Check if the current phase is rest
          if (this.isRest) {
            // Start the rest timer
            this.startTimer('rest');
          } 
          else {
            // Start the work timer
            this.startTimer('work');
          }
        } 
        else {
          // If the timer is running, stop the timer
          this.stopTimer();
        }
      });

      // Add reset event listener to reset button
      this.lms.resetLm.addEventListener('click', () => {
        /* If the timer is currently running or the remaining seconds are equal to the work time 
        or add todo form is edited, exit the function */
        if (this.isTimer || this.remainingSeconds === this.workTime || isAddTodoFormEdited()) return;

        // Reset to the work phase
        this.isRest = false;
        // Restart the timer with the work time
        this.restartTimer(this.workTime);
      });
  }

  updateClockLm() {
    // Calculate the clock time
    const minutes = Math.floor(this.remainingSeconds / 60);
    const seconds = this.remainingSeconds % 60;

    // Add time to clock element
    this.lms.minutesLm.textContent = minutes.toString().padStart(2, "0");
    this.lms.secondsLm.textContent = seconds.toString().padStart(2, "0");
  }

  updateButtonAttributes(button, title, cursorStyle, action) {
    cursorStyle && (button.style.cursor = cursorStyle);
    
    // Add attributes
    if (action !== 'removeAttributes') {
      button.title = title;
      button.ariaLabel = title + '.';
    } 
    // Remove attributes
    else {
      button.removeAttribute('title');
      button.removeAttribute('aria-label');
    }
  }

  // Update cursor if timer is active to show that the buttons are disabled or enabled
  updateCursor() {
    if (this.isTimer) {
      // Add 'default' cursor and remove accessibilty attributes when the timer is active
      this.updateButtonAttributes(this.lms.controlLm, null, 'default', 'removeAttributes');
      this.updateButtonAttributes(this.lms.resetLm, null, 'default','removeAttributes');
    } 
    else {
      // Add the accessibility attributes and cursor 'pointer' back buttons
      this.updateButtonAttributes(this.lms.controlLm, 'Start timer', 'pointer');
      this.updateButtonAttributes(this.lms.resetLm, 'Reset timer', 'pointer');
    }
  }

  updateControlLms() {
    // Update the control button depending on whether the interval is active or not
    if (!this.interval) {
      // Add play icon and remove active class
      this.lms.controlLm.innerHTML = `
        <svg class="timer__btn-icon" aria-hidden="true" focusable="false" role="presentation" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
          <path fill="currentColor" d="m11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393" />
        </svg>`;
      this.lms.controlLm.classList.remove('active');

      // Add accessibility attributes to control button
      this.lms.controlLm.ariaPressed = false;
      this.updateButtonAttributes(this.lms.controlLm, 'Start timer');
    } 
    else {
      // Add pause icon and active class
      this.lms.controlLm.innerHTML = `
        <svg class="timer__btn-icon timer__pause-icon" aria-hidden="true" focusable="false" role="presentation" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
          <path fill="currentColor" d="M12 6h-2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2m10 0h-2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2" />
        </svg>
      `;
      this.lms.controlLm.classList.add('active');

      // Add accessibility attributes to control button
      this.lms.controlLm.ariaPressed = true;
      this.updateButtonAttributes(this.lms.controlLm, 'Pause timer');
    }
  }

  stopTimer() {
    // Stops the timer by clearing the interval and resetting the interval variable.
    clearInterval(this.interval);
    this.interval = null;
    // Updates the control elements to reflect the timer's stopped state
    this.updateControlLms();
    if (isSoundPlaying(this.alarmClockTicking)) {
      stopSound(this.alarmClockTicking);
    }
  }

  // Initializes the timer with a specific time and sets it as active
  initTimer(clockTime) {
    this.isTimer = true;
    playSound(this.alarmClock);
    this.remainingSeconds = clockTime; // Sets the timer's countdown to the specified time
    this.lms.clockLm.classList.add('active');
    this.updateClockLm(); // Updates the displayed clock time
    this.updateCursor(); // Updates the cursor to reflect the active timer state
  }

  // Stops the visual animation associated with the timer
  stopAnimation() {
    this.isTimer = false;
    this.lms.clockLm.classList.remove('active');
    this.updateCursor();
    stopSound(this.alarmClock);
  }

  // Restarts the timer by stopping the current interval and initializing a new one
  restartTimer(timerToInit, timerType) {
    this.stopTimer();
    this.initTimer(timerToInit); // Initializes the timer with the new time

    setTimeout(() => {
      this.stopAnimation();
      // Starts the new timer if a timer type is provided (work or rest)
      timerType && this.startTimer(timerType);
    }, 2600)
  }

  startTickingSound() {
    if (this.remainingSeconds <= 10) {
      if (!isSoundPlaying(this.alarmClockTicking)) {
        playSound(this.alarmClockTicking);
      }
    }
  }

  // Starts the timer, switching between work and rest
  startTimer(isRest) {
    this.isRest = isRest === 'rest';
    this.startTickingSound();

    this.interval = setInterval(() => {
      this.remainingSeconds--; // Decreases the remaining time by one second
      this.updateClockLm(); // Updates the displayed clock time

      this.startTickingSound();
      // Checks if the timer has finished
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
    this.updateControlLms();
  }

  static generateHTML() {
    return (
      `
        <h2 class="visually-hidden">Pomodoro Timer</h2>
        <div role="timer" aria-live="polite" aria-atomic="true" class="timer__clock">
          <span aria-label="minutes" class="timer__minutes">00</span>
          <span aria-hidden="true" role="presentation">:</span>
          <span aria-label="seconds" class="timer__seconds">00</span>
        </div>
        <button title="Start timer" aria-pressed="false" aria-label="Start timer." class="timer__btn timer__control-btn">
          <svg class="timer__btn-icon" aria-hidden="true" focusable="false" role="presentation" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
            <path fill="currentColor" d="m11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393" />
          </svg>
        </button>
        <button title="Reset timer" aria-label="Reset timer." class="timer__btn timer__reset-btn">
          <svg class="timer__btn-icon timer__reset-icon" aria-hidden="true" focusable="false" role="presentation" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
              <path d="M10 2h4m-2 12v-4m-8 3a8 8 0 0 1 8-7a8 8 0 1 1-5.3 14L4 17.6" />
              <path d="M9 17H4v5" />
            </g>
          </svg>
        </button>
      `
    );
  }
}
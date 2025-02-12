export default class PomodoroTimer {
  static getHtml() {
    return `
      <article aria-label="Pomodoro timer widget." id="timer" role="region" class="timer">
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
      </article>
    `;
  }
}
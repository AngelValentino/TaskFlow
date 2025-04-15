import '../../../styles/pomodoroTimer.css'

export default class PomodoroTimer {
  static getHtml() {
    return `
      <article aria-label="Pomodoro timer widget." id="pomodoro-timer" role="region" class="pomodoro-timer">
        <h2 class="visually-hidden">Pomodoro timer</h2>
        <div id="pomodoro-timer__options" class="pomodoro-timer__options">
          <button aria-controls="pomodoro-timer__clock" aria-label="Set long session for pomodoro timer. 45 minutes work, and 10 minutes rest." title="Long session is already set" aria-pressed="true" id="pomodoro-timer__long-session-btn" class="pomodoro-timer__long-session-btn active"></button>
          <button aria-controls="pomodoro-timer__clock" aria-label="Set short session for pomodoro timer. 25 minutes work, and 5 minutes rest." title="Set short session" aria-pressed="false" id="pomodoro-timer__short-session-btn" class="pomodoro-timer__short-session-btn"></button>
        </div>
        <time role="status" aria-live="polite" aria-atomic="true" class="pomodoro-timer__clock" id="pomodoro-timer__clock">
          <span aria-label="minutes" id="pomodoro-timer__minutes" class="pomodoro-timer__minutes">00</span>
          <span aria-hidden="true" role="presentation">:</span>
          <span aria-label="seconds" id="pomodoro-timer__seconds" class="pomodoro-timer__seconds">00</span>
        </time>
        <button title="Start pomodoro-timer" aria-pressed="false" aria-label="Start pomodoro-timer." id="pomodoro-timer__control-btn" class="pomodoro-timer__btn pomodoro-timer__control-btn">
          <svg class="pomodoro-timer__btn-icon" aria-hidden="true" focusable="false" role="presentation" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
            <path fill="currentColor" d="m11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393" />
          </svg>
        </button>
        <button title="Reset pomodoro-timer" aria-label="Reset pomodoro-timer." id="pomodoro-timer__reset-btn" class="pomodoro-timer__btn pomodoro-timer__reset-btn">
          <svg class="pomodoro-timer__btn-icon pomodoro-timer__reset-icon" aria-hidden="true" focusable="false" role="presentation" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
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
export class Timer {
  constructor(root) {
    this.lms = {
      clockLm: root.querySelector('.timer__clock'),
      minutesLm: root.querySelector('.timer__minutes'),
      secondsLm: root.querySelector('.timer__seconds'),
      controlLm: root.querySelector('.timer__control'),
      resetLm: root.querySelector('.timer__reset')
    }

    this.restTime = 5
    this.interval = null;
    this.remainingSeconds = 10;
    this.isRest = null;
    this.isTimer = null;

    // TODO Add edit work time
    // TODO Add edit rest time

    // TODO refactor Timer class

    this.updateClockLm()

    this.lms.controlLm.addEventListener('click', () => {
      if (this.isTimer) return; 

      if (!this.interval) {
        if (this.isRest) {
          console.log('rest start')
          this.startRest();
        } 
        else {
          console.log('start')
          this.start();
        }
      } 
      else {
        console.log('pause')
        this.stop();
      }
    });

    this.lms.resetLm.addEventListener('click', () => {
      if (this.isTimer) {
        console.log('timer running')
        return;
      }
      console.log('reset')
      // const inputMinutes = prompt("Enter number of minutes:");

      // if (inputMinutes < 60) {
      //   this.stop();
      //   this.remainingSeconds = inputMinutes * 60;
      //   this.updateClockLm();
      // }
    });
  }

  updateClockLm() {
    const minutes = Math.floor(this.remainingSeconds / 60);
    const seconds = this.remainingSeconds % 60;

    this.lms.minutesLm.textContent = minutes.toString().padStart(2, "0");
    this.lms.secondsLm.textContent = seconds.toString().padStart(2, "0");
  }

  updateControlLms() {
    if (this.isTimer) {
      this.lms.controlLm.style.cursor = 'default';
      console.log('default')
    } 
    else {
      this.lms.controlLm.style.cursor = 'pointer';
      console.log('pointer')
    }
    console.log(this.interval)
    if (!this.interval) {
      this.lms.controlLm.innerHTML = `
        <svg class="timer__btn-icon" aria-hidden="true" focusable="false" role="presentation" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
          <path fill="currentColor" d="m11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393" />
        </svg>`;
      this.lms.controlLm.classList.remove('active');
    } 
    else {
      this.lms.controlLm.innerHTML = `
        <svg class="timer__btn-icon timer__pause-icon" aria-hidden="true" focusable="false" role="presentation" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
          <path fill="currentColor" d="M12 6h-2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2m10 0h-2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2" />
        </svg>
      `;
      this.lms.controlLm.classList.add('active')
    }
  }

  stop() {
    clearInterval(this.interval);
    this.interval = null;

    this.updateControlLms();
  }


  startRest() {
    this.lms.clockLm.classList.remove('rest')
    this.interval = setInterval(() => {
      this.remainingSeconds--;
      this.updateClockLm();

      if (this.remainingSeconds === 0) {
        console.log('rest end')
        this.remainingSeconds = 10;
        this.lms.clockLm.classList.add('rest')
        this.updateClockLm()
        this.stop()
        this.isTimer = true;
        this.updateControlLms();
        setTimeout(() => {
          this.isTimer = false;
          this.start();
        }, 2500)
      }
    }, 1000);
    this.updateControlLms();
 
  }

  start() {
    this.isRest = false;
    this.lms.clockLm.classList.remove('rest')
    this.interval = setInterval(() => {
      this.remainingSeconds--;
      this.updateClockLm();

      if (this.remainingSeconds === 0) {
        console.log('work end')
        this.stop();
        // Start rest
        this.remainingSeconds = this.restTime
        this.lms.clockLm.classList.add('rest')
        this.stop()
        this.isRest = true;
        console.log('rest TIME!')
        // SET TIME TO REST TIME
        this.updateClockLm();
        this.isTimer = true;
        this.updateControlLms();
        setTimeout(() => {
          this.isTimer = false;
          this.startRest()
        }, 2500)
      
      }
    }, 1000);

    this.updateClockLm()
    this.updateControlLms();
  }
}
export default class LogoutView {
  constructor() {
    this.lms = {
      logoutMessageLm: document.getElementById('logout-message')
    }
  }

  updateLogoutMessage(message, isError) {
    this.lms.logoutMessageLm.innerText = message;
    if (isError) this.lms.logoutMessageLm.classList.add('error');
  }
}
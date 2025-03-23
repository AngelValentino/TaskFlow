export default class UserMenuController {
  constructor(userMenuView, auth) {
    this.userMenuView = userMenuView;
    this.auth = auth;
    this.lms = this.userMenuView.getDomRefs();

    this.lms.userMenuBtn.addEventListener('click', this.toggleUserMenu.bind(this));
  
    if (this.auth.isClientLogged()) {
      this.userMenuView.renderUserRandomMessage();
      this.setRandomUserMessage();
    }
  }

  setRandomUserMessage() {
    setInterval(() => {
      this.userMenuView.renderUserRandomMessage();
    }, 25000);
  }

  toggleUserMenu() {
    if (this.lms.userMenuLm.classList.contains('active')) {
      this.userMenuView.closeUserMenu()
    } 
    else {
      this.userMenuView.openUserMenu();
    }
  }
}
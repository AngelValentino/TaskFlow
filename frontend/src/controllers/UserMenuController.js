export default class UserMenuController {
  constructor(userMenuView, auth, router) {
    this.userMenuView = userMenuView;
    this.auth = auth;
    this.router = router;
    this.lms = this.userMenuView.getDomRefs();

    this.lms.userMenuBtn.addEventListener('click', this.toggleUserMenu.bind(this));
  
    if (this.auth.isClientLogged()) {
      this.userMenuView.renderUserRandomMessage();
      this.setRandomUserMessage();
    }
  }

  setRandomUserMessage() {
    setTimeout(() => {
      this.userMenuView.startProgressBar();
    });

    const setRandomGreetingMessageTimId = setInterval(() => {
      this.userMenuView.renderUserRandomMessage();
      this.userMenuView.startProgressBar();
    }, 25000);

    this.router.setActiveInterval(setRandomGreetingMessageTimId);
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
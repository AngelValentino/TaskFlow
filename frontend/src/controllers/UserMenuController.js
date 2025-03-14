export default class UserMenuController {
  constructor(userMenuView) {
    this.userMenuView = userMenuView;
    this.lms = this.userMenuView.getDomRefs();

    this.lms.userMenuBtn.addEventListener('click', this.toggleUserMenu.bind(this));
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
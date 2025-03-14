export default class UserMenuView {
  constructor(modalHandler) {
    this.modalHandler = modalHandler;
    this.lms = {
      userMenuBtn: document.getElementById('user-menu-btn'),
      userMenuLm: document.getElementById('user-menu'),
      loginLink: document.getElementById('user-menu__login-link')
    }
    this.lastFocusedLmBeforeModal = null;
  }

  getDomRefs() {
    return this.lms;
  }

  openUserMenu() {
    this.lms.userMenuLm.classList.add('active');

    this.lastFocusedLmBeforeModal = this.modalHandler.toggleModalFocus('add', this.lms.loginLink);

    this.modalHandler.addModalEvents(
      'userMenu',
      'user-menu',
      document.body,
      this.lms.userMenuLm,
      null,
      this.closeUserMenu.bind(this)
    );
  }

  closeUserMenu() {
    this.lms.userMenuLm.classList.remove('active');
    this.modalHandler.toggleModalFocus('return', null, this.lastFocusedLmBeforeModal);

    this.modalHandler.removeModalEvents(
      'userMenu',
      document.body,
      this.lms.userMenuLm,
    );
  }
}
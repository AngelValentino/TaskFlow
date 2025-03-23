export default class UserMenuView {
  constructor(modalHandler, userModel) {
    this.modalHandler = modalHandler;
    this.userModel = userModel;
    this.lms = {
      userMenuBtn: document.getElementById('user-menu__btn'),
      userMenuLm: document.getElementById('user-menu'),
      userMessageLm: document.getElementById('user-menu__user-message')

    }
    this.lastFocusedLmBeforeModal = null;
  }

  getDomRefs() {
    return this.lms;
  }

  getRandomMessage() {
    const randomGreeting = this.userModel.greetings[Math.floor(Math.random() * this.userModel.greetings.length)];
    const randomIcon = this.userModel.greetingIcons[Math.floor(Math.random() * this.userModel.greetingIcons.length)];

    const username = localStorage.getItem('username') || 'User';
    return `${randomGreeting}, ${username}! ${randomIcon}`;
  }

  renderUserRandomMessage() {
    this.lms.userMessageLm.innerText = this.getRandomMessage();
  }

  openUserMenu() {
    this.lms.userMenuLm.classList.add('active');
    const firstFocusableLm = this.lms.userMenuLm.children[0].querySelector('.user-menu__link')
    this.lastFocusedLmBeforeModal = this.modalHandler.toggleModalFocus('add', firstFocusableLm);

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
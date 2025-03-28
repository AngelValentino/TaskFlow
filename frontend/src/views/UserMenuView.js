export default class UserMenuView {
  constructor(modalHandler, userModel, utils) {
    this.modalHandler = modalHandler;
    this.userModel = userModel;
    this.utils = utils;
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
    const randomGreeting = this.userModel.greetings[this.utils.getNonRepeatingRandomIndex(this.userModel.greetings, 'userGreetings')];
    const randomIcon = this.userModel.greetingIcons[this.utils.getNonRepeatingRandomIndex(this.userModel.greetingIcons, 'userGreetingIcons')];

    const username = localStorage.getItem('username') || 'User';
    return `${randomGreeting}, ${username}! ${randomIcon}`;
  }

  renderUserRandomMessage() {
    this.lms.userMessageLm.innerText = this.getRandomMessage();
  }

  setUserMenuBtnAria(ariaExpanded, title) {
    this.lms.userMenuBtn.setAttribute('aria-expanded', ariaExpanded);
    this.lms.userMenuBtn.setAttribute('aria-label', title + '.');
    this.lms.userMenuBtn.setAttribute('title', title);
  }

  openUserMenu() {
    this.lms.userMenuLm.classList.add('active');
    const firstFocusableLm = this.lms.userMenuLm.children[0].querySelector('.user-menu__link')
    this.lastFocusedLmBeforeModal = this.modalHandler.toggleModalFocus('add', firstFocusableLm);
    this.setUserMenuBtnAria('true', 'Close user menu');

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
    this.setUserMenuBtnAria('false', 'Open user menu');

    this.modalHandler.removeModalEvents(
      'userMenu',
      document.body,
      this.lms.userMenuLm,
    );
  }
}
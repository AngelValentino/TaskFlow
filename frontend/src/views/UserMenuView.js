export default class UserMenuView {
  constructor(modalHandler, userMenuModel, utils) {
    this.modalHandler = modalHandler;
    this.userMenuModel = userMenuModel;
    this.utils = utils;
    this.lms = {
      userMenuBtn: document.getElementById('user-menu__btn'),
      userMenuLm: document.getElementById('user-menu'),
      userMessageLm: document.getElementById('user-menu__greeting-message'),
      greetingMessageProgressBar: document.getElementById('user-menu__greeting-message-progress-bar')
    }
    this.lastFocusedLmBeforeModal = null;
  }

  getDomRefs() {
    return this.lms;
  }

  startProgressBar() {
    this.lms.greetingMessageProgressBar.style.transform = 'scaleX(0)';
    this.lms.greetingMessageProgressBar.style.transition = 'none';
    this.lms.greetingMessageProgressBar.offsetHeight;
    this.lms.greetingMessageProgressBar.style.transition = 'transform 25s linear, background-color var(--base-transition-duration)';
    this.lms.greetingMessageProgressBar.style.transform = 'scaleX(1)';
  }

  getRandomMessage() {
    const randomGreeting = this.userMenuModel.greetings[this.utils.getNonRepeatingRandomIndex(this.userMenuModel.greetings, 'userGreetings')];
    const randomIcon = this.userMenuModel.greetingIcons[this.utils.getNonRepeatingRandomIndex(this.userMenuModel.greetingIcons, 'userGreetingIcons')];

    const username = localStorage.getItem('username') || 'Jack';
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

    this.modalHandler.addModalEvents({
      eventHandlerKey: 'userMenu',
      modalLm: this.lms.userMenuLm,
      closeHandler: this.closeUserMenu.bind(this),
      modalLmOuterLimits: this.lms.userMenuLm,
      exemptLms: [this.lms.userMenuBtn]
    });
  }

  closeUserMenu() {
    this.lms.userMenuLm.classList.remove('active');
    this.modalHandler.toggleModalFocus('return', null, this.lastFocusedLmBeforeModal);
    this.setUserMenuBtnAria('false', 'Open user menu');

    this.modalHandler.removeModalEvents({
      eventHandlerKey: 'userMenu',
      modalLm: this.lms.userMenuLm,
    });
  }
}
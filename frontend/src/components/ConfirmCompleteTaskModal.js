import ConfirmModal from "./ConfirmModal.js";

export default class ConfirmCompleteTaskModal {
  static getHtml() {
    return ConfirmModal.getHtml({
      description: 'Are you sure that you want to complete this task?',
      imgLm: '<img class="capybara-placeholder-img" src="public/assets/images/drawings/chilling-capybara.jpg" alt="A drawing of capybara having a bath in a hot tub with a rubber duck on its head." />',
    });
  }
}
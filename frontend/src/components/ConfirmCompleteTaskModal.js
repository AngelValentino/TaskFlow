import ConfirmModal from "./ConfirmModal.js";

export default class ConfirmCompleteTaskModal {
  static getHtml() {
    return ConfirmModal.getHtml(
      {
        description: 'Are you sure that you want to complete this task?',
        imgLm: `
          <div style="background-image: url('public/assets/images/drawings/chilling-capybara-low-res.jpg')" class="confirm-modal__image-container blur-img-loader">
            <img class="capybara-placeholder-img" src="public/assets/images/drawings/chilling-capybara.jpg" alt="A drawing of capybara having a bath in a hot tub with a rubber duck on its head." />
          </div>
        `
      }
    );
  }
}
export default class InfoModal {
  static getHtml(
    { 
      description = '',
    } = {}
  ) {
    return `
      <div id="info-modal-container" class="info-modal-container">
        <div class="info-modal" id="info-modal" role="dialog" aria-describedby="dialog__desc">
          <img class="capybara-placeholder-img" src="public/assets/images/drawings/chilling-capybara.jpg" alt="A drawing of capybara having a bath in a hot tub with a rubber duck on its head."/>
          <button title="Close dialog" aria-label="Close dialog." type="button" class="info-modal__close-btn appear-bg-from-center rounded dark-soft" id="info-modal__close-btn">
            <svg aria-hidden="true" focusable="false" role="presentation" class="info-modal__close-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 6L6 18M6 6l12 12"></path>
            </svg>
          </button>
          <p class="info-modal__desc" id="info-modal__desc">${description}</p>
          <button style="padding: 12px 20px" class="info-modal__accept-btn" id="info-modal__accept-btn" type="button">Ok</button>
        </div>
        <div id="info-modal-overlay" class="info-modal-overlay"></div>
      </div>
    `;
  }
}
import Utils from "../services/Utils.js";

export default class ConfirmModal {
  static utils = new Utils;

  static getHtml(
    {
      description = 'Are you sure you want to discard your changes?',
      imgLm = null,
      isDeleteAllTasksModal = false
    } = {}
  ) {

    const getImgLm = () => {
      if (imgLm === null) {
        const array = new Array(6);
        const randomNumber = this.utils.getNonRepeatingRandomIndex(array, 'confirmModal', true);

        return `
          <div style="background-image: url('public/assets/images/recycle/garbage-collector-low-res-${randomNumber}.jpg')" class="confirm-modal__image-container blur-img-loader">
            <img class="confirm-modal__recycle-placeholder-img" src="public/assets/images/recycle/garbage-collector-${randomNumber}.jpg" alt="A drawing of a garbage collector taking out the trash.">
          </div>
        `;
      }
      else {
        return imgLm;
      }
    }

    const getDeleteOtherTasksBtns = () => {
      return `
        <div id="confirm-modal__delete-options-container" class="confirm-modal__delete-options-container">
          <button title="Delete all active tasks" id="confirm-modal__delete-active-btn" class="confirm-modal__delete-option-btn">
            <svg aria-hidden="true" focusable="false" role="presentation" class="confirm-modal__delete-active-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <g fill="none" fill-rule="evenodd">
                <path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z" />
                <path fill="currentColor" d="M15 2a2 2 0 0 1 1.732 1H18a2 2 0 0 1 2 2v12a5 5 0 0 1-5 5H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h1.268A2 2 0 0 1 9 2zM7 5H6v15h9a3 3 0 0 0 3-3V5h-1a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2m9.238 4.379a1 1 0 0 1 0 1.414l-4.95 4.95a1 1 0 0 1-1.414 0l-2.12-2.122a1 1 0 0 1 1.413-1.414l1.415 1.414l4.242-4.242a1 1 0 0 1 1.414 0M15 4H9v1h6z" />
              </g>
            </svg>
          </button>
          <button title="Delete all completed tasks" id="confirm-modal__delete-completed-btn" class="confirm-modal__delete-option-btn">
            <svg aria-hidden="true" focusable="false" role="presentation" class="confirm-modal__delete-completed-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <g fill="none" fill-rule="evenodd">
                <path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z" />
                <path fill="currentColor" d="M15 2a2 2 0 0 1 1.732 1H18a2 2 0 0 1 2 2v12a5 5 0 0 1-5 5H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h1.268A2 2 0 0 1 9 2zm-.176 7.379l-4.242 4.243l-1.415-1.415a1 1 0 0 0-1.414 1.414l2.05 2.051a1.1 1.1 0 0 0 1.556 0l4.88-4.879a1 1 0 1 0-1.415-1.414M14.5 4h-5a.5.5 0 0 0-.492.41L9 4.5v1a.5.5 0 0 0 .41.492L9.5 6h5a.5.5 0 0 0 .492-.41L15 5.5v-1a.5.5 0 0 0-.41-.492z" />
              </g>
            </svg>
          </button>
        </div>
      `;
    }

    return `
      <div id="confirm-modal-container" class="confirm-modal-container">
        <div class="confirm-modal" id="confirm-modal" role="alertdialog" aria-describedby="confirm-modal__desc">
          ${getImgLm()}
          <button title="Close modal" aria-label="Close modal." type="button" class="confirm-modal__close-btn appear-bg-from-center rounded dark-soft" id="confirm-modal__close-btn">
            <svg aria-hidden="true" focusable="false" role="presentation" class="confirm-modal__close-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 6L6 18M6 6l12 12"></path>
            </svg>
          </button>
          <p class="confirm-modal__desc" id="confirm-modal__desc">${description}</p>
          <p id="confirm-modal__info-message" class="confirm-modal__info-message"></p>
          <div id="confirm-modal__btns-container" class="confirm-modal__btns-container">
            <button class="confirm-modal__accept-btn" id="confirm-modal__accept-btn" type="button">Yes</button>
            <button class="confirm-modal__cancel-btn" id="confirm-modal__cancel-btn" type="button">No</button>
          </div>
          ${isDeleteAllTasksModal ? getDeleteOtherTasksBtns() : ''}
        </div>
        <div id="confirm-modal-overlay" class="confirm-modal-overlay"></div>
      </div>    
    `;
  }
}
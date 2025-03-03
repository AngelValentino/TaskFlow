import InfoModal from "./InfoModal.js";

export default class InfoMaxTasksModal {
  static getHtml() {
    return InfoModal.getHtml(
      {
        description: 'You have reached the maximum limit of 100 active tasks.'
      }
    );
  }
}
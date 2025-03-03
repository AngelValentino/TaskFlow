import InfoModal from "./InfoModal.js";

export default class InfoEmptyTaskListModal {
  static getHtml() {
    return InfoModal.getHtml(
      {
        description: 'All tasks have been completed, there is nothing available to delete.'
      }
    );
  }
}
import ConfirmModal from "./ConfirmModal.js";

export default class ConfirmCompleteTaskModal {
  static getHtml() {
    return ConfirmModal.getHtml({
      description: 'Are you sure that you want to complete this task?'
    });
  }
}
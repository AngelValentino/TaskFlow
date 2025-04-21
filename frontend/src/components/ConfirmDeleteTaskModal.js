import ConfirmModal from "./ConfirmModal.js";

export default class ConfirmDeleteTaskModal {
  static getHtml() {
    return ConfirmModal.getHtml(
      {
        description: 'Are you sure that you want to delete this task?'
      }
    );
  }
}
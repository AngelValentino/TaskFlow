import ConfirmModal from "./ConfirmModal.js";

export default class ConfirmDeleteTaskModal {
  static getHtml() {
    return ConfirmModal.getHtml(
      {
        description: 'Are you sure you want to delete this task?'
      }
    );
  }
}
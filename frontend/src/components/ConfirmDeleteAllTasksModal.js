import ConfirmModal from "./ConfirmModal.js";

export default class ConfirmDeleteAllTasksModal {
  static getHtml() {
    return ConfirmModal.getHtml({
      description: 'Are you sure you want to delete all of your tasks?',
      isDeleteAllTasksModal: true
    });
  }
}
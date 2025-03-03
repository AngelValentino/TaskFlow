export default class Utils {
  getActiveTabFilterParam() {
    const currentTabId = localStorage.getItem('currentActiveTabId');
    
    switch (currentTabId) {
      case 'task-manger__all-tasks-tab-btn':
        return undefined;
      case 'task-manager__active-tasks-tab-btn':
        return false;
      case 'task-manger__completed-tasks-tab-btn':
        return true;
      default:
        return undefined;
    }
  }
}
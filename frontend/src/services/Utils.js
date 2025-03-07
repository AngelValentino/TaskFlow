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

  populateFormInputs(form, data) {
    for (const key in data) {
      const field = form.querySelector(`[name="${key}"]`);
      if (data[key]) {
        field.value = data[key];
      }
    }
  }

  getFormData(formLm, handler) {
    const formData = new FormData(formLm);
    const data = {}

    formData.forEach((value, key) => {
      if (handler) {
        data[key] = handler(value, key);
      } 
      else {
        data[key] = value;
      }
    });

    return data;
  }

  isFormPopulated(formLm) {
    const formData = this.getFormData(formLm)

    console.log(formData)

    for (const key in formData) {
      if (formData[key]) {
        return true;
      }
    }

    return false;
  }
}
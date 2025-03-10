export default class Utils {
  debouncedHandlers = {};

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

  clearFormErrors(errorLms) {
    errorLms.forEach(error => {
      error.innerText = '';
      error.classList.remove('active');
    });
  }

  renderFormErrors(errors, errorLms) {
    for (const key in errors) {
      if (errors[key] && errors[key] !== null) {
        errorLms[key].innerText = `*${errors[key]}`;
        errorLms[key].classList.add('active');
      }
      else {
        errorLms[key].classList.remove('active');
        errorLms[key].innerText = '';
      }
    }
  }

  formatDate(dateInput) {
    // Check if the input is a string (assumed to be an ISO date string)
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    
    // Function to add ordinal suffix to the day
    const getOrdinalSuffix = day => {
      const suffixes = ['th', 'st', 'nd', 'rd'];
      const value = day % 100;
      return suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0];
    };

    // Get the weekday, month, year, and day of the month
    const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
    const month = date.toLocaleDateString('en-US', { month: 'long' });
    const day = date.getDate();
    const year = date.getFullYear();

    const dayWithSuffix = day + getOrdinalSuffix(day);

    // Format the date in the desired format: "Friday, March 7th 2025"
    const longFormat = `${weekday}, ${month} ${dayWithSuffix} ${year}`;

    // Format the date in ISO 8601 format "YYYY-MM-DD"
    const isoFormat = date.toISOString().split('T')[0]; // e.g., "2024-01-01"
  
    return { longFormat, isoFormat };
  };

  getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

  debounce(callback, delay = 1000, key) {
    let timeout;

    const debounced = (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        callback(...args);
      }, delay);
    };

    // Return the debounced function along with a cancel method
    debounced.cancel = () => {
      clearTimeout(timeout);
      console.log('cleared debounced timeout')
    };

    this.debouncedHandlers[key] = debounced;

    return debounced;
  }

  clearDebounce(key) {
    if (this.debouncedHandlers[key]) {
      this.debouncedHandlers[key].cancel();
    }
  }
}
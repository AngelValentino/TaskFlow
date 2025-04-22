export default class Utils {
  debouncedHandlers = {};
  lastIndexes = {};

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

  // Returns a random index from the array that is not equal to the lastIndex
  getNonRepeatingRandomIndex(array, lastIndexKey, notIndexed = false) {
    const lastIndex = this.lastIndexes[lastIndexKey];
    let randomIndex = 0;

    // Generate a random index between 0 and array.length - 1
    if (notIndexed) {
      // Generate random index between 1 and array.length (inclusive)
      randomIndex = Math.floor(Math.random() * array.length) + 1;
    } 
    else {
      // Generate random index between 0 and array.length - 1
      randomIndex = Math.floor(Math.random() * array.length);
    }

    if (randomIndex === lastIndex) {
      // Otherwise, recursively call the function until a different index is found
      return this.getNonRepeatingRandomIndex(array, lastIndexKey, notIndexed);
    }

    // Update the lastIndexes to store the new random index
    this.lastIndexes[lastIndexKey] = randomIndex;

    // If the random index is different from the last index, return it
    return randomIndex;
  }

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
    };

    this.debouncedHandlers[key] = debounced;

    return debounced;
  }

  clearDebounce(key) {
    if (this.debouncedHandlers[key]) {
      this.debouncedHandlers[key].cancel();
    }
  }

  highlighter(text, searchValue, isCompleted) {
    // If searchValue is empty or only whitespace, return the original text
    if (!searchValue.trim()) return text;
  
    // Create a regular expression to match occurrences of the 'searchValue' string, ignoring case
    const regex = new RegExp(`(${searchValue.trim()})`, 'gi');
    
    // Split the text into parts based on the regular expression also including the regex split 
    // value thanks to using a capture group '()'
    const parts = text.split(regex);
  
    // Map through the parts, wrapping highlighted parts in a span with a specific class
    return parts.map(part => {
      if (regex.test(part)) {
        // If the part matches the highlight, wrap it in a span
        return `<span class="${isCompleted ? 'highlighted-2' : 'highlighted'}">${part}</span>`;
      } 
      else {
        // Otherwise, return the part as is
        return part;
      }
    }).join(''); // Join the parts back into a single string
  }

  playSound(audio) {
    audio.currentTime = 0; // Reset to the start
    audio.play().catch(error => {
      console.error('Playback error:', error);
    });
  }
  
  stopSound(audio) {
    audio.pause();
    audio.currentTime = 0;
  }
  
  isSoundPlaying(audio) {
    return !audio.paused && audio.currentTime > 0;
  }

  handleLoading(callback) {
    return setTimeout(() => {
      callback();
    }, 125);
  }

  removeAllAttributes(htmlString) {
    const normalizeHtml = html => {
      return html ? html.replace(/\s+/g, '').trim() : null; // Replace multiple spaces with a single space
    }

    if (!htmlString) {
      return null;
    }
    
    htmlString = htmlString.replace(/\s+(?!src\b)([\w-]+)\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/g, '');
    return normalizeHtml(htmlString);
  }

  formatErrorMessage(error) {
    const errorMessage = error?.message || String(error);
    return /^error[:\s]/i.test(errorMessage)
      ? errorMessage
      : 'Error: ' + errorMessage;
  }

  formatFetchRequestKey(requestMethod, apiUrl) {
    return requestMethod + '=>' + apiUrl;
  }

  getRandomUUID() {
    if (typeof crypto?.randomUUID === 'function') {
      return crypto.randomUUID();
    }
  
    // Fallback UUID v4
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}
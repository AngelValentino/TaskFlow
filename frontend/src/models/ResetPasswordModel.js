import config from "../config";

export default class ResetPasswordModel {
  constructor(router, utils) {
    this.router = router;
    this.utils = utils;
    this.endpoint = config.apiUrl + '/reset-password';
  }

  async handleResetUserPassword(formData) {
    const response = await fetch(this.endpoint, {
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'X-Device-ID': sessionStorage.getItem('deviceUUID')
      },
      body: formData,
      signal: this.router.getAbortSignal(this.utils.formatFetchRequestKey('POST', this.endpoint))
    });

    // Rate limited
    if (response.status === 429) {
      const error = await response.json();
      throw new Error(`Oops! Error ${response.status}: ${error.message}`);
    }

    // Validation error
    if (response.status === 422) {
      const errorData = await response.json();
      const error = new Error('Validation error occurred');
      error.data = errorData; // Attach the full error data
      throw error;
    }

    // API error
    if (!response.ok) {
      throw new Error(`Oops! Error ${response.status}: We couldn't reset your TaskFlow account password. Please try again later.`);
    }
  }
}
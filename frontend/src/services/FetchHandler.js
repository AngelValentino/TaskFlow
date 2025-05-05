export default class FetchHandler {
  constructor(router, deviceIdentifier, utils, tokenHandler = null) {
    if (FetchHandler.instance) return FetchHandler.instance;
    FetchHandler.instance = this;
    this.router = router;
    this.deviceIdentifier = deviceIdentifier;
    this.utils = utils;
    this.tokenHandler = tokenHandler;
  }

  async fetchRequest(apiUrl, options = {}, useAccessToken = false, useSignal = true) {
    const methodsWithBody = ['POST', 'PUT', 'PATCH'];

    const headers = {
      'X-Device-ID': this.deviceIdentifier.getDeviceUUID()
    }

    methodsWithBody.includes(options.method) && (headers['Content-Type'] = 'application/json');
    useAccessToken && (headers['Authorization'] = 'Bearer ' + localStorage.getItem('accessToken'));

    const fetchOptions = {
      ...options,
      headers,
    };

    if (useSignal) {
      fetchOptions.signal = this.router.getAbortSignal(this.utils.formatFetchRequestKey(options.method?.toUpperCase() || 'UNKNOWN_METHOD', apiUrl));
    }

    return await fetch(apiUrl, fetchOptions);
  }

  async handleAuthFetchRequest(
    apiUrl, 
    options, 
    returnData = false, 
    errorMessage = 'Failed API connection. Please try again later.',
  ) {
    let response = await this.fetchRequest(apiUrl, options, true);

    // Checks if token has expired (401)
    if (response.status === 401) {
      const error = await response.json();

      // Get new refresh token and retry initial request
      if (error.message === 'Token has expired.') {
        await this.tokenHandler.handleRefreshAccessToken(); 
        response = await this.fetchRequest(apiUrl, options, true);
      }
    }

    // Rate limited
    if (response.status === 429) {
      const error = await response.json();
      // Handles error message for enhaced task view, to make space for smaller screens
      const message = errorMessage === 'enhancedTaskManagerError'
        ? `Oops! Error ${response.status}`
        : `Oops! Error ${response.status}: ${error.message}`;
      throw new Error(message);
    }

    // Handle validation
    if (response.status === 422) {
      const errorData = await response.json();
      const error = new Error(`Oops! Error ${response.status}: It looks like something's missing or incorrect. Please review your input and try again.`);
      error.data = errorData
      throw error;
    }

    // Handle conflict error
    if (response.status === 409) {
      const errorData = await response.json();
      throw new Error(`Oops! Error ${response.status}: ${errorData.message}`);
    }

    // Generic status error
    if (!response.ok) {
      throw new Error(`Oops! Error ${response.status}${errorMessage === 'enhancedTaskManagerError' ? '' : ': ' + errorMessage}`);
    }

    return returnData ? await response.json() : null;
  }

  async handleFetchRequest(
    apiUrl, 
    options, 
    errorMessage = 'Failed API connection.', 
    returnData = false,
    useAccessToken
  ) {
    let response = await this.fetchRequest(apiUrl, options, useAccessToken);

    // Rate limited
    if (response.status === 429) {
      const error = await response.json();
      throw new Error(`Oops! Error ${response.status}: ${error.message}`);
    }

    // Validation
    if (response.status === 422) {
      const errorData = await response.json();
      const error = new Error(`Oops! Error ${response.status}: It looks like something's missing or incorrect. Please review your input and try again.`);
      error.data = errorData
      throw error;
    }

    // Check token expiration or forbidden status
    if (response.status === 401) {
      const error = await response.json();
      throw new Error(`Oops! Error ${response.status}: ${error.message}`);
    }

    // Generic bad request message
    if (!response.ok) {
      throw new Error(`Oops! Error ${response.status}: ${errorMessage}`);
    }

    return returnData ? await response.json() : null;
  }
}
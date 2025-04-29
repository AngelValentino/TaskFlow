import config from "../config";

export default class RecoverPasswordModel {
  constructor(router, utils, deviceIdentifier) {
    this.router = router;
    this.utils = utils;
    this.deviceIdentifier = deviceIdentifier;
    this.endpoint = config.apiUrl + '/recover-password';
  }

  async handleSendRecoverPasswordEmail(email) {
    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Device-ID': this.deviceIdentifier.getDeviceUUID()
      },
      body: JSON.stringify({
        email: email
      }),
      signal: this.router.getAbortSignal(this.utils.formatFetchRequestKey('POST', this.endpoint))
    });

    // Rate limited
    if (response.status === 429) {
      const error = await response.json();
      throw new Error(`Oops! Error ${response.status}: ${error.message}`);
    }

    // Validation
    if (response.status === 422) {
      const error = await response.json();
      throw new Error(`Oops! Error ${response.status}: ${error.message}`);
    }

    if (!response.ok) {
      throw new Error(`Oops! Error ${response.status}: We couldn't send the password recovery email. Please try again later.`);
    }

    return await response.json();
  }
}
export default class RecoverPasswordModel {
  constructor(router, utils) {
    this.router = router;
    this.utils = utils;
    this.endpoint = 'http://taskflow-api.com/recover-password';
  }

  async handleSendRecoverPasswordEmail(email) {
    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
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

    if (!response.ok) {
      throw new Error(`Oops! Error ${response.status}: We couldn't send the password recovery email. Please try again later.`);
    }

    return await response.json();
  }
}
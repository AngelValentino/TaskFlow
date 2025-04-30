import config from "../config";

export default class RecoverPasswordModel {
  constructor(fetchHandler) {
    this.fetchHandler = fetchHandler;
    this.endpoint = config.apiUrl + '/recover-password';
  }

  async handleSendRecoverPasswordEmail(email) {
    return await this.fetchHandler.handleFetchRequest(
      this.endpoint,
      {
        method: 'POST',
        body: JSON.stringify({
          email
        })
      },
      `We couldn't send the password recovery email. Please try again later.`,
      true
    );
  }
}
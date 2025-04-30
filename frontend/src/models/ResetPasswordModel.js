import config from "../config";

export default class ResetPasswordModel {
  constructor(fetchHandler) {
    this.fetchHandler = fetchHandler;
    this.endpoint = config.apiUrl + '/reset-password';
  }

  async handleResetUserPassword(formData) {
    await this.fetchHandler.handleFetchRequest(
      this.endpoint,
      {
        method: 'POST',
        body: formData
      },
      `We couldn't reset your TaskFlow account password. Please try again later.`,
    );
  }
}
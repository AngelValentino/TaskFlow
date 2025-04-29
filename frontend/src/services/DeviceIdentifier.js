export default class DeviceIdentifier {
  constructor({ days = 0, hours = 0, minutes = 0, seconds = 0 } = {}) {
    this.expiryTimeMS =
      (
        days * 24 * 60 * 60 +
        hours * 60 * 60 +
        minutes * 60 +
        seconds
      ) * 1000;

    // Default to 1 hour if nothing is provided
    if (this.expiryTimeMS === 0) {
      this.expiryTimeMS = 60 * 60 * 1000;
    }
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

  generateDeviceUUID() {
    const uuid = this.getRandomUUID();
    const expiry = Date.now() + this.expiryTimeMS;
    return `${uuid}:${expiry}`;
  }

  setDeviceUUID() {
    const deviceUUID = this.generateDeviceUUID();
    localStorage.setItem('deviceUUID', deviceUUID);
    console.log('created a new device UUID: ' + localStorage.getItem('deviceUUID'));
    return deviceUUID.split(':')[0]; // Return just the UUID part
  }

  getDeviceUUID() {
    const deviceUUID = localStorage.getItem('deviceUUID');
    if (deviceUUID) {
      return deviceUUID.split(':')[0];
    }
    return null;
  }

  refreshDeviceUUID() {
    const deviceUUID = localStorage.getItem('deviceUUID');
    if (deviceUUID) {
      const [uuid, expiry] = deviceUUID.split(':');
      if (Date.now() < expiry) {
        // Not expired, return the UUID
        console.log('Not expired -> return the same UUID: ' + deviceUUID.split(':')[0]);
        return uuid;
      } 
      else {
        // Expired, remove from storage and generate a new one
        console.log('Expired -> remove from storage and generate a new one')
        localStorage.removeItem('deviceUUID');
      }
    }

    // If not found or expired, generate a new UUID
    return this.setDeviceUUID();
  }
}
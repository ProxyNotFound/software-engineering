const { ipcRenderer } = require("electron");
const { EventEmitter } = require("events");
const LicenseActivationDialog = require("../dialogs/license-activation-dialog");

class LicenseStore extends EventEmitter {
  constructor() {
    super();
    this.licenseStatus = {
      activated: true,
      name: "software engineer",
      product: "StarUML",
      edition: "PRO",
      productDisplayName: "StarUML Commercial",
      deviceId: "RPL007",
      licenseKey: "LISENSI-STUDI-PASSED",
      activationCode: "VALID-123",
      trial: false,
      trialDaysLeft: 999,
    };
  }

async fetch() {
  this.emit("statusChanged", this.licenseStatus);
}

  async getDeviceId() {
    try {
      const deviceId = await ipcRenderer.invoke("license.get-device-id");
      return deviceId;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async activate(licenseKey) {
    try {
      const result = await ipcRenderer.invoke("license.activate", licenseKey);
      if (!result.success) {
        app.toast.error(result.message || "Activation failed");
      }
    } catch (err) {
      console.error(err);
      app.toast.error("Activation failed");
    }
    await this.fetch();
  }

  async deactivate() {
    try {
      const result = await ipcRenderer.invoke("license.deactivate");
      if (!result.success) {
        app.toast.error(result.message || "Deactivation failed");
      }
    } catch (err) {
      console.error(err);
      app.toast.error("Deactivation failed");
    }
    await this.fetch();
  }

async validate() {
  return { success: true };
}


  getLicenseStatus() {
    return this.licenseStatus;
  }

async checkTrialMode() {
}


  async htmlReady() {
    try {
      await this.fetch();
      const result = await this.validate();
      if (!result.success) {
        app.toast.error(result.message || "License validation failed");
      }
      await this.checkTrialMode();
      await this.fetch();
    } catch (err) {
      console.error(err);
      console.log("License validation failed");
    }
  }
}

module.exports = LicenseStore;
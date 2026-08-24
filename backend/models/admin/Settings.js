const mongoose = require("mongoose");

const SettingsSchema = new mongoose.Schema(
  {
    siteName: { type: String, required: true },
    siteLogo: { type: String },
    favicon: { type: String },
    footerLogo: { type: String },
    tinymceApiKey: { type: String },
    contactEmail: { type: String },
    contactPhone: { type: String },
    contactAddress: { type: String },
    socialLinks: {
      facebook: { type: String },
      instagram: { type: String },
      linkedin: { type: String },
      x: { type: String },
      youtube: { type: String },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Settings", SettingsSchema);

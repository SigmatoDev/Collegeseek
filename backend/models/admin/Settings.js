const mongoose = require("mongoose");

const SettingsSchema = new mongoose.Schema({
  siteName: { type: String, required: true },
  siteLogo: { type: String },
  favicon: { type: String },
});

module.exports = mongoose.model("Settings", SettingsSchema);

// models/meta.model.js
const mongoose = require("mongoose");

const metaSchema = new mongoose.Schema(
  {
    page: {
      type: String,
      required: true,
      unique: true, // Each page should have only one meta entry
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    keywords: { type: String },
    ogTitle: { type: String },
    ogDescription: { type: String },
    ogUrl: { type: String },
    ogSiteName: { type: String },
    ogType: { type: String },
    xTitle: { type: String }, // formerly twitterTitle
    xDescription: { type: String }, // formerly twitterDescription
  },
  { timestamps: true }
);

module.exports = mongoose.model("Meta", metaSchema);

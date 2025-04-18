// models/AddItem.js
const mongoose = require('mongoose');

const addItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String }, // store image path or URL
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('AdsItem', addItemSchema);

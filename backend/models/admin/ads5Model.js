const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
  src: {
    type: String,
    required: true,
    trim: true,
  },
    link: { type: String }, // Added link field


  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Ad = mongoose.model('Ads 5', adSchema);

module.exports = Ad;

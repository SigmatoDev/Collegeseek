const mongoose = require('mongoose');

const adsSchema = new mongoose.Schema({
  image: { type: String, required: true }, // Store the image path or URL
  description: { type: String },
}, {
  timestamps: true // Optional: adds createdAt and updatedAt fields
});

// Avoid using spaces in model names; "Ads" or "CollegeAd" is more conventional
module.exports = mongoose.models.Ads || mongoose.model('Ads', adsSchema);

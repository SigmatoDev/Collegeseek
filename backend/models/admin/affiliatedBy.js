const mongoose = require('mongoose');

// AffiliatedBy schema
const affiliatedBySchema = new mongoose.Schema({
  name: { type: String, required: true },  // The name of the affiliation body
  code: { type: String, required: true },  // A unique code for the affiliation
});

// Create model from schema
const AffiliatedBy = mongoose.model('AffiliatedBy', affiliatedBySchema);

module.exports = AffiliatedBy;

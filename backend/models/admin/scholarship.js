const mongoose = require("mongoose");
const PlacementSchema = new mongoose.Schema({
  college_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "College",
    required: true
  },
  scholarship_details: {
    type: String,
    required: true // Stores entire formatted data (HTML, Markdown, JSON, etc.)
  },
  last_updated: { type: Date, default: Date.now }
});
module.exports = mongoose.model("Scholarips", PlacementSchema);
const mongoose = require('mongoose');

// Approval schema
const approvalSchema = new mongoose.Schema({
  name: { type: String, required: true },  // The name of the approval type
  code: { type: String, required: true },  // A unique code for the approval
});

// Create model from schema
const Approval = mongoose.model('Approval', approvalSchema);

module.exports = Approval;

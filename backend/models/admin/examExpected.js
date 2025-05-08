const mongoose = require('mongoose');

// ExamsAccepted schema
const examsAcceptedSchema = new mongoose.Schema({
  name: { type: String, required: true },  // The name of the exam (e.g., JEE, NEET)
  code: { type: String, required: true },  // A unique code for the exam
});

// Create model from schema
const ExamsAccepted = mongoose.model('ExamsAccepted', examsAcceptedSchema);

module.exports = ExamsAccepted;

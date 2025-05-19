const mongoose = require('mongoose');

// Specialization schema
const specializationSchema = new mongoose.Schema({
  name: { type: String, required: true },  // The name of the specialization
});

// Create model from schema
const Specialization = mongoose.model('Specialization', specializationSchema);

module.exports = Specialization;

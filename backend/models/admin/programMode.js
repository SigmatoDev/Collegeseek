const mongoose = require('mongoose');

// Program Mode schema
const programModeSchema = new mongoose.Schema({
  name: { type: String, required: true }, // The name of the program mode
});

// Create model from schema
const ProgramMode = mongoose.model('ProgramMode', programModeSchema);

module.exports = ProgramMode;

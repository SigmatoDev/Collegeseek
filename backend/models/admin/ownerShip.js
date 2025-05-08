const mongoose = require('mongoose');

// Ownership schema
const ownershipSchema = new mongoose.Schema({
  name: { type: String, required: true },  // The name of the ownership type
});

// Create model from schema
const Ownership = mongoose.model('Ownership', ownershipSchema);

module.exports = Ownership;

const mongoose = require('mongoose');

// Stream schema
const streamSchema = new mongoose.Schema({
  name: { type: String, required: true },  // The name of the stream
  image: { type: String, required: false },  // <-- updated field
});

// Create model from schema
const Stream = mongoose.model('Stream', streamSchema);

module.exports = Stream;

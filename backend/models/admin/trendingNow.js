// models/Exam.js
const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
});

const Exam = mongoose.model('Trending Now', examSchema);

module.exports = Exam;

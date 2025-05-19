const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
    image: { type: String, required: false }, // <-- updated field
});

module.exports = mongoose.model('CoursesList', courseSchema);

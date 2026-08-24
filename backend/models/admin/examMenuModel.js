const mongoose = require('mongoose');

// Define the Link Schema
const linkSchema = new mongoose.Schema({
  label: { type: String, required: true },
  url: { type: String, required: true }
}, { _id: true });  // Ensures each link has its own _id

// Define the Column Schema
const columnSchema = new mongoose.Schema({
  title: { type: String, required: true },
  links: [linkSchema]  // Array of links under each column
}, { _id: true });  // Ensures each column has its own _id

// Define the Exam Menu Schema
const examMenuSchema = new mongoose.Schema({
  name: { type: String, required: true },  // Menu name or title
  columns: [columnSchema]  // Array of columns in the menu
}, { _id: true });

// Create the Exam Menu Model
const ExamMenu = mongoose.model('ExamMenu', examMenuSchema);

module.exports = ExamMenu;


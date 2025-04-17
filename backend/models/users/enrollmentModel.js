// models/Enrollment.js

const mongoose = require("mongoose");

const EnrollmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    course: { type: String, required: true },
    message: { type: String, default: "" },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

const Enrollment = mongoose.model("Enrollment", EnrollmentSchema);

module.exports = Enrollment;

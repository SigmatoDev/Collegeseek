const mongoose = require("mongoose");

const careerApplicationSchema = new mongoose.Schema(
  {
    career: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Career",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    currentLocation: { type: String, required: true, trim: true },
    positionApplyingFor: { type: String, required: true, trim: true },
    jobLocation: { type: String, required: true, trim: true },
    employmentType: { type: String, required: true, trim: true },
    yearsOfExperience: { type: String, required: true, trim: true },
    resume: {
      path: { type: String, required: true },
      originalName: { type: String, required: true },
      mimeType: { type: String, required: true },
      size: { type: Number, required: true },
    },
    coverLetter: { type: String, trim: true, default: "" },
    linkedinProfile: { type: String, trim: true, default: "" },
    portfolioGithub: { type: String, trim: true, default: "" },
    additionalComments: { type: String, trim: true, default: "" },
    status: {
      type: String,
      enum: ["pending", "reviewing", "shortlisted", "rejected", "hired"],
      default: "pending",
    },
  },
  { timestamps: true }
);

careerApplicationSchema.index({ career: 1, user: 1 }, { unique: true });
careerApplicationSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model("CareerApplication", careerApplicationSchema);

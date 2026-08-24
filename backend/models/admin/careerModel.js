const mongoose = require("mongoose");
const slugify = require("slugify");

const careerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },

    slug: { type: String, required: true, unique: true, trim: true },

    location: { type: String, required: true, trim: true },

    employmentType: {
      type: String,
      required: true,
      enum: ["full-time", "part-time", "contract"],
    },

    experienceRequired: { type: String, required: true, trim: true },

    salary: { type: String, trim: true, default: "" },

    description: { type: String, required: true },

    responsibilities: { type: String, required: true },

    skillsAndQualifications: { type: String, required: true },

    benefits: { type: String, required: true },

    applicationDeadline: { type: Date, required: true },

    isPublished: { type: Boolean, default: false, index: true },

    metaTitle: { type: String, trim: true, default: "" },

    metaDescription: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

careerSchema.pre("validate", function () {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title, {
      lower: true,
      strict: true,
    });
  }
});

module.exports = mongoose.model("Career", careerSchema);
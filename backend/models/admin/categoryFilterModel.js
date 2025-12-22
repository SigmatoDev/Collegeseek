const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["streams", "exams", "courses"],
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    collegeIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "College" }],
    collegeCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    sortOrder: {
      type: Number,
      default: 0, // NEW: store order of category for drag & drop
    },
  },
  { timestamps: true }
);

// Update collegeCount automatically before saving
categorySchema.pre("save", function (next) {
  this.collegeCount = this.collegeIds?.length || 0;
  next();
});

module.exports = mongoose.models.Category || mongoose.model("CategoryFilter", categorySchema);

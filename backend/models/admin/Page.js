const mongoose = require("mongoose");

const pageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true, // Ensure slug is unique
    },
    description: {
      type: String,
      required: true,
    },
    modules: [
      {
        moduleId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Module", // Reference to the Module model
          required: true,
        },
        order: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create a unique index on the slug field (this ensures uniqueness at the database level)
pageSchema.index({ slug: 1 }, { unique: true });

module.exports = mongoose.model("Page", pageSchema);

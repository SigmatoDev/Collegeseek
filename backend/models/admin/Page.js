// models/Page.js

const mongoose = require("mongoose");

const pageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
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

module.exports = mongoose.model("Page", pageSchema);

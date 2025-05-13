// const mongoose = require("mongoose");

// const pageSchema = new mongoose.Schema(
//   {
//     title: {
//       type: String,
//       required: true,
//     },
//     slug: {
//       type: String,
//       required: true,
//       unique: true, // Ensure slug is unique
//     },
//     description: {
//       type: String,
//       required: true,
//     },
//     modules: [
//       {
//         moduleId: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "Module", // Reference to the Module model
//           required: true,
//         },
//         order: {
//           type: Number,
//           required: true,
//         },
//       },
//     ],
//   },
//   {
//     timestamps: true, // Automatically adds createdAt and updatedAt fields
//   }
// );

// // Create a unique index on the slug field (this ensures uniqueness at the database level)
// pageSchema.index({ slug: 1 }, { unique: true });

// module.exports = mongoose.model("Page", pageSchema);
const mongoose = require("mongoose");

const pageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    content: { type: Object, required: true }, // Editor.js block data
    slug: { type: String, required: true, unique: true }, // Add slug field with unique constraint
  },
  { timestamps: true } // Optional: add timestamps for createdAt and updatedAt
);

// Create a unique index for the slug field to ensure that slugs are unique
pageSchema.index({ slug: 1 }, { unique: true });

const Page = mongoose.model("Page", pageSchema);

module.exports = Page;

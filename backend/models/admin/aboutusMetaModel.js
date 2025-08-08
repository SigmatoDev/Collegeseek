// models/meta.model.js
const mongoose = require("mongoose");

const metaSchema = new mongoose.Schema(
  {
    page: { type: String, required: true, unique: true },

    title: { type: String },
    description: { type: String },
    keywords: [{ type: String }],

    openGraph: {
      title: String,
      description: String,
      url: String,
      siteName: String,
      type: String,
      images: [
        {
          url: String,
          width: Number,
          height: Number,
          alt: String,
        },
      ],
    },

    twitter: {
      card: String,
      title: String,
      description: String,
      images: [String],
    },

    alternates: {
      canonical: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("aboutMeta", metaSchema);

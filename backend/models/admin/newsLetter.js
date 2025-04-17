const mongoose = require("mongoose");

const callbackSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true },
    stream: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Callback", callbackSchema);

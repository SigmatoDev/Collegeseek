const mongoose = require("mongoose");

const collegeSchema = new mongoose.Schema(
  {
    // ✅ Basic College Details
    collegeId: {
      type: Number,
      unique: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, required: true }, // ✅ Add unique slug

    description: { type: String, required: true, trim: true },
    about: { type: String, required: true, default: "", trim: true },

    // ✅ Location Details
    state: { type: String, required: true, trim: true, index: true },
    city: { type: String, required: true, trim: true, index: true },
    address: { type: String, required: true, trim: true },
    location: { type: String, required: false, trim: true },

    // ✅ Ranking & Fees
    rank: { type: Number, required: true, min: 0, index: true },
    fees: { type: Number, default: 0, min: 0 },
    avgPackage: { type: Number, default: 0, min: 0 },
    // established_year:{ type: Number, default: 0, min: 0 },
    // university_type: { type: String, required: true, trim: true },
    // accreditation:{ type: String, required: true, trim: true },
    // pincode:{ type: Number, default: 0, min: 0 },
    // ✅ Tabs (Multiple Sections)
    tabs: {
      type: [
        {
          title: { type: String, required: false, trim: true },
          description: { type: String, required: false, trim: true },
        },
      ],
      default: [],
    },

    website: {
      type: String,
      required: true,
      trim: true,
      // validate: {
      //   validator: (v) =>
      //     /^(https?:\/\/|www\.)[\w.-]+(\.[a-z]{2,})(\/[\w./]*)?$/.test(v),
      //   message: (props) => `${props.value} is not a valid URL.`,
      // },
    },
    contact: {
      type: String,
      required: true,
      trim: true,
      // validate: {
      //   validator: (v) => /^(\+?\d{10,15})$/.test(v),
      //   message: "Invalid contact number. Use 10-15 digits only.",
      // },
    },
    contactEmail: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: false,
      // validate: {
      //   validator: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      //   message: "Invalid email address format.",
      // },
    },
    image: { type: String, default: "" },
    imageGallery: { type: [String], default: [] },
  },
  { timestamps: true }
);

// Auto-increment logic for collegeId
collegeSchema.pre("save", async function (next) {
  if (this.isNew) {
    const lastCollege = await mongoose
      .model("College")
      .findOne({}, {}, { sort: { collegeId: -1 } });
    this.collegeId = lastCollege?.collegeId ? lastCollege.collegeId + 1 : 1;
  }
  next();
});

module.exports = mongoose.model("College", collegeSchema);

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
    stream: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Stream' }],  // Ensure this is an array of ObjectIds
    approvel: [{ type: mongoose.Schema.Types.ObjectId, ref: "Approval", required: true }],
    affiliatedby: { type: mongoose.Schema.Types.ObjectId, ref: "AffiliatedBy", required: true},    
    examExpected: [{ type: mongoose.Schema.Types.ObjectId, ref: "ExamsAccepted", required: true }],
    ownership: { type: mongoose.Schema.Types.ObjectId, ref: "Ownership", required: true},    
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
  trim: true,
  validate: {
    validator: function (v) {
      // allow empty or undefined
      if (!v) return true;

      return /^(https?:\/\/|www\.)[\w.-]+(\.[a-z]{2,})(\/[\w./]*)?$/.test(v);
    },
    message: (props) => `${props.value} is not a valid URL.`,
  },
},
        // ✅ Multiple Contact Numbers
    contactNumbers: [
      {
        type: {
          type: String,
          enum: ["Mobile", "Landline"],
          required: true,
        },
        number: {
          type: String,
          required: true,
          trim: true,
          validate: {
            validator: (v) =>
              /^(\+?\d{10,15})$/.test(v) || // Mobile: +911234567890 / 10–15 digits
              /^(\d{2,5}[- ]?\d{6,8})$/.test(v), // Landline: 011-23456789
            message: "Invalid contact number format.",
          },
        },
      },
    ],
    
    contactEmail: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: false,
      validate: {
        validator: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
        message: "Invalid email address format.",
      },
    },
    featured: { type: Boolean, default: false },  // Add the featured field here
    image: { type: String, default: "" },
    imageGallery: { type: [String], default: [] },
  },
  { timestamps: true }
);

collegeSchema.index({ stream: 1 });
collegeSchema.index({ ownership: 1 });
collegeSchema.index({ approvel: 1 });
collegeSchema.index({ affiliatedby: 1 });
collegeSchema.index({ examExpected: 1 });

collegeSchema.index({ createdAt: -1 });
collegeSchema.index({ name: 1 });
collegeSchema.index({ name: 1, _id: -1 });

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

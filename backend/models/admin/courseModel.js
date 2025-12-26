const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema(
  {
    slug: { type: String, unique: true },
    name: {
      type: String,
      required: false,
    },
    specialization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Specialization", // this should match your Specialization model name
    },
    description: {
      type: String,
      required: true,
    },
    college_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CoursesList",
      required: true,
    },
    programMode: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProgramMode",
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },

    fees: {
      amount: {
        type: Number,
        required: true,
      },
      currency: {
        type: String,
        default: "INR",
      },
      year: {
        type: Number,
        required: true,
      },
    },
    eligibility: {
      type: String,
      required: false,
    },
    application_dates: {
      start_date: {
        type: Date,
      },
      end_date: {
        type: Date,
      },
    },

    ratings: {
      score: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
      },
      reviews_count: {
        type: Number,
        default: 0,
      },
    },
    placements: {
      median_salary: {
        type: Number,
      },
      currency: {
        type: String,
        default: "INR",
      },
      placement_rate: {
        type: Number,
      },
    },
    intake_capacity: {
      male: {
        type: Number,
      },
      female: {
        type: Number,
      },
      total: {
        type: Number,
      },
    },
    entrance_exam: {
      type: String,
    },
    examList: {
      type: [String],
      default: [],
    },
    focusAreas: {
      type: [String],
      default: [],
    },
    enrollmentLink: {
      type: String,
      required: false,
    },
    streams: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Stream", // must match your Stream model name
      },
    ],

    brochure_link: {
      type: String,
    },
    image: {
      type: String, // Image field to store the image URL or base64 string
      default: null,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

CourseSchema.index({ college_id: 1 });
CourseSchema.index({ category: 1 });
CourseSchema.index({ specialization: 1 });
CourseSchema.index({ programMode: 1 });
CourseSchema.index({ "fees.amount": 1 });

module.exports = mongoose.model("Course", CourseSchema);

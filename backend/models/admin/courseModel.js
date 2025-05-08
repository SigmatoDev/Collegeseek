const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema(
  {
    
    slug: { type: String, unique: true },
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    college_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: true
    },
   
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CoursesList",
      required: true
    },
    mode: {
      type: String,
      enum: ["Full-Time", "Part-Time", "Online"],
    },
    programMode: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProgramMode",
      required: true,
    },
    duration: {
      type: String,
      required: true
    },

    fees: {
      amount: {
        type: Number,
        required: true
      },
      currency: {
        type: String,
        default: "INR"
      },
      year: {
        type: Number,
        required: true
      }
    },
    eligibility: {
      type: String,
      required: false
    },
    application_dates: {
      start_date: {
        type: Date
      },
      end_date: {
        type: Date
      }
    },
   
    ratings: {
      score: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
      },
      reviews_count: {
        type: Number,
        default: 0
      }
    },
    placements: {
      median_salary: {
        type: Number
      },
      currency: {
        type: String,
        default: "INR"
      },
      placement_rate: {
        type: Number
      }
    },
    intake_capacity: {
      male: {
        type: Number
      },
      female: {
        type: Number
      },
      total: {
        type: Number
      }
    },
    entrance_exam: {
      type: String
    },
    enrollmentLink: {
      type: String,
      required: true
    },
    brochure_link: {
      type: String
    },
    image: {
      type: String, // Image field to store the image URL or base64 string
      default: null
    },
    created_at: {
      type: Date,
      default: Date.now
    },
    updated_at: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);



module.exports = mongoose.model("Course", CourseSchema);
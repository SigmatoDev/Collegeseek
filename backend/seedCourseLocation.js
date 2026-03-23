require("dotenv").config();
const mongoose = require("mongoose");

const Course = require("./models/admin/courseModel"); // adjust path
const College = require("./models/admin/collegemodel"); // adjust path

const MONGO_URI = process.env.MONGO_URI;

async function seedCourseLocation() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");

    const courses = await Course.find().select("_id college_id");
    console.log("Total courses:", courses.length);

    let bulkOps = [];
    let count = 0;

    for (const course of courses) {
      const college = await College.findById(course.college_id).select("state city");

      if (!college) continue;

      bulkOps.push({
        updateOne: {
          filter: { _id: course._id },
          update: {
            $set: {
              state: college.state,
              city: college.city,
            },
          },
        },
      });

      count++;

      if (bulkOps.length === 1000) {
        await Course.bulkWrite(bulkOps);
        console.log(`${count} courses updated`);
        bulkOps = [];
      }
    }

    if (bulkOps.length > 0) {
      await Course.bulkWrite(bulkOps);
    }

    console.log("Migration completed");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

seedCourseLocation();
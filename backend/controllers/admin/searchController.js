// const College = require("../../models/admin/collegemodel");
// const Course = require("../../models/admin/courseModel");

// const search = async (req, res) => {
//   try {
//     const query = req.query.query;
//     if (!query) {
//       return res.status(400).json({ message: "Search query is required." });
//     }

//     // Fetch top 3 matched colleges and courses
//     const colleges = await College.find({
//       name: { $regex: query, $options: "i" },
//     }).limit(3);

//     const courses = await Course.find({
//       name: { $regex: query, $options: "i" },
//     }).limit(3);

//     // Send structured result
//     res.json({
//       colleges,
//       courses,
//     });
//   } catch (error) {
//     console.error("Search Error:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// module.exports = { search };


const College = require("../../models/admin/collegemodel");
const Course = require("../../models/admin/courseModel");

const search = async (req, res) => {
  try {
    const query = req.query.query;
    if (!query) {
      return res.status(400).json({ message: "Search query is required." });
    }

    // Fetch top matched colleges and courses
    const colleges = await College.find({
      name: { $regex: query, $options: "i" },
    });

    const courses = await Course.find({
      name: { $regex: query, $options: "i" },
    });

    // Filter for unique college names
    const uniqueColleges = [];
    const seenCollegeNames = new Set();
    for (const college of colleges) {
      if (!seenCollegeNames.has(college.name.toLowerCase())) {
        seenCollegeNames.add(college.name.toLowerCase());
        uniqueColleges.push(college);
      }
      if (uniqueColleges.length >= 3) break;
    }

    // Filter for unique course names
    const uniqueCourses = [];
    const seenCourseNames = new Set();
    for (const course of courses) {
      if (!seenCourseNames.has(course.name.toLowerCase())) {
        seenCourseNames.add(course.name.toLowerCase());
        uniqueCourses.push(course);
      }
      if (uniqueCourses.length >= 3) break;
    }

    res.json({
      colleges: uniqueColleges,
      courses: uniqueCourses,
    });
  } catch (error) {
    console.error("Search Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { search };

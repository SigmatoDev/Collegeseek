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


// const College = require("../../models/admin/collegemodel");
// const Course = require("../../models/admin/courseModel");

// const search = async (req, res) => {
//   try {
//     const query = req.query.query;
//     if (!query) {
//       return res.status(400).json({ message: "Search query is required." });
//     }

//     // Fetch top matched colleges and courses
//     const colleges = await College.find({
//       name: { $regex: query, $options: "i" },
//     });

//     const courses = await Course.find({
//       name: { $regex: query, $options: "i" },
//     });

//     // Filter for unique college names
//     const uniqueColleges = [];
//     const seenCollegeNames = new Set();
//     for (const college of colleges) {
//       if (!seenCollegeNames.has(college.name.toLowerCase())) {
//         seenCollegeNames.add(college.name.toLowerCase());
//         uniqueColleges.push(college);
//       }
//       if (uniqueColleges.length >= 3) break;
//     }

//     // Filter for unique course names
//     const uniqueCourses = [];
//     const seenCourseNames = new Set();
//     for (const course of courses) {
//       if (!seenCourseNames.has(course.name.toLowerCase())) {
//         seenCourseNames.add(course.name.toLowerCase());
//         uniqueCourses.push(course);
//       }
//       if (uniqueCourses.length >= 3) break;
//     }

//     res.json({
//       colleges: uniqueColleges,
//       courses: uniqueCourses,
//     });
//   } catch (error) {
//     console.error("Search Error:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// module.exports = { search };

const College = require("../../models/admin/collegemodel");
const CoursesList = require("../../models/admin/courseModel"); // updated course model
const ExamsAccepted = require("../../models/admin/examExpected");
const Specialization = require("../../models/admin/specialization");

const search = async (req, res) => {
  try {
    const query = req.query.query;
    if (!query) return res.status(400).json({ message: "Search query is required." });

    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10; // default 10 items per page
    const skip = (page - 1) * limit;

    // Search colleges
    const colleges = await College.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { state: { $regex: query, $options: "i" } },
        { city: { $regex: query, $options: "i" } },
        { examExpected: { $in: await getExamIds(query) } },
      ],
    }).skip(skip).limit(limit);

    // Search courses
    const courses = await CoursesList.find({ name: { $regex: query, $options: "i" } })
      .skip(skip)
      .limit(limit);

    // Search exams
    const exams = await ExamsAccepted.find({ name: { $regex: query, $options: "i" } })
      .skip(skip)
      .limit(limit);

    // Search specializations
    const specializations = await Specialization.find({ name: { $regex: query, $options: "i" } })
      .skip(skip)
      .limit(limit);

    // Filter unique results (no limit internally)
    const uniqueColleges = getUnique(colleges, "name");
    const uniqueCourses = getUnique(courses, "name");
    const uniqueExams = getUnique(exams, "name");
    const uniqueSpecializations = getUnique(specializations, "name");

    res.json({
      colleges: uniqueColleges,
      courses: uniqueCourses,
      exams: uniqueExams,
      specializations: uniqueSpecializations,
      page,
      limit,
    });
  } catch (error) {
    console.error("Search Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Helper to get exam IDs matching query
async function getExamIds(query) {
  const exams = await ExamsAccepted.find({ name: { $regex: query, $options: "i" } });
  return exams.map((exam) => exam._id);
}

// Helper to filter unique by key (no limit)
function getUnique(array, key) {
  const unique = [];
  const seen = new Set();
  for (const item of array) {
    const val = item[key].toLowerCase();
    if (!seen.has(val)) {
      seen.add(val);
      unique.push(item);
    }
  }
  return unique;
}

module.exports = { search };

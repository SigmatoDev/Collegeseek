// controllers/dashboardController.js

const User = require('../../models/users/auth/usersModel'); // User model for enrolled data
const Course = require('../../models/admin/courseModel'); // Course model (if needed to get course data)
const Shortlist = require('../../models/users/shortlistModel'); // Collection where users shortlist colleges
const Enrollment = require('../../models/users/enrollmentModel'); // Collection where users enroll in courses

// Get dashboard data (courses enrolled and colleges shortlisted)
const getDashboardData = async (req, res) => {
  try {
    // Get total number of users who enrolled in courses
    const totalEnrolledCourses = await Enrollment.countDocuments({}); // Counts all enrollments

    // Get total number of colleges shortlisted by users
    const totalShortlistedColleges = await Shortlist.countDocuments({
      "collegeId": { $exists: true }  // Checks if a college ID is present in the shortlist
    });

    // Respond with the data
    res.status(200).json({
      success: true,
      data: {
        coursesEnrolled: totalEnrolledCourses,
        collegesShortlisted: totalShortlistedColleges
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong, please try again later.'
    });
  }
};

module.exports = { getDashboardData };

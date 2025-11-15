// controllers/dashboardController.js

const User = require('../../models/users/auth/usersModel'); // User model for enrolled data
const Shortlist = require('../../models/users/shortlistModel'); // Collection where users shortlist colleges
const Enrollment = require('../../models/users/enrollmentModel'); // Collection where users enroll in courses
const Counselling = require('../../models/users/CounsellingModel');
const Contact = require('../../models/users/contactUsModel');

// Get dashboard data (courses enrolled and colleges shortlisted)
const getDashboardData = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const [
      totalEnrolledCourses,
      totalShortlistedColleges,
      totalUsers,
      counsellingRequests,
      contactQueries,
      newEnrollmentsThisWeek,
      recentEnrollments,
      enrollmentTrendRaw,
    ] = await Promise.all([
      Enrollment.countDocuments({}),
      Shortlist.countDocuments({ collegeId: { $exists: true } }),
      User.countDocuments({}),
      Counselling.countDocuments({}),
      Contact.countDocuments({}),
      Enrollment.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      Enrollment.find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name course createdAt email phone'),
      Enrollment.aggregate([
        { $match: { createdAt: { $gte: sevenDaysAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    // Ensure the trend includes empty days for smoother charts on the client
    const enrollmentTrend = Array.from({ length: 7 }).map((_, index) => {
      const date = new Date(sevenDaysAgo);
      date.setDate(sevenDaysAgo.getDate() + index);
      const key = date.toISOString().slice(0, 10);
      const dayData = enrollmentTrendRaw.find((item) => item._id === key);
      return {
        date: key,
        count: dayData ? dayData.count : 0,
      };
    });

    const totalLeads = counsellingRequests + contactQueries;
    const leadToEnrollmentRate = totalLeads
      ? Number(((totalEnrolledCourses / totalLeads) * 100).toFixed(1))
      : 0;

    const shortlistPerUser = totalUsers
      ? Number((totalShortlistedColleges / totalUsers).toFixed(1))
      : 0;

    res.status(200).json({
      success: true,
      data: {
        coursesEnrolled: totalEnrolledCourses,
        collegesShortlisted: totalShortlistedColleges,
        totalUsers,
        counsellingRequests,
        contactQueries,
        newEnrollmentsThisWeek,
        leadToEnrollmentRate,
        shortlistPerUser,
        enrollmentTrend,
        recentEnrollments,
      },
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

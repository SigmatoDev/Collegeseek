const CollegeModel = require("../../models/admin/collegemodel");
const CoursesModel = require("../../models/admin/courseModel");

const getFilteredColleges = async (req, res) => {
  try {
    const { degrees, states, cities, ranks, fees, page = 1, limit = 10 } = req.body;

    console.log("📥 Incoming Filters:");
    console.log("Degrees:", degrees);
    console.log("States:", states);
    console.log("Cities:", cities);
    console.log("Ranks:", ranks);
    console.log("Fees:", fees);
    console.log("🧭 Page:", page, "Limit:", limit);

    let collegeQuery = {};
    let matchedCourseCollegeIds = [];

    // 🔍 Step 1: Match Courses by Degrees
    if (degrees && degrees.length > 0) {
      const courseQuery = { category: { $in: degrees } };
      const matchedCourses = await CoursesModel.find(courseQuery).select("college_id");
      matchedCourseCollegeIds = [...new Set(matchedCourses.map(course => course.college_id.toString()))];
    }

    // 🏫 Step 2: Build College Query
    if (matchedCourseCollegeIds.length > 0) {
      collegeQuery._id = { $in: matchedCourseCollegeIds };
    }

    if (states?.length) collegeQuery.state = { $in: states };
    if (cities?.length) collegeQuery.city = { $in: cities };
    if (ranks?.length) collegeQuery.rank = { $in: ranks.map(Number) };

    if (fees && fees.length > 0) {
      const feeConditions = [];

      fees.forEach((feeRange) => {
        if (feeRange.includes("Below")) {
          const amount = parseInt(feeRange.replace(/\D/g, ""));
          feeConditions.push({ fees: { $lt: amount } });
        } else if (feeRange.includes("Above")) {
          const amount = parseInt(feeRange.replace(/\D/g, ""));
          feeConditions.push({ fees: { $gt: amount } });
        } else if (feeRange.includes("-")) {
          const [min, max] = feeRange.split("-").map((val) => parseInt(val.replace(/\D/g, "")));
          feeConditions.push({ fees: { $gte: min, $lte: max } });
        }
      });

      if (feeConditions.length > 0) {
        collegeQuery.$or = feeConditions;
      }
    }

    const finalQuery =
      degrees?.length && matchedCourseCollegeIds.length === 0
        ? {
            ...(states?.length && { state: { $in: states } }),
            ...(cities?.length && { city: { $in: cities } }),
            ...(ranks?.length && { rank: { $in: ranks.map(Number) } }),
            ...(fees?.length && {
              $or: fees.map((feeRange) => {
                if (feeRange.includes("Below")) {
                  const amount = parseInt(feeRange.replace(/\D/g, ""));
                  return { fees: { $lt: amount } };
                } else if (feeRange.includes("Above")) {
                  const amount = parseInt(feeRange.replace(/\D/g, ""));
                  return { fees: { $gt: amount } };
                } else if (feeRange.includes("-")) {
                  const [min, max] = feeRange.split("-").map((val) => parseInt(val.replace(/\D/g, "")));
                  return { fees: { $gte: min, $lte: max } };
                }
                return null;
              }).filter(Boolean),
            }),
          }
        : collegeQuery;

    const skip = (Number(page) - 1) * Number(limit);

    const [colleges, totalCount] = await Promise.all([
      CollegeModel.find(finalQuery)
        .select("name city state rank fees image")
        .skip(skip)
        .limit(Number(limit)),
      CollegeModel.countDocuments(finalQuery),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json({
      success: true,
      data: colleges,
      pagination: {
        total: totalCount,
        page: Number(page),
        limit: Number(limit),
        totalPages,
      },
    });
  } catch (error) {
    console.error("❌ Error in getFilteredColleges:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

module.exports = { getFilteredColleges };

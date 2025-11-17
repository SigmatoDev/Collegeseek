const Course = require("../../models/admin/courseModel");

// Return number of courses grouped by the college city
exports.getCourseCountsByCity = async (req, res) => {
  try {
    const { cities = [] } = req.body || {};

    const cityFilters = Array.isArray(cities)
      ? cities
          .filter((c) => typeof c === "string" && c.trim())
          .map((c) => new RegExp(`^${c}$`, "i"))
      : [];

    const pipeline = [
      {
        $lookup: {
          from: "colleges",
          localField: "college_id",
          foreignField: "_id",
          as: "college",
        },
      },
      { $unwind: "$college" },
    ];

    if (cityFilters.length) {
      pipeline.push({
        $match: {
          "college.city": { $in: cityFilters },
        },
      });
    }

    pipeline.push({
      $group: {
        _id: "$college.city",
        totalCourses: { $sum: 1 },
      },
    });

    const results = await Course.aggregate(pipeline);

    const counts = {};
    results.forEach((item) => {
      if (item?._id) {
        counts[item._id] = item.totalCourses;
      }
    });

    res.json({ counts, results });
  } catch (error) {
    console.error("Error getting course counts by city:", error);
    res.status(500).json({ error: "Failed to fetch course counts by city" });
  }
};

const Course = require("../../models/admin/courseModel");

const getCourses1 = async (req, res) => {
  try {
    const { page = 1, limit = 100, search = "" } = req.query;

    const query = search
      ? {
          $or: [
            { description: { $regex: search, $options: "i" } },
            { "specialization.name": { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const courses = await Course.find(query)
      .populate("specialization")
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalCourses = await Course.countDocuments(query);
    const totalPages = Math.ceil(totalCourses / limit);

    res.json({
      courses,
      totalPages,
      currentPage: parseInt(page),
      totalCourses,
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getCourses1 };

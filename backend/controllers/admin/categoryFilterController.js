const Category = require("../../models/admin/categoryFilterModel");
const Stream = require("../../models/admin/streams");
const ExamsAccepted = require("../../models/admin/examExpected");
const CoursesList = require("../../models/admin/coursesList");
const College = require("../../models/admin/collegemodel");
const Course = require("../../models/admin/courseModel");

/* ================================================================
   IN-MEMORY CACHE
   Invalidated on any write (add / delete / reorder).
   Change CACHE_TTL if you want time-based expiry as a safety net.
================================================================ */
let _cache = null;
let _cacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function invalidateCache() {
  _cache = null;
  _cacheTime = 0;
}

/* ================================================================
   SHARED AGGREGATION HELPER
   Called by both getAllCategories (legacy) and the merged endpoint.
================================================================ */
async function buildAggregatedData() {
  const now = Date.now();
  if (_cache && now - _cacheTime < CACHE_TTL) {
    return _cache;
  }

  const [
    streams,
    exams,
    coursesList,
    collegeCount,
    streamCountsAgg,
    examCountsAgg,
    courseCategoryAggregation,
  ] = await Promise.all([
    Stream.find({}, "name").lean(),
    ExamsAccepted.find({}, "code").lean(),
    CoursesList.find({}, "name").lean(),

    College.countDocuments(),

    // Stream counts — no lookup
    College.aggregate([
      { $unwind: "$stream" },
      { $group: { _id: "$stream", count: { $sum: 1 } } },
    ]),

    // Exam counts — no lookup
    College.aggregate([
      { $unwind: "$examExpected" },
      { $group: { _id: "$examExpected", count: { $sum: 1 } } },
    ]),

    // Course counts — unique colleges per category
    Course.aggregate([
      { $group: { _id: "$category", colleges: { $addToSet: "$college_id" } } },
    ]),
  ]);

  // ID → name/code maps
  const streamMap = {};
  streams.forEach((s) => (streamMap[s._id.toString()] = s.name));

  const examMap = {};
  exams.forEach((e) => (examMap[e._id.toString()] = e.code));

  // Build count objects
  const streamCounts = {};
  streamCountsAgg.forEach((item) => {
    const name = streamMap[item._id?.toString()];
    if (name) streamCounts[name] = item.count;
  });

  const examCounts = {};
  examCountsAgg.forEach((item) => {
    const code = examMap[item._id?.toString()];
    if (code) examCounts[code] = item.count;
  });

  const rawCourseCounts = {};
  courseCategoryAggregation.forEach((entry) => {
    if (entry._id && entry.colleges.length > 0) {
      rawCourseCounts[entry._id.toString()] = entry.colleges.length;
    }
  });

  const courseCounts = {};
  coursesList.forEach((c) => {
    const count = rawCourseCounts[c._id.toString()] || 0;
    if (count > 0) courseCounts[c.name] = count;
  });

  const result = {
    streams: streams.map((s) => s.name),
    exams: exams.map((e) => e.code),
    courses: coursesList.map((c) => c.name),
    collegeCount,
    streamCounts,
    examCounts,
    courseCounts,
  };

  _cache = result;
  _cacheTime = now;
  return result;
}

/* ================================================================
   GET /allCategoriesFilter
   Returns aggregated counts + selected filters in ONE request.
   Replaces the old two-call pattern on the frontend.
================================================================ */
const getAllCategories = async (req, res) => {
  try {
    const start = Date.now();

    const [aggregated, selected] = await Promise.all([
      buildAggregatedData(),
      // No populate — just the raw Category docs (type, name, _id, sortOrder)
      Category.find({}).sort({ sortOrder: 1 }).lean(),
    ]);

    console.log(`⚡ getAllCategories: ${Date.now() - start} ms`);

    res.status(200).json({
      ...aggregated,
      selected, // replaces the separate getCategoriesFilter call
    });
  } catch (error) {
    console.error("❌ Error in getAllCategories:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

/* ================================================================
   GET /getCategoriesFilter
   Kept for backwards compatibility. No populate — just a direct
   Category.find(). Fast. If you migrate the frontend to use
   getAllCategories.selected, you can delete this entirely.
================================================================ */
const getCategories = async (req, res) => {
  try {
    const { type } = req.query;
    const filter = type ? { type } : {};
    const categories = await Category.find(filter).sort({ sortOrder: 1 }).lean();
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error in getCategories:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

/* ================================================================
   CREATE  POST /addCategoriesFilter
================================================================ */
const createCategory = async (req, res) => {
  try {
    const { type, name, collegeId } = req.body;

    if (!type || !name) {
      return res.status(400).json({ message: "Type and Name are required" });
    }

    let category = await Category.findOne({ type, name });

    if (category) {
      if (collegeId && !category.collegeIds.includes(collegeId)) {
        category.collegeIds.push(collegeId);
        category.collegeCount = category.collegeIds.length;
        await category.save();
      }
      invalidateCache();
      return res.status(200).json(category);
    }

    category = await Category.create({
      type,
      name,
      collegeIds: collegeId ? [collegeId] : [],
      collegeCount: collegeId ? 1 : 0,
    });

    invalidateCache();
    res.status(201).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error });
  }
};

/* ================================================================
   GET /getCategoriesFilter/:id
================================================================ */
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).lean();
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(category);
  } catch (error) {
    console.error("Error in getCategoryById:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

/* ================================================================
   DELETE /deleteCategoriesFilter/:id
================================================================ */
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    invalidateCache();
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

/* ================================================================
   POST /updateCategoriesOrder
================================================================ */
const updateCategoryOrder = async (req, res) => {
  try {
    const { type, orderedIds } = req.body;

    if (!type || !Array.isArray(orderedIds)) {
      return res.status(400).json({ message: "Invalid payload" });
    }

    await Promise.all(
      orderedIds.map((id, index) =>
        Category.findOneAndUpdate(
          { _id: id, type }, // ✅ IMPORTANT FIX
          { sortOrder: index }
        )
      )
    );

    invalidateCache();

    return res.status(200).json({
      success: true,
      message: "Order updated successfully",
    });
  } catch (err) {
    console.error("Order update error:", err);
    res.status(500).json({ message: "Server Error", error: err });
  }
};
module.exports = {
  getAllCategories,
  getCategories,
  createCategory,
  getCategoryById,
  deleteCategory,
  updateCategoryOrder,
};
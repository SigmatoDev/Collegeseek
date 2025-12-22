const Category = require("../../models/admin/categoryFilterModel");
const Stream = require("../../models/admin/streams");
const ExamsAccepted = require("../../models/admin/examExpected");
const CoursesList = require("../../models/admin/coursesList");
const College = require("../../models/admin/collegemodel");
const Course = require("../../models/admin/courseModel"); // your Course model

const getAllCategories = async (req, res) => {
  try {
    // Fetch all items from master collections
    const streams = await Stream.find({}, "name").lean();
    const exams = await ExamsAccepted.find({}, "code").lean(); // <-- fetch code
    const coursesList = await CoursesList.find({}, "name").lean();

    const collegeCount = await College.countDocuments();

    // Initialize count maps
    const streamCounts = {};
    const examCounts = {};
    const courseCounts = {};

    // Fetch colleges with populated streams and exams
    const allColleges = await College.find({})
      .populate("stream", "name")
      .populate("examExpected", "code") // <-- use code here
      .lean();

    allColleges.forEach((college) => {
      // Count streams
      (college.stream || []).forEach((s) => {
        if (s?.name) streamCounts[s.name] = (streamCounts[s.name] || 0) + 1;
      });

      // Count exams by code
      (college.examExpected || []).forEach((e) => {
        if (e?.code) examCounts[e.code] = (examCounts[e.code] || 0) + 1; // <-- code
      });
    });

    // Count courses per category (distinct colleges offering that category)
    const courseCategoryAggregation = await Course.aggregate([
      {
        $group: {
          _id: "$category",
          colleges: { $addToSet: "$college_id" },
        },
      },
    ]);

    courseCategoryAggregation.forEach((entry) => {
      if (entry._id && entry.colleges.length > 0) {
        courseCounts[entry._id.toString()] = entry.colleges.length;
      }
    });

    // Map courseCounts _id to name
    const courseCountsByName = {};
    coursesList.forEach((c) => {
      const count = courseCounts[c._id.toString()] || 0;
      if (count > 0) courseCountsByName[c.name] = count;
    });

    res.status(200).json({
      streams: streams.map((s) => s.name),
      exams: exams.map((e) => e.code), // <-- return exam code
      courses: coursesList.map((c) => c.name),
      collegeCount,
      streamCounts,
      examCounts,
      courseCounts: courseCountsByName,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error });
  }
};

// =========================
// CRUD for older Category model
// =========================

// GET all categories

const getCategories = async (req, res) => {
  try {
    const { type } = req.query;
    const filter = type ? { type } : {};

    // Fetch all categories
    const categories = await Category.find(filter).sort({ sortOrder: 1 }).lean();
    console.log("Fetched categories:", categories.length);

    // Count maps
    const countsById = {};
    const countsByName = {};
    const countsByCode = {};

    /* ---------------- STREAM COUNTS ---------------- */
    if (!type || type === "streams") {
      const colleges = await College.find({})
        .populate("stream", "name")
        .lean();

      colleges.forEach(col => {
        (col.stream || []).forEach(s => {
          if (!s) return;
          const id = s._id.toString();
          countsById[id] = (countsById[id] || 0) + 1;
          countsByName[s.name] = (countsByName[s.name] || 0) + 1;
        });
      });
      console.log("Stream counts:", countsByName);
    }

    /* ---------------- EXAM COUNTS ---------------- */
    if (!type || type === "exams") {
      const colleges = await College.find({})
        .populate("examExpected", "name code")
        .lean();

      colleges.forEach(col => {
        (col.examExpected || []).forEach(e => {
          if (!e) return;
          const id = e._id.toString();
          countsById[id] = (countsById[id] || 0) + 1;
          countsByName[e.name] = (countsByName[e.name] || 0) + 1;
          countsByCode[e.code] = (countsByCode[e.code] || 0) + 1;
        });
      });
      console.log("Exam counts:", countsByName);
    }

    /* ---------------- COURSE COUNTS ---------------- */
/* ---------------- COURSE COUNTS (LIKE STREAMS & EXAMS) ---------------- */
if (!type || type === "courses") {
  const courses = await Course.find({})
    .populate("college_id", "_id")
    .populate("category", "name code")
    .lean();

  // categoryId -> Set of unique collegeIds
  const categoryCollegeMap = {};

  courses.forEach(course => {
    if (!course.category || !course.college_id) return;

    const categoryId = course.category._id.toString();
    const collegeId = course.college_id._id.toString();

    if (!categoryCollegeMap[categoryId]) {
      categoryCollegeMap[categoryId] = new Set();
    }

    // one college counted only once per category
    categoryCollegeMap[categoryId].add(collegeId);

    // fallback maps (name/code)
    countsByName[course.category.name] =
      (countsByName[course.category.name] || 0) + 1;

    if (course.category.code) {
      countsByCode[course.category.code] =
        (countsByCode[course.category.code] || 0) + 1;
    }
  });

  // Final college counts per category
  Object.entries(categoryCollegeMap).forEach(([catId, collegeSet]) => {
    countsById[catId] = collegeSet.size;
  });

  console.log("Course category → college counts:", countsById);
}




    /* ---------------- FINAL MAPPING ---------------- */
    const finalData = categories.map(cat => {
      const id = cat._id?.toString();
      const name = cat.name;
      const code = cat.code;

      // Determine type
      let catType = cat.type || "courses"; // default to courses

      const count =
        countsById[id] ?? countsByName[name] ?? countsByCode[code] ?? 0;

      return {
        ...cat,
        type: catType,
        count,
      };
    });

    console.log("Final mapped categories:", finalData);

    res.status(200).json(finalData);
  } catch (error) {
    console.error("Error in getCategories:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};




// CREATE a new category
const createCategory = async (req, res) => {
  try {
    const { type, name, collegeId } = req.body; // optional collegeId

    if (!type || !name) {
      return res.status(400).json({ message: "Type and Name are required" });
    }

    // Check if category exists
    let category = await Category.findOne({ type, name });

    if (category) {
      // If category exists and a collegeId is provided, add it to collegeIds
      if (collegeId && !category.collegeIds.includes(collegeId)) {
        category.collegeIds.push(collegeId);
        category.collegeCount = category.collegeIds.length; // update count
        await category.save();
      }
      return res.status(200).json(category);
    }

    // Create new category
    category = await Category.create({
      type,
      name,
      collegeIds: collegeId ? [collegeId] : [],
      collegeCount: collegeId ? 1 : 0,
    });

    res.status(201).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error });
  }
};

// DELETE category by ID
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

const updateCategoryOrder = async (req, res) => {
  try {
    const { type, orderedIds } = req.body; // type: streams/exams/courses, orderedIds: [_id1, _id2, ...]

    for (let i = 0; i < orderedIds.length; i++) {
      await Category.findByIdAndUpdate(orderedIds[i], { sortOrder: i });
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error", error: err });
  }
};

module.exports = {
  getAllCategories, // fetch from Stream, Exams, Courses + college count
  getCategories, // fetch from older Category model
  createCategory,
  deleteCategory,
  updateCategoryOrder,
};

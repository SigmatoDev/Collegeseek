const mongoose = require("mongoose");
const slugify = require("slugify"); // <-- Add this
const Course = require("../../models/admin/courseModel");
const College = require("../../models/admin/collegemodel");
const CoursesList = require("../../models/admin/coursesList"); // Adjust path if necessary
const ProgramMode = require("../../models/admin/programMode"); // Adjust path if necessary
const Specialization = require("../../models/admin/specialization"); // <- Capitalize for consistency
const Streams = require("../../models/admin/streams");


// Get all courses
const getCourse = async (req, res) => {
  try {
    const { college_id } = req.query;

    if (!college_id) {
      return res.status(400).json({ message: "college_id is required" });
    }

    const courses = await Course.find({ college_id })
      .populate("category", "name")
      .populate("programMode", "name")
      .lean(); // 🚀 faster read-only queries

    res.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ message: "Failed to fetch courses" });
  }
};


// Get paginated courses with full population
const getCourses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const skip = (page - 1) * limit;
    const search = (req.query.search || "").toString().trim();

    if (search) {
      const regex = new RegExp(search, "i");
      const feeMatch = !Number.isNaN(Number(search))
        ? { "fees.amount": Number(search) }
        : null;
      const basePipeline = [
        {
          $lookup: {
            from: "specializations",
            localField: "specialization",
            foreignField: "_id",
            as: "specialization",
          },
        },
        { $unwind: { path: "$specialization", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "colleges",
            localField: "college_id",
            foreignField: "_id",
            as: "college_id",
          },
        },
        { $unwind: { path: "$college_id", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "courseslists",
            localField: "category",
            foreignField: "_id",
            as: "category",
          },
        },
        { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "programmodes",
            localField: "programMode",
            foreignField: "_id",
            as: "programMode",
          },
        },
        { $unwind: { path: "$programMode", preserveNullAndEmptyArrays: true } },
        {
          $match: {
            $or: [
              { name: regex },
              { description: regex },
              { duration: regex },
              { entrance_exam: regex },
              { eligibility: regex },
              { "specialization.name": regex },
              { "college_id.name": regex },
              { "category.name": regex },
              { "programMode.name": regex },
              feeMatch,
            ].filter(Boolean),
          },
        },
      ];

      const courses = await Course.aggregate([
        ...basePipeline,
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
      ]);

      const totalAgg = await Course.aggregate([
        ...basePipeline,
        { $count: "total" },
      ]);

      const totalCourses = totalAgg[0]?.total || 0;

      return res.json({
        courses,
        totalPages: Math.ceil(totalCourses / limit),
        currentPage: page,
      });
    }

    const courses = await Course.find()
      .populate("specialization", "name")
      .populate("college_id", "name slug")
      .populate("category", "name")
      .populate("programMode", "name")
      .skip(skip)
      .limit(limit);

    const totalCourses = await Course.countDocuments();

    res.json({
      courses,
      totalPages: Math.ceil(totalCourses / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ message: "Failed to fetch courses" });
  }
};
// const getCourses = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 100;
//     const skip = (page - 1) * limit;

//     const search = (req.query.search || "").toString().trim();

//     const {
//       streams = [],
//       states = [],
//       cities = [],
//       courseTypes = [],
//       feeRanges = [],
//       durations = [],
//     } = req.body || {};

//     let matchStage = {};

//     /* ---------------- STREAM FILTER ---------------- */
//     if (streams.length) {
//       matchStage.streams = {
//         $in: streams.map((id) => new mongoose.Types.ObjectId(id)),
//       };
//     }

//     /* ---------------- STATE FILTER ---------------- */
//     if (states.length) {
//       matchStage.state = { $in: states };
//     }

//     /* ---------------- CITY FILTER ---------------- */
//     if (cities.length) {
//       matchStage.city = { $in: cities };
//     }

//     /* ---------------- COURSE TYPE FILTER ---------------- */
//     if (courseTypes.length) {
//       matchStage.programMode = {
//         $in: courseTypes.map((id) => new mongoose.Types.ObjectId(id)),
//       };
//     }

//     /* ---------------- FEE RANGE FILTER ---------------- */
//     if (feeRanges.length) {
//       const feeConditions = feeRanges.map((range) => {
//         const [min, max] = range.split("-").map(Number);

//         return {
//           "fees.amount": {
//             ...(min ? { $gte: min } : {}),
//             ...(max ? { $lte: max } : {}),
//           },
//         };
//       });

//       matchStage.$or = feeConditions;
//     }

//     /* ---------------- DURATION FILTER ---------------- */
//     if (durations.length) {
//       matchStage.duration = {
//         $in: durations.map((d) => new RegExp(d, "i")),
//       };
//     }

//     const regex = search ? new RegExp(search, "i") : null;

//     /* ---------------- AGGREGATION PIPELINE ---------------- */

//     const pipeline = [
//       { $match: matchStage },

//       /* ------------ LOOKUPS ------------ */

//       {
//         $lookup: {
//           from: "specializations",
//           localField: "specialization",
//           foreignField: "_id",
//           as: "specialization",
//         },
//       },
//       { $unwind: { path: "$specialization", preserveNullAndEmptyArrays: true } },

//       {
//         $lookup: {
//           from: "colleges",
//           localField: "college_id",
//           foreignField: "_id",
//           as: "college_id",
//         },
//       },
//       { $unwind: { path: "$college_id", preserveNullAndEmptyArrays: true } },

//       {
//         $lookup: {
//           from: "courseslists",
//           localField: "category",
//           foreignField: "_id",
//           as: "category",
//         },
//       },
//       { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },

//       {
//         $lookup: {
//           from: "programmodes",
//           localField: "programMode",
//           foreignField: "_id",
//           as: "programMode",
//         },
//       },
//       { $unwind: { path: "$programMode", preserveNullAndEmptyArrays: true } },
//     ];

//     /* ---------------- SEARCH FILTER ---------------- */

//     if (regex) {
//       pipeline.push({
//         $match: {
//           $or: [
//             { name: regex },
//             { description: regex },
//             { duration: regex },
//             { eligibility: regex },
//             { "specialization.name": regex },
//             { "college_id.name": regex },
//             { "category.name": regex },
//             { "programMode.name": regex },
//           ],
//         },
//       });
//     }

//     /* ---------------- RESPONSE OPTIMIZATION ---------------- */

//     pipeline.push({
//       $project: {
//         name: 1,
//         slug: 1,
//         duration: 1,
//         state: 1,
//         city: 1,
//         fees: 1,
//         image: 1,
//         specialization: 1,
//         college_id: 1,
//         category: 1,
//         programMode: 1,
//         createdAt: 1,
//       },
//     });

//     /* ---------------- PAGINATION + COUNT (FAST) ---------------- */

//     pipeline.push({
//       $facet: {
//         courses: [
//           { $sort: { createdAt: -1 } },
//           { $skip: skip },
//           { $limit: limit },
//         ],
//         totalCount: [{ $count: "total" }],
//       },
//     });

//     const result = await Course.aggregate(pipeline);

//     const courses = result[0].courses;
//     const totalCourses = result[0].totalCount[0]?.total || 0;

//     res.json({
//       courses,
//       totalPages: Math.ceil(totalCourses / limit),
//       currentPage: page,
//       totalCourses,
//     });
//   } catch (error) {
//     console.error("Error fetching courses:", error);
//     res.status(500).json({ message: "Failed to fetch courses" });
//   }
// };
// Get course by ID
const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid course ID format" });
    }

    const course = await Course.findById(id).populate(
      "college_id",
      "name location"
    );
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json(course);
  } catch (error) {
    console.error("Error fetching course:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch course", error: error.message });
  }
};


const createCourse = async (req, res) => {
  try {
    console.log("🔥 Incoming course data:", req.body);

    let { college_id, category, name, streams, ...courseData } = req.body;

    // Normalize college_id
    if (!mongoose.Types.ObjectId.isValid(college_id)) {
      const college = await College.findOne({ name: college_id });
      if (!college) {
        console.log("❌ College not found:", college_id);
        return res.status(400).json({ message: "College not found" });
      }
      college_id = college._id;
    }
    console.log("✅ Normalized college_id:", college_id);

    // ✅ Fetch state & city from college
    const collegeData = await College.findById(college_id).select("state city");

    if (!collegeData) {
      return res.status(400).json({ message: "College not found" });
    }

    // Normalize category
    let courseCategory;

    if (mongoose.Types.ObjectId.isValid(category)) {
      courseCategory = await CoursesList.findById(category);
    } else {
      courseCategory = await CoursesList.findOne({ name: category });
    }

    if (!courseCategory) {
      console.log("❌ Category not found:", category);
      return res.status(400).json({ message: "Category not found" });
    }
    console.log("✅ Normalized category:", courseCategory._id);

    // Normalize streams
    if (!mongoose.Types.ObjectId.isValid(streams)) {
      const streamDoc = await Streams.findOne({ name: streams });
      if (!streamDoc) {
        console.log("❌ Stream not found:", streams);
        return res.status(400).json({ message: "Stream not found" });
      }
      streams = streamDoc._id;
    }
    console.log("✅ Normalized streams:", streams);

    // Generate unique slug
    let slug = slugify(name, { lower: true, strict: true });
    let existingCourse = await Course.findOne({ slug });
    let counter = 1;

    while (existingCourse) {
      slug = `${slugify(name, { lower: true, strict: true })}-${counter}`;
      existingCourse = await Course.findOne({ slug });
      counter++;
    }

    const imageUrl = req.file ? `/uploads/courses/${req.file.filename}` : null;

    // Final data before saving
    const courseToCreate = {
      ...courseData,
      name,
      slug,
      college_id,
      state: collegeData.state,   // ✅ auto-filled
      city: collegeData.city,     // ✅ auto-filled
      category: courseCategory._id,
      streams,
      image: imageUrl,
    };

    console.log("📦 Final course object to save:", courseToCreate);

    const newCourse = new Course(courseToCreate);
    await newCourse.save();

    console.log("✅ Course created successfully:", newCourse._id);

    res.status(201).json(newCourse);

  } catch (error) {
    console.error("❌ Error creating course:", error);
    res.status(500).json({
      message: "Failed to create course",
      error: error.message
    });
  }
};



const updateCourse = async (req, res) => {
  try {
    let {
      name,
      college,
      college_id,
      category,
      programMode,
      specialization,
      streams,
      ...rest
    } = req.body;

    console.log("Incoming request body:", req.body);

    /** ------------------ COLLEGE ------------------ **/
    if (college && typeof college === "object" && college._id) {
      college_id = college._id;
    }

    if (college_id && mongoose.Types.ObjectId.isValid(college_id)) {
      // ok
    } else if (college_id && typeof college_id === "string") {
      const collegeDoc = await College.findOne({ name: college_id });
      if (!collegeDoc) {
        return res.status(400).json({ message: "College not found" });
      }
      college_id = collegeDoc._id;
    }

    // ✅ Fetch state & city if college is present
    let state;
    let city;

    if (college_id) {
      const collegeData = await College.findById(college_id).select("state city");

      if (collegeData) {
        state = collegeData.state;
        city = collegeData.city;
      }
    }

    /** ------------------ CATEGORY ------------------ **/
    if (category && typeof category === "object" && category._id) {
      category = category._id;
    } else if (category && !mongoose.Types.ObjectId.isValid(category)) {
      const categoryDoc = await CoursesList.findOne({ name: category });
      if (!categoryDoc) {
        return res.status(400).json({ message: "Category not found" });
      }
      category = categoryDoc._id;
    }

    /** ------------------ PROGRAM MODE ------------------ **/
    if (programMode && typeof programMode === "object" && programMode._id) {
      programMode = programMode._id;
    } else if (programMode && !mongoose.Types.ObjectId.isValid(programMode)) {
      const pmDoc = await ProgramMode.findOne({ name: programMode });
      if (!pmDoc) {
        return res.status(400).json({ message: "Program mode not found" });
      }
      programMode = pmDoc._id;
    }

    /** ------------------ SPECIALIZATION ------------------ **/
    if (specialization && typeof specialization === "object" && specialization._id) {
      specialization = specialization._id;
    } else if (specialization && !mongoose.Types.ObjectId.isValid(specialization)) {
      const spDoc = await Specialization.findOne({ name: specialization });
      if (!spDoc) {
        return res.status(400).json({ message: "Specialization not found" });
      }
      specialization = spDoc._id;
    }

    /** ------------------ STREAMS ------------------ **/
    if (streams && Array.isArray(streams)) {
      streams = await Promise.all(
        streams.map(async (s) => {
          if (typeof s === "object" && s._id) return s._id;
          if (mongoose.Types.ObjectId.isValid(s)) return s;

          const sDoc = await Streams.findOne({ name: s });
          if (!sDoc) throw new Error(`Stream "${s}" not found`);

          return sDoc._id;
        })
      );
    } else if (streams && typeof streams === "string") {
      if (mongoose.Types.ObjectId.isValid(streams)) {
        streams = [streams];
      } else {
        const sDoc = await Streams.findOne({ name: streams });
        if (!sDoc) {
          return res.status(400).json({ message: "Stream not found" });
        }
        streams = [sDoc._id];
      }
    }

    /** ------------------ UPDATE ------------------ **/
    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      {
        ...rest,
        ...(name && { name }),
        ...(college_id && { college_id }),
        ...(state && { state }),   // ✅ auto update
        ...(city && { city }),     // ✅ auto update
        ...(category && { category }),
        ...(programMode && { programMode }),
        ...(specialization && { specialization }),
        ...(streams && { streams }),
      },
      {
        new: true,
        runValidators: true,
      }
    ).populate("college_id category programMode specialization streams");

    if (!updatedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json(updatedCourse);

  } catch (error) {
    console.error("Error updating course:", error);

    res.status(500).json({
      message: "Failed to update course",
      error: error.message,
    });
  }
};

// Get course by slug
const getCourseBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    console.log("Incoming slug:", slug);

    if (!slug || typeof slug !== "string") {
      return res.status(400).json({ message: "Invalid slug provided" });
    }

    const course = await Course.findOne({ slug })
      .populate("college_id", "name location")
      .populate("category", "name"); // Populate category

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    return res.status(200).json(course);
  } catch (error) {
    console.error("Error fetching course by slug:", error.message);
    return res
      .status(500)
      .json({
        message: "Failed to fetch course by slug",
        error: error.message,
      });
  }
};

// Get courses by specialization name
const getCoursesBySpecialization = async (req, res) => {
  try {
    const { specialization } = req.params;

    console.log("Incoming specialization:", specialization);

    if (!specialization || typeof specialization !== "string") {
      return res
        .status(400)
        .json({ message: "Invalid specialization provided" });
    }

    // Optional: if specialization is stored in another model and referenced by ID
    const matchedSpecialization = await Specialization.findOne({
      name: specialization,
    });

    if (!matchedSpecialization) {
      return res.status(404).json({ message: "Specialization not found" });
    }

    const courses = await Course.find({
      specialization: matchedSpecialization._id,
    })
      .populate("college_id", "name location")
      .populate("category", "name");

    return res.status(200).json(courses);
  } catch (error) {
    console.error("Error fetching courses by specialization:", error.message);
    return res
      .status(500)
      .json({ message: "Failed to fetch courses", error: error.message });
  }
};

// Delete a course
const deleteCourse = async (req, res) => {
  try {
    const deletedCourse = await Course.findByIdAndDelete(req.params.id);
    if (!deletedCourse)
      return res.status(404).json({ message: "Course not found" });

    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ message: "Failed to delete course" });
  }
};

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  getCourse,
  updateCourse,
  deleteCourse,
  getCourseBySlug,
  getCoursesBySpecialization,
};

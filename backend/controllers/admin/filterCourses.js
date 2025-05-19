const Course = require("../../models/admin/courseModel");
const Specialization = require('../../models/admin/specialization'); // <- add this


const getCourseFilters = async (req, res) => {
  const { name } = req.query;
  if (!name) {
    return res.status(400).json({ message: "Course name is required" });
  }
  try {
    const courses = await Course.find({
      name: { $regex: name, $options: "i" }
    })
      .populate("programMode", "_id name")
      .populate("college_id", "_id name");
    if (courses.length === 0) {
      return res.status(404).json({ message: "No courses found with that name" });
    }
    const uniqueDurations = new Set();
    const uniqueModes = new Set();
    const uniqueProgramModes = new Set();
    const uniqueColleges = new Set();
    let minFees = Infinity;
    let maxFees = -Infinity;
    let minRating = Infinity;
    let maxRating = -Infinity;
    courses.forEach(course => {
      if (course.duration) uniqueDurations.add(course.duration);
      if (course.mode) uniqueModes.add(course.mode);
      if (course.programMode?._id) uniqueProgramModes.add(JSON.stringify(course.programMode));
      if (course.college_id?._id) uniqueColleges.add(JSON.stringify(course.college_id));
      const amount = course.fees?.amount;
      const rating = course.ratings?.score;
      if (typeof amount === 'number') {
        minFees = Math.min(minFees, amount);
        maxFees = Math.max(maxFees, amount);
      }
      if (typeof rating === 'number') {
        minRating = Math.min(minRating, rating);
        maxRating = Math.max(maxRating, rating);
      }
    });
    const generateRanges = (min, max, labelPrefix = '', unit = '') => {
      if (!isFinite(min) || !isFinite(max) || min >= max) return [];
      const step = Math.ceil((max - min) / 3);
      const r1Max = min + step;
      const r2Max = r1Max + step;
      return [
        {
          label: `${unit}${Math.floor(min)} – ${unit}${r1Max}`,
          min,
          max: r1Max
        },
        {
          label: `${unit}${r1Max + 1} – ${unit}${r2Max}`,
          min: r1Max + 1,
          max: r2Max
        },
        {
          label: `${unit}${r2Max + 1} and above`,
          min: r2Max + 1,
          max
        }
      ].filter(r => r.min <= r.max);
    };
    const feeLevels = generateRanges(minFees, maxFees, '', '₹');
    const ratingLevels = generateRanges(minRating, maxRating);
    res.status(200).json({
      durations: Array.from(uniqueDurations),
      modes: Array.from(uniqueModes),
      programModes: Array.from(uniqueProgramModes).map(pm => JSON.parse(pm)),
      colleges: Array.from(uniqueColleges).map(clg => JSON.parse(clg)),
      feeLevels,
      ratingLevels
    });
  } catch (error) {
    console.error("Error fetching course filters:", error);
    res.status(500).json({ message: "Failed to fetch course filters", error });
  }
};





const getFilterdCourses = async (req, res) => {
  try {
    const { filters } = req.body;

    let query = {};

    if (filters && filters.length > 0) {
      query = {
        $or: [
          { duration: { $in: filters } },
          { mode: { $in: filters } },
          // Add more filter fields here if needed
        ]
      };
    }

    const courses = await Course.find(query)
      .populate("category", "name");

    res.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ message: "Failed to fetch courses" });
  }
};



const getCoursesWithCommonNames = async (req, res) => {
  try {
    const courses = await Course.aggregate([
      {
        $group: {
          _id: "$name",
          course: { $first: "$$ROOT" }, // One sample course for info
          minDuration: { $min: "$duration" },
          maxDuration: { $max: "$duration" },
          minFees: { $min: "$fees.amount" },
          maxFees: { $max: "$fees.amount" },
          currency: { $first: "$fees.currency" },
          year: { $first: "$fees.year" },
        },
      },
      {
        $addFields: {
          course: {
            $mergeObjects: [
              "$course",
              {
                durationRange: { $concat: ["$minDuration", " - ", "$maxDuration"] },
                feesRange: {
                  $concat: [
                    { $toString: "$minFees" },
                    " - ",
                    { $toString: "$maxFees" },
                    " ",
                    "$currency",
                    " (",
                    { $toString: "$year" },
                    ")"
                  ]
                }
              }
            ]
          }
        }
      },
      {
        $replaceRoot: { newRoot: "$course" }
      },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: {
          path: "$category",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);

    res.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ message: "Failed to fetch courses" });
  }
};


// const getCourseBySameName = async (req, res) => {
//   try {
//     const { name } = req.query;
    
//     if (!name) {
//       return res.status(400).json({ message: "Course name is required" });
//     }

//     // Find courses by name, case-insensitive search
//     const courses = await Course.find({ name: { $regex: new RegExp(name, 'i') } })
//       .populate("category", "name")    // Populating the category field with its name
//       .populate("college_id", "name rank"); // Populating the college_id field with the name and rank fields

//     if (courses.length === 0) {
//       return res.status(404).json({ message: "No courses found with this name" });
//     }

//     res.json(courses);  // Return all courses that match the name
//   } catch (error) {
//     console.error("Error fetching courses by name:", error);
//     res.status(500).json({ message: "Failed to fetch courses" });
//   }
// };
const getCourseBySameName = async (req, res) => {
  console.log("req query", req.query);
  try {
    const {
      name,
      duration,
      mode,
      programMode,
      colleges,
      feeLevels,
      ratingLevels,
      page = 1,
      limit = 10,
    } = req.query;
    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Course name is required" });
    }
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;
    // Build dynamic query
    const filterQuery = {
      name: { $regex: new RegExp(name, "i") },
      ...(duration && { duration: { $in: Array.isArray(duration) ? duration : [duration] } }),
      ...(mode && { mode: { $in: Array.isArray(mode) ? mode : [mode] } }),
      ...(programMode && {
        programMode: { $in: Array.isArray(programMode) ? programMode : [programMode] },
      }),
      ...(colleges && {
        college_id: { $in: Array.isArray(colleges) ? colleges : [colleges] },
      }),
    };
    // Fee range filter (parsed from JSON strings)
    if (feeLevels) {
      const parsed = Array.isArray(feeLevels) ? feeLevels : [feeLevels];
      const ranges = parsed.map((str) => JSON.parse(str));
      filterQuery["$or"] = filterQuery["$or"] || [];
      ranges.forEach(({ min, max }) => {
        filterQuery["$or"].push({ "fees.amount": { $gte: min, $lte: max } });
      });
    }
    // Rating range filter (parsed from JSON strings)
    if (ratingLevels) {
      const parsed = Array.isArray(ratingLevels) ? ratingLevels : [ratingLevels];
      const ranges = parsed.map((str) => JSON.parse(str));
      filterQuery["$or"] = filterQuery["$or"] || [];
      ranges.forEach(({ min, max }) => {
        filterQuery["$or"].push({ "ratings.score": { $gte: min, $lte: max } });
      });
    }
    const courses = await Course.find(filterQuery)
      .populate("category", "name")
      .populate("programMode", "name")
      .populate("college_id", "name rank image slug")
      .skip(skip)
      .limit(limitNumber);
    const totalCourses = await Course.countDocuments(filterQuery);
    if (courses.length === 0) {
      return res.status(404).json({ message: "No courses found with these filters" });
    }
    res.json({
      courses,
      totalPages: Math.ceil(totalCourses / limitNumber),
      currentPage: pageNumber,
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ message: "Failed to fetch courses", error: error.message });
  }
};


// const getCourseFiltersSpecialization = async (req, res) => {
//   const { specialization } = req.query;
//   if (!specialization) {
//     return res.status(400).json({ message: "Specialization is required" });
//   }

//   try {
//     const courses = await Course.find({
//       specialization: { $regex: specialization, $options: "i" }
//     })
//       .populate("programMode", "_id name")
//       .populate("college_id", "_id name");

//     if (courses.length === 0) {
//       return res.status(404).json({ message: "No courses found for that specialization" });
//     }

//     const uniqueDurations = new Set();
//     const uniqueModes = new Set();
//     const uniqueProgramModes = new Set();
//     const uniqueColleges = new Set();
//     let minFees = Infinity;
//     let maxFees = -Infinity;
//     let minRating = Infinity;
//     let maxRating = -Infinity;

//     courses.forEach(course => {
//       if (course.duration) uniqueDurations.add(course.duration);
//       if (course.mode) uniqueModes.add(course.mode);
//       if (course.programMode?._id) uniqueProgramModes.add(JSON.stringify(course.programMode));
//       if (course.college_id?._id) uniqueColleges.add(JSON.stringify(course.college_id));
      
//       const amount = course.fees?.amount;
//       const rating = course.ratings?.score;

//       if (typeof amount === 'number') {
//         minFees = Math.min(minFees, amount);
//         maxFees = Math.max(maxFees, amount);
//       }

//       if (typeof rating === 'number') {
//         minRating = Math.min(minRating, rating);
//         maxRating = Math.max(maxRating, rating);
//       }
//     });

//     const generateRanges = (min, max, labelPrefix = '', unit = '') => {
//       if (!isFinite(min) || !isFinite(max) || min >= max) return [];
//       const step = Math.ceil((max - min) / 3);
//       const r1Max = min + step;
//       const r2Max = r1Max + step;
//       return [
//         {
//           label: `${unit}${Math.floor(min)} – ${unit}${r1Max}`,
//           min,
//           max: r1Max
//         },
//         {
//           label: `${unit}${r1Max + 1} – ${unit}${r2Max}`,
//           min: r1Max + 1,
//           max: r2Max
//         },
//         {
//           label: `${unit}${r2Max + 1} and above`,
//           min: r2Max + 1,
//           max
//         }
//       ].filter(r => r.min <= r.max);
//     };

//     const feeLevels = generateRanges(minFees, maxFees, '', '₹');
//     const ratingLevels = generateRanges(minRating, maxRating);

//     res.status(200).json({
//       durations: Array.from(uniqueDurations),
//       modes: Array.from(uniqueModes),
//       programModes: Array.from(uniqueProgramModes).map(pm => JSON.parse(pm)),
//       colleges: Array.from(uniqueColleges).map(clg => JSON.parse(clg)),
//       feeLevels,
//       ratingLevels
//     });
//   } catch (error) {
//     console.error("Error fetching course filters:", error);
//     res.status(500).json({ message: "Failed to fetch course filters", error });
//   }
// };

const getCoursesWithCommonSpecializations = async (req, res) => {
  try {
    const courses = await Course.aggregate([
      {
        $group: {
          _id: "$specialization", // Group by specialization
          course: { $first: "$$ROOT" }, // One sample course for info
          minDuration: { $min: "$duration" },
          maxDuration: { $max: "$duration" },
          minFees: { $min: "$fees.amount" },
          maxFees: { $max: "$fees.amount" },
          currency: { $first: "$fees.currency" },
          year: { $first: "$fees.year" },
        },
      },
      {
        $addFields: {
          course: {
            $mergeObjects: [
              "$course",
              {
                durationRange: { $concat: ["$minDuration", " - ", "$maxDuration"] },
                feesRange: {
                  $concat: [
                    { $toString: "$minFees" },
                    " - ",
                    { $toString: "$maxFees" },
                    " ",
                    "$currency",
                    " (",
                    { $toString: "$year" },
                    ")"
                  ]
                }
              }
            ]
          }
        }
      },
      {
        $replaceRoot: { newRoot: "$course" }
      },
      // Populate category
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: {
          path: "$category",
          preserveNullAndEmptyArrays: true,
        },
      },
      // Populate specialization
      {
        $lookup: {
          from: "specializations",
          localField: "specialization",
          foreignField: "_id",
          as: "specialization",
        },
      },
      {
        $unwind: {
          path: "$specialization",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);

    res.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ message: "Failed to fetch courses" });
  }
};

const getCourseBySpecialization = async (req, res) => {
  try {
    const {
      specialization,
      duration,
      mode,
      programMode,
      colleges,
      feeLevels,
      ratingLevels,
      page = 1,
      limit = 10,
    } = req.query;

    if (!specialization || specialization.trim() === "") {
      return res.status(400).json({ message: "Specialization is required" });
    }

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    // Step 1: Find specialization IDs matching the specialization name (regex search)
    const matchingSpecializations = await Specialization.find({
      name: { $regex: new RegExp(specialization, "i") },
    }).select("_id");

    if (matchingSpecializations.length === 0) {
      return res.status(404).json({ message: "No matching specializations found" });
    }

    const specializationIds = matchingSpecializations.map((spec) => spec._id);

    // Step 2: Build filter query using specialization IDs
    const filterQuery = {
      specialization: { $in: specializationIds },
      ...(duration && { duration: { $in: Array.isArray(duration) ? duration : [duration] } }),
      ...(mode && { mode: { $in: Array.isArray(mode) ? mode : [mode] } }),
      ...(programMode && {
        programMode: { $in: Array.isArray(programMode) ? programMode : [programMode] },
      }),
      ...(colleges && {
        college_id: { $in: Array.isArray(colleges) ? colleges : [colleges] },
      }),
    };

    // Fee range filter
    if (feeLevels) {
      const parsed = Array.isArray(feeLevels) ? feeLevels : [feeLevels];
      const ranges = parsed.map((str) => JSON.parse(str));
      filterQuery["$or"] = filterQuery["$or"] || [];
      ranges.forEach(({ min, max }) => {
        filterQuery["$or"].push({ "fees.amount": { $gte: min, $lte: max } });
      });
    }

    // Rating range filter
    if (ratingLevels) {
      const parsed = Array.isArray(ratingLevels) ? ratingLevels : [ratingLevels];
      const ranges = parsed.map((str) => JSON.parse(str));
      filterQuery["$or"] = filterQuery["$or"] || [];
      ranges.forEach(({ min, max }) => {
        filterQuery["$or"].push({ "ratings.score": { $gte: min, $lte: max } });
      });
    }

    const courses = await Course.find(filterQuery)
      .populate("category", "name")
      .populate("programMode", "name")
      .populate("college_id", "name rank image")
      .skip(skip)
      .limit(limitNumber);

    const totalCourses = await Course.countDocuments(filterQuery);

    if (courses.length === 0) {
      return res.status(404).json({ message: "No courses found with these filters" });
    }

    res.json({
      courses,
      totalPages: Math.ceil(totalCourses / limitNumber),
      currentPage: pageNumber,
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ message: "Failed to fetch courses", error: error.message });
  }
};





module.exports = {
  getCourseFilters,getFilterdCourses,getCoursesWithCommonNames,getCourseBySpecialization,getCoursesWithCommonSpecializations,getCourseBySameName
};

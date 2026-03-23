const mongoose = require("mongoose");
const Course = require("../../models/admin/courseModel");
const College = require("../../models/admin/collegemodel");
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
const normalizeRangePayload = (value) => {
  if (!value) return null;
  const range = typeof value === "object" ? value : {};
  const min =
    range.min !== undefined && range.min !== null
      ? Number(range.min)
      : undefined;
  const max =
    range.max !== undefined && range.max !== null
      ? Number(range.max)
      : undefined;

  if (
    (min === undefined || Number.isNaN(min)) &&
    (max === undefined || Number.isNaN(max))
  ) {
    return null;
  }

  const normalized = {};
  if (min !== undefined && !Number.isNaN(min)) normalized.min = min;
  if (max !== undefined && !Number.isNaN(max)) normalized.max = max;
  return Object.keys(normalized).length ? normalized : null;
};

// const buildMatchConditions = (filters = []) => {
//   const andConditions = [];

//   filters.forEach((filter) => {
//     if (!filter || filter.value === undefined || filter.value === null) return;
//     const rawValue = filter.value;

//     switch (filter.field) {
//       case "streams": {
//         const streamIds = (Array.isArray(rawValue) ? rawValue : [rawValue])
//           .filter(Boolean)
//           .map((id) => {
//             try {
//               return new mongoose.Types.ObjectId(id);
//             } catch (err) {
//               return null;
//             }
//           })
//           .filter(Boolean);
//         if (streamIds.length) {
//           andConditions.push({ streams: { $in: streamIds } });
//         }
//         break;
//       }
//       case "avgFee": {
//         const ranges = (Array.isArray(rawValue) ? rawValue : [rawValue])
//           .map(normalizeRangePayload)
//           .filter(Boolean);
//         if (ranges.length) {
//           andConditions.push({
//             $or: ranges.map(({ min, max }) => {
//               const feeCondition = {};
//               if (min !== undefined) feeCondition.$gte = min;
//               if (max !== undefined) feeCondition.$lte = max;
//               return { "fees.amount": feeCondition };
//             }),
//           });
//         }
//         break;
//       }
//       case "courseType": {
//         const modeIds = (Array.isArray(rawValue) ? rawValue : [rawValue])
//           .filter(Boolean)
//           .map((id) => {
//             try {
//               return new mongoose.Types.ObjectId(id);
//             } catch (err) {
//               return null;
//             }
//           })
//           .filter(Boolean);
//         if (modeIds.length) {
//           andConditions.push({ programMode: { $in: modeIds } });
//         }
//         break;
//       }
//       case "duration": {
//         const ranges = (Array.isArray(rawValue) ? rawValue : [rawValue])
//           .map(normalizeRangePayload)
//           .filter(Boolean);
//         if (ranges.length) {
//           andConditions.push({
//             $or: ranges.map(({ min, max }) => {
//               const durationCondition = {};
//               if (min !== undefined) durationCondition.$gte = min;
//               if (max !== undefined) durationCondition.$lte = max;
//               return { durationNumeric: durationCondition };
//             }),
//           });
//         }
//         break;
//       }
//       default:
//         break;
//     }
//   });

//   return andConditions.length ? { $and: andConditions } : {};
// };

/**
 * Build MongoDB match conditions from frontend filters
 */
const buildMatchConditions = (filters = []) => {
  const andConditions = [];

  for (const filter of filters) {
    const { field, value } = filter;

    /* ================= STREAM FILTER ================= */
    if (field === "streams" && Array.isArray(value) && value.length) {
      andConditions.push({
        streams: {
          $in: value.map(
            (id) => new mongoose.Types.ObjectId(id)
          ),
        },
      });
    }

    /* ================= COURSE TYPE ================= */
    if (field === "courseType" && Array.isArray(value) && value.length) {
      andConditions.push({
        programMode: {
          $in: value.map((id) => new mongoose.Types.ObjectId(id)),
        },
      });
    }

    /* ================= FEES RANGE ================= */
    if (field === "avgFee" && Array.isArray(value) && value.length) {
      andConditions.push({
        $or: value.map((range) => ({
          "fees.amount": {
            ...(range.min != null && { $gte: range.min }),
            ...(range.max != null && { $lte: range.max }),
          },
        })),
      });
    }

    /* ================= DURATION RANGE ================= */
    if (field === "duration" && Array.isArray(value) && value.length) {
      andConditions.push({
        $or: value.map((range) => ({
          durationNumeric: {
            ...(range.min != null && { $gte: range.min }),
            ...(range.max != null && { $lte: range.max }),
          },
        })),
      });
    }
  }

  return andConditions.length ? { $and: andConditions } : {};
};


const normalizeStreamFilter = async (filters) => {
  const normalized = Array.isArray(filters) ? [...filters] : [];
  const streamFilter = normalized.find((f) => f?.field === "streams");
  if (!streamFilter || !Array.isArray(streamFilter.value)) return normalized;

  const rawValues = streamFilter.value;
  const ids = rawValues.filter((v) => mongoose.Types.ObjectId.isValid(v));
  const names = rawValues.filter((v) => !mongoose.Types.ObjectId.isValid(v));

  if (names.length) {
    const streamDocs = await Streams.find({ name: { $in: names } }).select("_id");
    streamDocs.forEach((doc) => ids.push(doc._id.toString()));
  }

  streamFilter.value = [...new Set(ids)];
  return normalized;
};

// const getCoursesWithCommonSpecialization = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const skip = (page - 1) * limit;

//     const incomingFilters = Array.isArray(req.body?.filters) ? req.body.filters : [];
//     const filters = await normalizeStreamFilter(incomingFilters);

//     /**
//      * Convert duration string → numeric
//      * Example: "3 Years" → 3
//      */
//     const basePipeline = [
//       {
//         $addFields: {
//           durationNumeric: {
//             $convert: {
//               input: {
//                 $arrayElemAt: [
//                   { $split: [{ $ifNull: ["$duration", "0"] }, " "] },
//                   0,
//                 ],
//               },
//               to: "double",
//               onError: null,
//               onNull: null,
//             },
//           },
//         },
//       },
//     ];

//     const matchConditions = buildMatchConditions(filters);
//     if (Object.keys(matchConditions).length) {
//       basePipeline.push({ $match: matchConditions });
//     }

//     const aggregationPipeline = [
//       ...basePipeline,

//       // Group by specialization
//       {
//         $group: {
//           _id: "$specialization",
//           course: { $first: "$$ROOT" },
//           minDuration: { $min: "$durationNumeric" },
//           maxDuration: { $max: "$durationNumeric" },
//           minFees: { $min: "$fees.amount" },
//           maxFees: { $max: "$fees.amount" },
//           currency: { $first: "$fees.currency" },
//           year: { $first: "$fees.year" },
//           collegesOffering: { $addToSet: "$college_id" },
//         },
//       },

//       // Count colleges
//       {
//         $addFields: {
//           collegeCount: {
//             $size: {
//               $filter: {
//                 input: "$collegesOffering",
//                 as: "college",
//                 cond: { $ne: ["$$college", null] },
//               },
//             },
//           },
//         },
//       },

//       // Merge calculated fields back into course
//       {
//         $addFields: {
//           course: {
//             $mergeObjects: [
//               "$course",
//               {
//                 collegeCount: "$collegeCount",
//                 durationRange: {
//                   $cond: [
//                     {
//                       $and: [
//                         { $ne: ["$minDuration", null] },
//                         { $ne: ["$maxDuration", null] },
//                       ],
//                     },
//                     {
//                       $cond: [
//                         { $eq: ["$minDuration", "$maxDuration"] },
//                         { $concat: [{ $toString: "$minDuration" }, " Years"] },
//                         {
//                           $concat: [
//                             { $toString: "$minDuration" },
//                             " - ",
//                             { $toString: "$maxDuration" },
//                             " Years",
//                           ],
//                         },
//                       ],
//                     },
//                     "$course.duration",
//                   ],
//                 },
//                 feesRange: {
//                   $cond: [
//                     {
//                       $and: [
//                         { $ne: ["$minFees", null] },
//                         { $ne: ["$maxFees", null] },
//                       ],
//                     },
//                     {
//                       $concat: [
//                         "₹",
//                         { $toString: "$minFees" },
//                         " - ₹",
//                         { $toString: "$maxFees" },
//                         " ",
//                         "$currency",
//                         " (",
//                         { $toString: "$year" },
//                         ")",
//                       ],
//                     },
//                     null,
//                   ],
//                 },
//               },
//             ],
//           },
//         },
//       },

//       { $replaceRoot: { newRoot: "$course" } },

//       // Lookups
//       {
//         $lookup: {
//           from: "categories",
//           localField: "category",
//           foreignField: "_id",
//           as: "category",
//         },
//       },
//       { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },

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
//           from: "streams",
//           localField: "streams",
//           foreignField: "_id",
//           as: "streams",
//         },
//       },

//       {
//         $lookup: {
//           from: "programmodes",
//           localField: "programMode",
//           foreignField: "_id",
//           as: "programMode",
//         },
//       },
//       { $unwind: { path: "$programMode", preserveNullAndEmptyArrays: true } },

//       { $skip: skip },
//       { $limit: limit },

//       { $project: { durationNumeric: 0, collegesOffering: 0 } },
//     ];

//     const courses = await Course.aggregate(aggregationPipeline);

//     // Count total grouped specializations
//     const totalCountAgg = await Course.aggregate([
//       ...basePipeline,
//       { $group: { _id: "$specialization" } },
//       { $count: "total" },
//     ]);

//     const totalCount = totalCountAgg[0]?.total || 0;

//     res.json({
//       page,
//       limit,
//       totalCount,
//       totalPages: Math.ceil(totalCount / limit),
//       courses,
//     });
//   } catch (error) {
//     console.error("Error fetching courses:", error);
//     res.status(500).json({ message: "Failed to fetch courses" });
//   }
// };
const getCoursesWithCommonSpecialization = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const incomingFilters = Array.isArray(req.body?.filters) ? req.body.filters : [];
    const filters = await normalizeStreamFilter(incomingFilters);

    let stateFilter = null;
    let cityFilter = null;

    filters.forEach((f) => {
      if (f.field === "state") stateFilter = f.value;
      if (f.field === "city") cityFilter = f.value;
    });

    const matchConditions = buildMatchConditions(filters);

    /**
     * STEP 1: Get college IDs based on state/city
     */
    let collegeIds = [];

    if (stateFilter || cityFilter) {
      const collegeQuery = {};

      if (stateFilter) collegeQuery.state = { $in: stateFilter };
      if (cityFilter) collegeQuery.city = { $in: cityFilter };

      const colleges = await College.find(collegeQuery)
        .select("_id")
        .lean();

      collegeIds = colleges.map((c) => c._id);

      if (collegeIds.length) {
        matchConditions.college_id = { $in: collegeIds };
      } else {
        return res.json({
          page,
          limit,
          totalCount: 0,
          totalPages: 0,
          courses: [],
        });
      }
    }

    /**
     * STEP 2: Aggregation
     */
    const pipeline = [
      {
        $addFields: {
          durationNumeric: {
            $convert: {
              input: {
                $arrayElemAt: [
                  { $split: [{ $ifNull: ["$duration", "0"] }, " "] },
                  0,
                ],
              },
              to: "double",
              onError: null,
              onNull: null,
            },
          },
        },
      },

      ...(Object.keys(matchConditions).length
        ? [{ $match: matchConditions }]
        : []),

      {
        $group: {
          _id: "$specialization",
          course: { $first: "$$ROOT" },
          minDuration: { $min: "$durationNumeric" },
          maxDuration: { $max: "$durationNumeric" },
          minFees: { $min: "$fees.amount" },
          maxFees: { $max: "$fees.amount" },
          currency: { $first: "$fees.currency" },
          year: { $first: "$fees.year" },
          collegesOffering: { $addToSet: "$college_id" },
        },
      },

      {
        $addFields: {
          collegeCount: { $size: "$collegesOffering" },
        },
      },

      {
        $addFields: {
          course: {
            $mergeObjects: [
              "$course",
              {
                collegeCount: "$collegeCount",
                durationRange: {
                  $cond: [
                    { $eq: ["$minDuration", "$maxDuration"] },
                    { $concat: [{ $toString: "$minDuration" }, " Years"] },
                    {
                      $concat: [
                        { $toString: "$minDuration" },
                        " - ",
                        { $toString: "$maxDuration" },
                        " Years",
                      ],
                    },
                  ],
                },
              },
            ],
          },
        },
      },

      { $replaceRoot: { newRoot: "$course" } },

      /**
       * Lookup college to return state/city
       */
      {
        $lookup: {
          from: "colleges",
          localField: "college_id",
          foreignField: "_id",
          as: "college",
        },
      },

      { $unwind: { path: "$college", preserveNullAndEmptyArrays: true } },

      /**
       * Lookup other relations
       */
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },

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
          from: "streams",
          localField: "streams",
          foreignField: "_id",
          as: "streams",
        },
      },

      {
        $lookup: {
          from: "programmodes",
          localField: "programMode",
          foreignField: "_id",
          as: "programMode",
        },
      },
      { $unwind: { path: "$programMode", preserveNullAndEmptyArrays: true } },

      /**
       * Add state & city to response
       */
      {
        $addFields: {
          state: "$college.state",
          city: "$college.city",
        },
      },

      {
        $project: {
          college: 0,
          durationNumeric: 0,
          collegesOffering: 0,
        },
      },

      {
        $facet: {
          courses: [{ $skip: skip }, { $limit: limit }],
          totalCount: [{ $count: "count" }],
        },
      },
    ];

    const result = await Course.aggregate(pipeline);

    const courses = result[0]?.courses || [];
    const totalCount = result[0]?.totalCount?.[0]?.count || 0;

    res.json({
      page,
      limit,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      courses,
    });
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


const getLocationFilters = async (req, res) => {
  try {
    const [states, cities] = await Promise.all([
      Course.distinct("state", { state: { $ne: null } }),
      Course.distinct("city", { city: { $ne: null } }),
    ]);

    res.json({
      states: states.sort(),
      cities: cities.sort(),
    });
  } catch (error) {
    console.error("Location filter error:", error);
    res.status(500).json({ message: "Failed to fetch locations" });
  }
};


module.exports = {
  getCourseFilters,getFilterdCourses,getCoursesWithCommonNames,getCourseBySpecialization,getCoursesWithCommonSpecializations,getCoursesWithCommonSpecialization ,getCourseBySameName, getLocationFilters
};

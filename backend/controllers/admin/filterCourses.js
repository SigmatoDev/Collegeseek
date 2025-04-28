const Course = require("../../models/admin/courseModel");

const getCourseFilters = async (req, res) => {
  try {
    const durations = await Course.distinct("duration");
    const modes = await Course.distinct("mode");

    res.status(200).json({
      durations,
      modes,
    });
  } catch (error) {
    console.error("Error fetching filters:", error);
    res.status(500).json({ message: "Failed to fetch filters", error });
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
  try {
    const { name } = req.query;
    const page = parseInt(req.query.page) || 1; // Default to page 1 if no page is provided
    const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
    const skip = (page - 1) * limit; // Skip the appropriate number of courses based on page

    if (!name) {
      return res.status(400).json({ message: "Course name is required" });
    }

    // Find courses by name, with pagination
    const courses = await Course.find({ name: { $regex: new RegExp(name, 'i') } })
    .populate("category", "name")
    .populate("college_id", "name rank image") // <--- added image here
    .skip(skip)
    .limit(limit);  // Limit the number of courses returned

    // Count the total number of courses that match the search criteria
    const totalCourses = await Course.countDocuments({ name: { $regex: new RegExp(name, 'i') } });

    if (courses.length === 0) {
      return res.status(404).json({ message: "No courses found with this name" });
    }

    res.json({
      courses,
      totalPages: Math.ceil(totalCourses / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching courses by name:", error);
    res.status(500).json({ message: "Failed to fetch courses" });
  }
};


module.exports = {
  getCourseFilters,getFilterdCourses,getCoursesWithCommonNames,getCourseBySameName
};

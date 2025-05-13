const Course = require("../../models/admin/courseModel");

const getCourseFilters = async (req, res) => {
  const { name } = req.query;
  console.log("Received courseName:", name); // Log the name from the frontend

  if (!name) {
    return res.status(400).json({ message: "Course name is required" });
  }

  try {
    // Fetch all courses based on the name (case-insensitive search) and populate programMode
    const courses = await Course.find({ name: { $regex: name, $options: "i" } })
      .populate("programMode", "name"); // Only populate the 'name' field of the related model

    if (courses.length === 0) {
      return res.status(404).json({ message: "No courses found with that name" });
    }

    // Use Sets to get unique values
    const uniqueDurations = new Set();
    const uniqueModes = new Set();
    const uniqueProgramModes = new Set();

    // Collect unique values from all courses
    courses.forEach(course => {
      if (course.duration) uniqueDurations.add(course.duration);
      if (course.mode) uniqueModes.add(course.mode);

      // If programMode is populated
      if (course.programMode && course.programMode.name) {
        uniqueProgramModes.add(course.programMode.name);
      }
    });

    // Build the filters object
    const filters = {
      durations: Array.from(uniqueDurations),
      modes: Array.from(uniqueModes),
      programModes: Array.from(uniqueProgramModes),
    };

    // Send the filters back to the frontend
    res.status(200).json(filters);
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
    const { name, duration, mode, page = 1, limit = 10 } = req.query;

    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Course name is required" });
    }

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    // Build dynamic filter query
    const filterQuery = {
      name: { $regex: new RegExp(name, 'i') },
      ...(duration && duration !== 'undefined' && { duration }),
      ...(mode && mode !== 'undefined' && mode !== 'null' && { mode }),
    };

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
    console.error("Error fetching courses by name, duration, or mode:", error);
    res.status(500).json({ message: "Failed to fetch courses" });
  }
};


module.exports = { getCourseBySameName };


module.exports = {
  getCourseFilters,getFilterdCourses,getCoursesWithCommonNames,getCourseBySameName
};

const mongoose = require("mongoose");
const slugify = require("slugify"); // <-- Add this
const Course = require("../../models/admin/courseModel");
const College = require("../../models/admin/collegemodel");
const CoursesList = require("../../models/admin/coursesList"); // Adjust path if necessary
const ProgramMode = require("../../models/admin/programMode"); // Adjust path if necessary
const Specialization = require("../../models/admin/specialization"); // <- Capitalize for consistency



// Get all courses
const getCourse = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("category", "name") // Populate the category name field
      .populate("programMode", "name"); // Populate the programMode name field

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

    const courses = await Course.find()
      .populate("specialization", "name") // ✅ lowercase 'specialization'
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


// Get course by ID
const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid course ID format" });
    }

    const course = await Course.findById(id).populate("college_id", "name location");
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json(course);
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({ message: "Failed to fetch course", error: error.message });
  }
};

// Create a new course
// const createCourse = async (req, res) => {
//   console.log("create course", req.body);
//   try {
//     let { college_id, category, name, ...courseData } = req.body;

//     // Validate or find college ObjectId
//     if (!mongoose.Types.ObjectId.isValid(college_id)) {
//       const college = await College.findOne({ name: college_id });
//       if (!college) {
//         return res.status(400).json({ message: "College not found" });
//       }
//       college_id = college._id;
//     }

//     // Find category ObjectId from name
//     const courseCategory = await CoursesList.findOne({ name: category });
//     if (!courseCategory) {
//       return res.status(400).json({ message: "Category not found" });
//     }

//     let slug = slugify(name, { lower: true, strict: true });

//     // Check for duplicate slug and modify it if necessary
//     let existingCourse = await Course.findOne({ slug });
//     let counter = 1;
//     while (existingCourse) {
//       slug = `${slugify(name, { lower: true, strict: true })}-${counter}`;
//       existingCourse = await Course.findOne({ slug });
//       counter++;
//     }

//     const imageUrl = req.file ? `/uploads/courses/${req.file.filename}` : null;

//     const newCourse = new Course({
//       ...courseData,
//       name,
//       slug,
//       college_id,
//       category: courseCategory._id,
//       image: imageUrl, // <-- save image path
//     });

//     await newCourse.save();
//     res.status(201).json(newCourse);
//   } catch (error) {
//     console.error("Error creating course:", error);
//     res.status(500).json({ message: "Failed to create course" });
//   }
// };
const createCourse = async (req, res) => {
      // console.log("Request Body:", req.body);  // <-- Add this line

  try {
    let { college_id, category, name, ...courseData } = req.body;

    if (!mongoose.Types.ObjectId.isValid(college_id)) {
      const college = await College.findOne({ name: college_id });
      if (!college) {
        return res.status(400).json({ message: "College not found" });
      }
      college_id = college._id;
    }

    const courseCategory = await CoursesList.findOne({ name: category });
    if (!courseCategory) {
      return res.status(400).json({ message: "Category not found" });
    }

    let slug = slugify(name, { lower: true, strict: true });

    let existingCourse = await Course.findOne({ slug });
    let counter = 1;
    while (existingCourse) {
      slug = `${slugify(name, { lower: true, strict: true })}-${counter}`;
      existingCourse = await Course.findOne({ slug });
      counter++;
    }

    const imageUrl = req.file ? `/uploads/courses/${req.file.filename}` : null;

    const newCourse = new Course({
      ...courseData, // includes programMode if in body
      name,
      slug,
      college_id,
      category: courseCategory._id,
      image: imageUrl,
    });

    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ message: "Failed to create course" });
  }
};



// Update a course
// const updateCourse = async (req, res) => {
//   try {
//     let { name, college_id, category, ...rest } = req.body;

//     // Regenerate slug if name changes
//     if (name) {
//       req.body.slug = slugify(name, { lower: true, strict: true });
//     }

//     // Handle nested college_id object (e.g., from frontend dropdown or populated course)
//     if (college_id && typeof college_id === 'object') {
//       college_id = college_id._id;
//     }

//     // If college_id is not valid ObjectId, try to fetch it by name
//     if (college_id && !mongoose.Types.ObjectId.isValid(college_id)) {
//       const college = await College.findOne({ name: college_id });
//       if (!college) return res.status(400).json({ message: "College not found" });
//       college_id = college._id;
//     }

//     // If category is a name, convert it to ObjectId
//     if (category && typeof category !== 'object' && !mongoose.Types.ObjectId.isValid(category)) {
//       const courseCategory = await CoursesList.findOne({ name: category });
//       if (!courseCategory) return res.status(400).json({ message: "Category not found" });
//       category = courseCategory._id;
//     }

//     const updatedCourse = await Course.findByIdAndUpdate(
//       req.params.id,
//       {
//         ...rest,
//         ...(name && { name }),
//         ...(college_id && { college_id }),
//         ...(category && { category }),
//         ...(req.body.slug && { slug: req.body.slug }),
//       },
//       { new: true }
//     );

//     if (!updatedCourse) return res.status(404).json({ message: "Course not found" });

//     res.json(updatedCourse);
//   } catch (error) {
//     console.error("Error updating course:", error);
//     res.status(500).json({ message: "Failed to update course" });
//   }
// };




const updateCourse = async (req, res) => {
  try {
    let { name, college_id, category, programMode, specialization, ...rest } = req.body;
        console.log("Incoming request body:", req.body);

    // Normalize college_id
    if (college_id && typeof college_id === 'object') {
      college_id = college_id._id;
    }
    if (college_id && !mongoose.Types.ObjectId.isValid(college_id)) {
      const college = await College.findOne({ name: college_id });
      if (!college) return res.status(400).json({ message: "College not found" });
      college_id = college._id;
    }

    // Normalize category
    if (category && typeof category !== 'object' && !mongoose.Types.ObjectId.isValid(category)) {
      const courseCategory = await CoursesList.findOne({ name: category });
      if (!courseCategory) return res.status(400).json({ message: "Category not found" });
      category = courseCategory._id;
    }

    // Normalize programMode
    if (programMode && typeof programMode !== 'object' && !mongoose.Types.ObjectId.isValid(programMode)) {
      const programModeDoc = await ProgramMode.findOne({ name: programMode });
      if (!programModeDoc) return res.status(400).json({ message: "Program mode not found" });
      programMode = programModeDoc._id;
    }

    // Normalize specialization
    if (specialization && typeof specialization !== 'object' && !mongoose.Types.ObjectId.isValid(specialization)) {
      const specializationDoc = await Specialization.findOne({ name: specialization });
      if (!specializationDoc) return res.status(400).json({ message: "Specialization not found" });
      specialization = specializationDoc._id;
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      {
        ...rest,
        ...(name && { name }),
        ...(college_id && { college_id }),
        ...(category && { category }),
        ...(programMode && { programMode }),
        ...(specialization && { specialization }),
        // Slug is intentionally left out
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json(updatedCourse);
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ message: "Failed to update course", error: error.message });
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
    return res.status(500).json({ message: "Failed to fetch course by slug", error: error.message });
  }
};

// Get courses by specialization name
const getCoursesBySpecialization = async (req, res) => {
  try {
    const { specialization } = req.params;

    console.log("Incoming specialization:", specialization);

    if (!specialization || typeof specialization !== "string") {
      return res.status(400).json({ message: "Invalid specialization provided" });
    }

    // Optional: if specialization is stored in another model and referenced by ID
    const matchedSpecialization = await Specialization.findOne({ name: specialization });

    if (!matchedSpecialization) {
      return res.status(404).json({ message: "Specialization not found" });
    }

    const courses = await Course.find({ specialization: matchedSpecialization._id })
      .populate("college_id", "name location")
      .populate("category", "name");

    return res.status(200).json(courses);
  } catch (error) {
    console.error("Error fetching courses by specialization:", error.message);
    return res.status(500).json({ message: "Failed to fetch courses", error: error.message });
  }
};



// Delete a course
const deleteCourse = async (req, res) => {
  try {
    const deletedCourse = await Course.findByIdAndDelete(req.params.id);
    if (!deletedCourse) return res.status(404).json({ message: "Course not found" });

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

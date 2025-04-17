const mongoose = require("mongoose");
const slugify = require("slugify"); // <-- Add this
const Course = require("../../models/admin/courseModel");
const College = require("../../models/admin/collegemodel");
const CoursesList = require("../../models/admin/coursesList"); // Adjust path if necessary


// Get all courses
const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate("category", "name"); // Only populate the name field
    res.json(courses);
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
const createCourse = async (req, res) => {
  console.log("create course", req.body);
  try {
    let { college_id, category, name, ...courseData } = req.body;

    // Validate or find college ObjectId
    if (!mongoose.Types.ObjectId.isValid(college_id)) {
      const college = await College.findOne({ name: college_id });
      if (!college) {
        return res.status(400).json({ message: "College not found" });
      }
      college_id = college._id;
    }

    // Find category ObjectId from name
    const courseCategory = await CoursesList.findOne({ name: category });
    if (!courseCategory) {
      return res.status(400).json({ message: "Category not found" });
    }

    const slug = slugify(name, { lower: true, strict: true });

    const imageUrl = req.file ? `/uploads/courses/${req.file.filename}` : null;

    const newCourse = new Course({
      ...courseData,
      name,
      slug,
      college_id,
      category: courseCategory._id,
      image: imageUrl, // <-- save image path
    });

    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ message: "Failed to create course" });
  }
};


// Update a course
const updateCourse = async (req, res) => {
  try {
    let { name, college_id, category, ...rest } = req.body;

    // Regenerate slug if name changes
    if (name) {
      req.body.slug = slugify(name, { lower: true, strict: true });
    }

    // Handle nested college_id object (e.g., from frontend dropdown or populated course)
    if (college_id && typeof college_id === 'object') {
      college_id = college_id._id;
    }

    // If college_id is not valid ObjectId, try to fetch it by name
    if (college_id && !mongoose.Types.ObjectId.isValid(college_id)) {
      const college = await College.findOne({ name: college_id });
      if (!college) return res.status(400).json({ message: "College not found" });
      college_id = college._id;
    }

    // If category is a name, convert it to ObjectId
    if (category && typeof category !== 'object' && !mongoose.Types.ObjectId.isValid(category)) {
      const courseCategory = await CoursesList.findOne({ name: category });
      if (!courseCategory) return res.status(400).json({ message: "Category not found" });
      category = courseCategory._id;
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      {
        ...rest,
        ...(name && { name }),
        ...(college_id && { college_id }),
        ...(category && { category }),
        ...(req.body.slug && { slug: req.body.slug }),
      },
      { new: true }
    );

    if (!updatedCourse) return res.status(404).json({ message: "Course not found" });

    res.json(updatedCourse);
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ message: "Failed to update course" });
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
  updateCourse,
  deleteCourse,
  getCourseBySlug,
};

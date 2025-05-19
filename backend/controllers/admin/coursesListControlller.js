const mongoose = require("mongoose");
const Course = require("../../models/admin/coursesList"); // Ensure this is the correct model
const path = require("path");
const fs = require("fs");

// ✅ Get All Courses
const getCourseList = async (req, res) => {
  try {
    const clist = await Course.find(); // Use the Course model
    res.status(200).json({ success: true, data: clist });
  } catch (error) {
    console.error("Error fetching courselist:", error);
    res.status(500).json({ success: false, error: "Failed to fetch courselist" });
  }
};

const createCourseList = async (req, res) => {
  try {
    const { name, code } = req.body;
   const image = req.file ? `uploads/${req.file.filename}` : null;

    if (!name || !code) {
      return res.status(400).json({ success: false, error: "Course name and code are required." });
    }

    // Check for duplicate by name or code
    const existingCourse = await Course.findOne({ 
      $or: [
        { code }, 
        { name }
      ]
    });

    if (existingCourse) {
      return res.status(400).json({ success: false, error: "Course with this name or code already exists." });
    }

    const newCourse = new Course({ name, code, image });
    const savedCourse = await newCourse.save();

    res.status(201).json({ success: true, data: savedCourse });
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to create course" });
  }
};



// ✅ Get Course by ID
const getCourseListById = async (req, res) => {
  try {
    const { id } = req.params; // Get the course ID from the URL

    // Find the course by ID in the database
    const course = await Course.findById(id);

    // If no course found with the provided ID
    if (!course) {
      return res.status(404).json({ success: false, error: "Course not found" });
    }

    // Return the found course
    res.status(200).json({ success: true, data: course });
  } catch (error) {
    console.error("Error fetching course by ID:", error);
    res.status(500).json({ success: false, error: "Failed to fetch course by ID" });
  }
};

// ✅ Update a Course
const updateCourseList = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code } = req.body;
    const image = req.file ? `uploads/${req.file.filename}` : null;

    if (!name || !code) {
      return res.status(400).json({ success: false, error: "Course name and code are required." });
    }

    // Check for duplicates excluding the current course
    const existingCourse = await Course.findOne({ 
      $or: [
        { code }, 
        { name }
      ],
      _id: { $ne: id }
    });

    if (existingCourse) {
      return res.status(400).json({ success: false, error: "Course with this name or code already exists." });
    }

    const updateData = { name, code };
    if (image) {
      updateData.image = image;
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ success: false, error: "Course not found" });
    }

    res.status(200).json({ success: true, data: updatedCourse });
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ success: false, error: "Failed to update course" });
  }
};



// ✅ Delete a Course
const deleteCourseList = async (req, res) => {
  try {
    const { id } = req.params; // Get the course ID from the URL

    const deletedCourse = await Course.findByIdAndDelete(id);

    if (!deletedCourse) {
      return res.status(404).json({ success: false, error: "Course not found" });
    }

    res.status(200).json({ success: true, message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ success: false, error: "Failed to delete course" });
  }
};

// Export functions (CommonJS)
module.exports = {
  getCourseList,
  createCourseList,
  getCourseListById,
  updateCourseList,
  deleteCourseList,
};

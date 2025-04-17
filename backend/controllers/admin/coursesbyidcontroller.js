const mongoose = require("mongoose");
const Course = require("../../models/admin/courseModel");
const College = require("../../models/admin/collegemodel"); // Import College model

const getCoursesByidCollege = async (req, res) => {
  try {
    let { college_id } = req.query;
    
    console.log("Received College ID or Name:", college_id); // Log received input

    if (!college_id) {
      return res.status(400).json({ message: "College ID or name is required" });
    }

    // Check if college_id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(college_id)) {
      console.warn("College ID is not an ObjectId, assuming it's a name:", college_id);

      // Try to find college by name
      const college = await College.findOne({ name: college_id });
      if (!college) {
        console.error("College not found:", college_id);
        return res.status(404).json({ message: "College not found" });
      }
      college_id = college._id; // Convert name to ObjectId
      console.log("Converted College Name to ID:", college_id);
    }

    // Fetch courses using the valid ObjectId
    const courses = await Course.find({ college_id });

    if (!courses.length) {
      console.warn("No courses found for College ID:", college_id);
      return res.status(404).json({ message: "No courses found for this college" });
    }

    console.log("Found Courses:", courses); // Log found courses
    res.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ message: "Failed to fetch courses" });
  }
};

const getCoursesByCollegeSlug = async (req, res) => {
  try {
    const { slug } = req.params;

    if (!slug) {
      return res.status(400).json({ message: "College slug is required" });
    }

    // Find the college by slug
    const college = await College.findOne({ slug });
    if (!college) {
      return res.status(404).json({ message: "College not found" });
    }

    // Find courses linked to the college
    const courses = await Course.find({ college_id: college._id }).populate("college_id");

    if (!courses.length) {
      return res.status(404).json({ message: "No courses found for this college" });
    }

    res.json(courses);
  } catch (error) {
    console.error("Error fetching courses by slug:", error);
    res.status(500).json({ message: "Failed to fetch courses" });
  }
};


module.exports = { getCoursesByidCollege, getCoursesByCollegeSlug };

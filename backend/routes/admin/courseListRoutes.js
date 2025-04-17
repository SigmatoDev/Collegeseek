const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const {
  getCourseList,
  createCourseList,
  getCourseListById,
  updateCourseList,
  deleteCourseList,
} = require("../../controllers/admin/coursesListControlller");

const router = express.Router();

// ✅ Get All Courses
router.get("/course-list", getCourseList);


// ✅ Create a new Course
router.post("/course-list", createCourseList);
router.get("/course-list/:id", getCourseListById  );


// ✅ Update an existing Course by ID
router.put("/course-list/:id", updateCourseList);

// ✅ Delete a Course by ID
router.delete("/course-list/:id", deleteCourseList);

module.exports = router;  

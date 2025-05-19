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


// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPG, PNG, and WEBP are allowed."), false);
    }
  },
});

const router = express.Router();

// ✅ Get All Courses
router.get("/course-list", getCourseList);


// ✅ Create a new Course
router.post("/course-list", upload.single("image"),  createCourseList);
router.get("/course-list/:id", getCourseListById  );


// ✅ Update an existing Course by ID
router.put("/course-list/:id", upload.single("image"),  updateCourseList);

// ✅ Delete a Course by ID
router.delete("/course-list/:id", deleteCourseList);

module.exports = router;  

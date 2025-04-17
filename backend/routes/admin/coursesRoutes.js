const express = require('express');
const router = express.Router();

const upload = require('../../middlewares/admin/upload'); // <--- Add this line

const {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getCourseBySlug,
} = require('../../controllers/admin/coursesController');

const {
  getCoursesByidCollege,
  getCoursesByCollegeSlug
} = require('../../controllers/admin/coursesbyidcontroller');

const {
  getCourseFilters,
  getFilterdCourses,
  getCoursesWithCommonNames,
  getCourseBySameName
} = require('../../controllers/admin/filterCourses');

// Define routes
router.post("/courses", upload.single('image'), createCourse); // <--- Update here
router.get("/courses", getCourses);
router.get("/courses/:id", getCourseById);
router.put("/courses/:id", updateCourse);
router.delete("/courses/:id", deleteCourse);
router.get("/courses", getCoursesByidCollege);
router.get("/by-college/:slug", getCoursesByCollegeSlug);
router.get("/courses/slug/:slug", getCourseBySlug);
router.get("/get/courses/filters", getCourseFilters);
router.post("/apply/filter/courses", getFilterdCourses);
router.post("/courses/filter/by/common/name", getCoursesWithCommonNames);
router.get("/courses/all/get/with/same/name", getCourseBySameName);

module.exports = router;

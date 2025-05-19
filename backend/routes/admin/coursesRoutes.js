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
  getCourse,
  getCoursesBySpecialization,
} = require('../../controllers/admin/coursesController');

const {
  getCoursesByidCollege,
  getCoursesByCollegeSlug
} = require('../../controllers/admin/coursesbyidcontroller');

const {
  getCourseFilters,
  getFilterdCourses,
  getCoursesWithCommonNames,

  getCoursesWithCommonSpecializations,
  getCourseBySpecialization,
  getCourseBySameName
} = require('../../controllers/admin/filterCourses');

// Define routes
router.post("/courses", upload.single('image'), createCourse); // <--- Update here
router.get("/courses", getCourses);
router.get("/c/courses", getCourse);
router.get("/courses/:id", getCourseById);
router.put("/courses/:id", updateCourse);
router.delete("/courses/:id", deleteCourse);
router.get("/courses", getCoursesByidCollege);
router.get("/by-college/:slug", getCoursesByCollegeSlug);
router.get("/courses/slug/:slug", getCourseBySlug);
router.get("/courses/specialization/:specialization", getCoursesBySpecialization);
router.get("/get/courses/filters", getCourseFilters);
router.post("/apply/filter/courses", getFilterdCourses);
router.post("/courses/filter/by/common/name", getCoursesWithCommonNames);
router.post("/courses/filter/by/specialization",getCoursesWithCommonSpecializations)
router.get("/courses/all/get/with/same/name", getCourseBySameName);
router.get("/courses/all/get/by/specialization", getCourseBySpecialization);

module.exports = router;

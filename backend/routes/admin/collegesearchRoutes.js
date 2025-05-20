const express = require("express");
const { getAllColleges } = require("../../controllers/admin/collegesearchController");
const { getCourses1 } = require("../../controllers/admin/coursesSearchController");

const router = express.Router();

// GET /search/colleges?search=...&page=...&limit=...
router.get("/search/colleges", getAllColleges);

router.get('/courses/search', getCourses1);
module.exports = router;


const express = require("express");
const { getFiltersFromColleges } = require("../../controllers/filter/getFilterFromCollege");
const { getCollegesFromFilter } = require("../../controllers/filter/getCollegeFromFilter");


const router = express.Router();
// router.get("/college/filter/new", getCollegeFilters);
// router.get("/course/filter/new", getCourseFiltersNew);
// router.get("/get/all/filter", getCombinedFilters);
router.post("/get/filters/by-colleges", getFiltersFromColleges);
router.post("/get/colleges/filter", getCollegesFromFilter);
module.exports = router;







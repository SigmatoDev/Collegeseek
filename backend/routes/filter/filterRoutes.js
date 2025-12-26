const express = require("express");
const { getFiltersFromColleges } = require("../../controllers/filter/getFilterFromCollege");
const { getCollegesFromFilter } = require("../../controllers/filter/getCollegeFromFilter");
const { getCollegesAndFiltersV2 } = require("../../controllers/filter/getCollegeFilterV2");
const { getCourseCountsByCity } = require("../../controllers/filter/getCourseCountsByCity");


const router = express.Router();
// router.get("/college/filter/new", getCollegeFilters);
// router.get("/course/filter/new", getCourseFiltersNew);
// router.get("/get/all/filter", getCombinedFilters);
router.post("/get/filters/by-colleges", getFiltersFromColleges);
router.post("/get/colleges/filter", getCollegesFromFilter);
router.post("/get/colleges/filter-v2", getCollegesAndFiltersV2);
router.post("/get/courses/count/by-city", getCourseCountsByCity);
module.exports = router;





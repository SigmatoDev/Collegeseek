// routes/filterRoutes.js
const express = require("express");
const router = express.Router();
const { getFilteredColleges } = require("../../controllers/admin/collegeFilter");

router.post("/filter/colleges", getFilteredColleges);


module.exports = router;

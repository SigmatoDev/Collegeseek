const express = require('express');
const { exportColleges } = require('../../controllers/admin/excelCollegeDownLoad');
const router = express.Router();

// Adjust the path based on your file structure

// Route to export colleges to Excel
router.get('/export-colleges', exportColleges);

module.exports = router;

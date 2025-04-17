// routes/dashboardRoutes.js

const express = require('express');
const { getDashboardData } = require('../../controllers/admin/dashboardController');

const router = express.Router();

// Route to get dashboard data (courses enrolled and colleges shortlisted)
router.get('/dashboard', getDashboardData);

module.exports = router;

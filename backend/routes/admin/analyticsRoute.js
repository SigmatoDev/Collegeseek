const express = require("express");
const { getAnalytics } = require("../../controllers/admin/analyticsController");
const router = express.Router();


router.get("/analytics", getAnalytics);

module.exports = router;
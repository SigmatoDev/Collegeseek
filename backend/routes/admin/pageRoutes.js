// routes/admin/pageRoutes.js

const express = require("express");
const { createPage, getPages } = require("../../controllers/admin/pageController");
const router = express.Router();

// Route to create a page
router.post("/pages", createPage);

// Route to get all pages
router.get("/pages", getPages);

module.exports = router;

// routes/admin/moduleRoutes.js

const express = require("express");
const router = express.Router();
const { createModule, getModules } = require("../../controllers/admin/moduleController");

// Route to create a module
router.post("/modules", createModule);

// Route to get all modules
router.get("/modules", getModules);

module.exports = router;

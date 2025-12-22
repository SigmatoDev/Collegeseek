const express = require("express");
const {
  getCategories,
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategoryOrder, // newly added
} = require("../../controllers/admin/categoryFilterController");

const router = express.Router();

// =========================
// Routes for older Category model
// =========================
router.get("/getCategoriesFilter", getCategories);       // fetch all categories
router.post("/addCategoriesFilter", createCategory);     // create new category
router.delete("/deleteCategoriesFilter/:id", deleteCategory);
router.post("/updateCategoriesOrder", updateCategoryOrder);


// =========================
// Route to fetch Streams, Exams, Courses dynamically
// =========================
router.get("/allCategoriesFilter", getAllCategories); // fetch all items grouped by type

module.exports = router;

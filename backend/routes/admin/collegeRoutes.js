const express = require("express");

const {
  getColleges,
  getCollegeById,
  createCollege,
  updateCollege,
  deleteCollege,
  getCollegeBySlug,
  getCollege,
  getallColleges,
  getFeaturedColleges,
  getStateColleges,
  getCollegeDependencySummary,
  uploadMiddleware, // ✅ import from controller
} = require("../../controllers/admin/collegeController");

const router = express.Router();

// ✅ Routes
router.get("/colleges", getColleges);
router.get("/f/college", getCollege);
router.get("/get/colleges/", getallColleges);
router.get("/State/colleges/", getStateColleges);

router.get("/colleges/:id", getCollegeById);
router.post("/colleges", uploadMiddleware, createCollege);        // ✅ S3 upload
router.put("/colleges/:id", uploadMiddleware, updateCollege);     // ✅ S3 upload
router.get("/colleges/:id/dependencies", getCollegeDependencySummary);

router.delete("/colleges/:id", deleteCollege);
router.get("/college/:slug", getCollegeBySlug);
router.get("/featured", getFeaturedColleges);

module.exports = router;
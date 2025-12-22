const express = require("express");
const {
  getUploadFiles,
  createUploadFile,
  deleteUploadFile,
  getUploadFileById,
  updateUploadFile,
} = require("../../controllers/admin/documentController");
const {getUploadFileByCollegeId,} = require("../../controllers/admin/documentIdController")
const router = express.Router();

router.get("/brochure", getUploadFiles);
router.get("/id/brochure/:id", getUploadFileById);
router.post("/brochure-post/", createUploadFile);
router.put("/brochure-update/:id", updateUploadFile);   // ✅ FIXED
router.delete("/brochure/:id", deleteUploadFile);
router.get("/brochure/college/:collegeId", getUploadFileByCollegeId);

module.exports = router;

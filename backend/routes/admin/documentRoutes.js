const express = require("express");
const {
  getUploadFiles,
  getUploadFileById,
  createUploadFile,
  updateUploadFile,
  deleteUploadFile,
} = require("../../controllers/admin/documentController");
const {getUploadFileByCollegeId,} = require("../../controllers/admin/documentIdController")
const router = express.Router();

router.get("/brochure", getUploadFiles);
router.get("/brochure/:id", getUploadFileById);
router.post("/brochure/", createUploadFile);
router.put("/brochure/:id", updateUploadFile);
router.delete("/brochure/:id", deleteUploadFile);
router.get("/brochure/college/:collegeId", getUploadFileByCollegeId);

module.exports = router;

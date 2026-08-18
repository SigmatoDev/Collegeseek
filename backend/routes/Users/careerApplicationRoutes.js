const express = require("express");
const multer = require("multer");
const authenticateUser = require("../../middlewares/users/authMiddleware");
const protect = require("../../middlewares/admin/authMiddleware");
const { submitCareerApplication, listCareerApplications, getCareerApplicationById, updateCareerApplicationStatus } = require("../../controllers/users/careerApplicationController");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

router.post("/career-applications", authenticateUser, upload.single("resume"), submitCareerApplication);
router.get("/admin/career-applications", protect, listCareerApplications);
router.get("/admin/career-applications/:id", protect, getCareerApplicationById);
router.patch("/admin/career-applications/:id/status", protect, updateCareerApplicationStatus);

module.exports = router;

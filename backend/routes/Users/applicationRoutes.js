const express = require("express");
const multer = require("multer");
const {
  submitApplication,
  listApplications,
  getApplicationById,
  updateApplicationStatus,
} = require("../../controllers/users/applicationController");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 },
});

router.post(
  "/applications",
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "signature", maxCount: 1 },
    { name: "diplomaCertificate", maxCount: 1 },
    { name: "bachelorCertificate", maxCount: 1 },
    { name: "masterCertificate", maxCount: 1 },
    { name: "otherQualificationCertificate", maxCount: 1 },
  ]),
  submitApplication
);

router.get("/applications", listApplications);
router.get("/applications/:id", getApplicationById);
router.put("/applications/:id", updateApplicationStatus);

module.exports = router;

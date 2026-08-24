const express = require("express");
const multer = require("multer");
const multerS3 = require("multer-s3");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const s3 = require("../../utils/s3"); // your existing s3 client

const { getSettings, updateSettings } = require("../../controllers/admin/settingsController");

const router = express.Router();

// ✅ Multer-S3 storage configuration
const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (_req, file, cb) => {
      const uniqueKey = `settings/${uuidv4()}${path.extname(file.originalname)}`;
      cb(null, uniqueKey);
    },
  }),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
}).fields([
  { name: "siteLogo", maxCount: 1 },
  { name: "favicon", maxCount: 1 },
  { name: "footerLogo", maxCount: 1 },
]);

// ✅ Error handling middleware
const uploadHandler = (req, res, next) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ success: false, message: err.message });
    } else if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
};

router.get("/settings", getSettings);
router.put("/setting", uploadHandler, updateSettings);

module.exports = router;
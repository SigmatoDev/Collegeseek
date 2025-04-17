const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const { getSettings, updateSettings } = require("../../controllers/admin/settingsController");

const router = express.Router();

// ✅ Multer storage configuration
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const uploadDir = path.join(__dirname, "../../uploads/settings");
    fs.mkdirSync(uploadDir, { recursive: true }); // Ensure the folder exists
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueFilename = uuidv4() + path.extname(file.originalname);
    cb(null, uniqueFilename);
  },
});

// ✅ Multer configuration
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
}).fields([
  { name: "siteLogo", maxCount: 1 },
  { name: "favicon", maxCount: 1 },
]);

// ✅ Middleware to handle file upload errors
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

// ✅ Routes
router.get("/settings", getSettings);
router.put("/settings", uploadHandler, updateSettings);

module.exports = router;

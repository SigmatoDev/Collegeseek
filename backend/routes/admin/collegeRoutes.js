const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

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
} = require("../../controllers/admin/collegeController");

const router = express.Router();

// ✅ Multer storage configuration
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const uploadDir = path.join(__dirname, "../../uploads");
    fs.mkdirSync(uploadDir, { recursive: true }); // Ensure the folder exists
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueFilename = uuidv4() + path.extname(file.originalname);
    cb(null, uniqueFilename);
  },
});

// ✅ Multer configuration without image validation
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
}).fields([
  { name: "image", maxCount: 1 }, 
  { name: "imageGallery", maxCount: 5 }, 
  
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
router.get("/colleges", getColleges);
router.get("/f/college", getCollege);
router.get("/get/colleges/", getallColleges),
router.get("/colleges/:id", getCollegeById);
router.post("/colleges", uploadHandler, createCollege);
router.put("/colleges/:id", uploadHandler, updateCollege);
router.delete("/colleges/:id", deleteCollege);
router.get("/college/:slug", getCollegeBySlug);
router.get('/featured', getFeaturedColleges);



module.exports = router;

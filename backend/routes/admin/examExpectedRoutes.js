// const express = require('express');
// const { createExam, getAllExams, getExamById, updateExam, deleteExam } = require('../../controllers/admin/examExpectedController');
// const router = express.Router();


// // @route   POST /api/exams
// // @desc    Create a new exam
// router.post('/create/Exams/', createExam);

// // @route   GET /api/exams
// // @desc    Get all exams
// router.get('/get/Exams/', getAllExams);

// // @route   GET /api/exams/:id
// // @desc    Get exam by ID
// router.get('/id/Exams/:id', getExamById);

// // @route   PUT /api/exams/:id
// // @desc    Update exam by ID
// router.put('/update/Exams/:id', updateExam);

// // @route   DELETE /api/exams/:id
// // @desc    Delete exam by ID
// router.delete('/d/Exams/:id', deleteExam);

// module.exports = router;
const express = require('express');
const multer = require('multer');
const {
  createExam,
  getAllExams,
  getExamById,
  updateExam,
  deleteExam
} = require('../../controllers/admin/examExpectedController');

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPG, PNG, and WEBP are allowed."), false);
    }
  },
});

// Routes with image upload on create and update
router.post('/create/exams/', upload.single("image"), createExam);
router.get('/get/exams/', getAllExams);
router.get('/id/exams/:id', getExamById);
router.put('/update/exams/:id', upload.single("image"), updateExam);
router.delete('/d/exams/:id', deleteExam);

module.exports = router;

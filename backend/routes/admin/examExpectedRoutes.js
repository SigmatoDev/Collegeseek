const express = require('express');
const { createExam, getAllExams, getExamById, updateExam, deleteExam } = require('../../controllers/admin/examExpectedController');
const router = express.Router();


// @route   POST /api/exams
// @desc    Create a new exam
router.post('/create/Exams/', createExam);

// @route   GET /api/exams
// @desc    Get all exams
router.get('/get/Exams/', getAllExams);

// @route   GET /api/exams/:id
// @desc    Get exam by ID
router.get('/id/Exams/:id', getExamById);

// @route   PUT /api/exams/:id
// @desc    Update exam by ID
router.put('/update/Exams/:id', updateExam);

// @route   DELETE /api/exams/:id
// @desc    Delete exam by ID
router.delete('/d/Exams/:id', deleteExam);

module.exports = router;

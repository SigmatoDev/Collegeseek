const express = require('express');
const {
  createSpecialization,
  getAllSpecializations,
  getSpecializationById,
  updateSpecialization,
  deleteSpecialization,
} = require('../../controllers/admin/specializationController');

const router = express.Router();

// Create a new specialization
router.post('/create/Specialization/', createSpecialization);

// Get all specializations
router.get('/get/Specialization/', getAllSpecializations);

// Get specialization by ID
router.get('/id/Specialization/:id', getSpecializationById);

// Update specialization by ID
router.put('/update/Specialization/:id', updateSpecialization);

// Delete specialization by ID
router.delete('/d/Specialization/:id', deleteSpecialization);

module.exports = router;

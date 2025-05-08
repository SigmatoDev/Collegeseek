// routes/affiliatedByRoutes.js
const express = require('express');
const { createAffiliatedBy, getAllAffiliatedBy, getAffiliatedByById, updateAffiliatedBy, deleteAffiliatedBy } = require('../../controllers/admin/affiliatedByController');
const router = express.Router();


// Create a new affiliation
router.post('/create/affiliated/', createAffiliatedBy);

// Get all affiliations
router.get('/get/affiliated/', getAllAffiliatedBy);

// Get a single affiliation by ID
router.get('/id/affiliated/:id', getAffiliatedByById);

// Update an affiliation by ID
router.put('/update/affiliated/:id', updateAffiliatedBy);

// Delete an affiliation by ID
router.delete('/d/affiliated/:id', deleteAffiliatedBy);

module.exports = router;

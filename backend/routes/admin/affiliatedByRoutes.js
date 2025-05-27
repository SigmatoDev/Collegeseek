// routes/affiliatedByRoutes.js
const express = require('express');
const { createAffiliatedBy, getAllAffiliatedBy, getAffiliatedByById, updateAffiliatedBy, deleteAffiliatedBy, getAllAffiliatedBy2 } = require('../../controllers/admin/affiliatedByController');
const router = express.Router();


// Create a new affiliation
router.post('/create/affiliated/', createAffiliatedBy);

// Get all affiliations
router.get('/get/affiliated/', getAllAffiliatedBy);
router.get('/get2/affiliated/', getAllAffiliatedBy2);

// Get a single affiliation by ID
router.get('/id/affiliated/:id', getAffiliatedByById);

// Update an affiliation by ID
router.put('/update/affiliated/:id', updateAffiliatedBy);

// Delete an affiliation by ID
router.delete('/d/affiliated/:id', deleteAffiliatedBy);

module.exports = router;
router.get('/get/affiliated/', getAllAffiliatedBy);

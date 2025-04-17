const express = require('express');
const { createTerm, getTerms, getTermBySlug, updateTerm, deleteTerm, getTermById } = require('../../controllers/admin/termsAndConditionsController');
const router = express.Router();

// Create a new Terms and Conditions entry
router.post('/create/terms', createTerm);

// Get all Terms and Conditions entries
router.get('/terms', getTerms);

// Get a specific Terms and Conditions entry by slug
router.get('/terms/:slug', getTermBySlug);

// Update a specific Terms and Conditions entry by ID
router.put('/terms/:id', updateTerm);

// Delete a specific Terms and Conditions entry by ID
router.delete('/terms/:id', deleteTerm );

router.get('/getid/terms/:id', getTermById);


module.exports = router;

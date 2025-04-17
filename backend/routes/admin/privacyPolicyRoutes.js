const express = require('express');
const { createPrivacyPolicy, getPrivacyPolicies, getPrivacyPolicyBySlug, updatePrivacyPolicy, deletePrivacyPolicy, getPrivacyPolicyById } = require('../../controllers/admin/privacyPolicyController');
const router = express.Router();

// Create a new Privacy Policy entry
router.post('/create/privacy-policy', createPrivacyPolicy);

// Get all Privacy Policies entries
router.get('/privacy-policy', getPrivacyPolicies);

// Get a specific Privacy Policy entry by slug
router.get('/privacy-policy/:slug', getPrivacyPolicyBySlug);

// Update a specific Privacy Policy entry by ID
router.put('/privacy-policy/:id', updatePrivacyPolicy);

// Delete a specific Privacy Policy entry by ID
router.delete('/privacy-policy/:id', deletePrivacyPolicy);

// Get a specific Privacy Policy entry by ID
router.get('/getid/privacy-policy/:id', getPrivacyPolicyById);

module.exports = router;

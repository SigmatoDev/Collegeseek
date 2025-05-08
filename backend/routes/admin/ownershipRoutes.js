const express = require('express');
const { createOwnership, getAllOwnerships, getOwnershipById, updateOwnership, deleteOwnership } = require('../../controllers/admin/ownershipController');
const router = express.Router();



// Create a new ownership
router.post('/create/Ownership/', createOwnership);

// Get all ownerships
router.get('/get/Ownership/', getAllOwnerships);

// Get ownership by ID
router.get('/id/Ownership/:id', getOwnershipById);

// Update ownership by ID
router.put('/update/Ownership/:id', updateOwnership);

// Delete ownership by ID
router.delete('/d/Ownership/:id', deleteOwnership);

module.exports = router;

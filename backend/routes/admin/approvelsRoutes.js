const express = require('express');
const { createApproval, getAllApprovals, getApprovalById, updateApproval, deleteApproval, getAllApprovals2 } = require('../../controllers/admin/approvelsController');
const router = express.Router();

// Create a new approval
router.post('/create/approvals', createApproval);

// Get all approvals
router.get('/get/approvals', getAllApprovals);
router.get('/get2/approvals', getAllApprovals2);

// Get an approval by ID
router.get('/id/approvals/:id', getApprovalById);

// Update an approval by ID
router.put('/update/approvals/:id', updateApproval);

// Delete an approval by ID
router.delete('/d/approvals/:id', deleteApproval);

module.exports = router;

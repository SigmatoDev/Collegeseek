const express = require('express');
const programModeController = require('../../controllers/admin/programModeController');
const router = express.Router();

// Create a new Program Mode
router.post('/create/program/', programModeController.createProgramMode);

// Get all Program Modes
router.get('/get/program/', programModeController.getAllProgramModes);

// Get a Program Mode by ID
router.get('/id/program/:id', programModeController.getProgramModeById);

// Update a Program Mode
router.put('/update/program/:id', programModeController.updateProgramMode);

// Delete a Program Mode
router.delete('/d/program/:id', programModeController.deleteProgramMode);

module.exports = router;

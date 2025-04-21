// routes/contactRoutes.js
const express = require('express');
const { submitContactForm, deleteContact, getContactById, getContacts } = require('../../controllers/users/contactUsController');
const router = express.Router();

// Route to handle form submission
router.post('/contact', submitContactForm);

router.get('/get/contacts', getContacts);

// Get Contact by ID (GET)
router.get('/id/contacts/:id', getContactById);

// Delete Contact (DELETE)
router.delete('/d/contacts/:id', deleteContact);

module.exports = router;

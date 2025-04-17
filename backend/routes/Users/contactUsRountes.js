// routes/contactRoutes.js
const express = require('express');
const { submitContactForm } = require('../../controllers/users/contactUsController');
const router = express.Router();

// Route to handle form submission
router.post('/contact', submitContactForm);

module.exports = router;

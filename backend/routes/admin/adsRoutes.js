// routes/addRoutes.js
const express = require('express');
const router = express.Router();
const upload = require('../../middlewares/admin/upload');
const addController = require('../../controllers/admin/adsController');

// Route to add item with image
router.post('/add', upload.single('image'), addController.createItem);

module.exports = router;

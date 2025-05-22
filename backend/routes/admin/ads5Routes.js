const express = require('express');
const { getAllAds, getAdById, createAd, updateAd, deleteAd, upload } = require('../../controllers/admin/ads5controller');
const router = express.Router();

// Use /ads5 as base path

// Get all ads
router.get('/get/ads5', getAllAds);

// Get ad by ID
router.get('/id/ads5/:id', getAdById);

// Create ad with image upload
router.post('/create/ads5', upload.single('image'), createAd);

// Update ad with image upload (optional)
router.put('/update/ads5/:id', upload.single('image'), updateAd);

// Delete ad
router.delete('d/ads5/:id', deleteAd);

module.exports = router;

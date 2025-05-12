const express = require('express');
const router = express.Router();
const { uploadImagee, getAds, updateImage } = require('../../controllers/admin/ads1Controller');

// POST route to upload an image ad
router.post('/upload-ad', uploadImagee);
router.get('/ads', getAds);

// Update ad image
router.put('/update-ad-image/:adId', updateImage);


module.exports = router;

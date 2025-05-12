const express = require('express');
const { uploadImagee, getAds, updateImage } = require('../../controllers/admin/ads2Controller');
const router = express.Router();

// POST route to upload an image ad
router.post('/upload-ad2', uploadImagee);
router.get('/ads2', getAds);

// Update ad image
router.put('/update-ad-image2/:adId', updateImage);


module.exports = router;

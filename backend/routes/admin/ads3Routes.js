const express = require('express');
const { uploadImagee, getAds, updateImage } = require('../../controllers/admin/ads3Controller');
const router = express.Router();

// POST route to upload an image ad
router.post('/upload-ad3', uploadImagee);
router.get('/ads3', getAds);

// Update ad image
router.put('/u/update-ad-image3/:adId', updateImage);


module.exports = router;

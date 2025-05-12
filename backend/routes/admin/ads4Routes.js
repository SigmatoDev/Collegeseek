const express = require('express');
const { uploadImagee, getAds, updateImage } = require('../../controllers/admin/ads4Controller');
const router = express.Router();

// POST route to upload an image ad
router.post('/upload-ad4', uploadImagee);
router.get('/ads4', getAds);

// Update ad image
router.put('/update-ad-image4/:adId', updateImage);


module.exports = router;

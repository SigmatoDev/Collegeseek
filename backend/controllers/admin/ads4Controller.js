const Ads = require('../../models/admin/ads4model');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer to store uploaded images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage }).single('image');

// Upload new ad
const uploadImagee = (req, res) => {
  console.log("Upload API hit");

  upload(req, res, async (err) => {
    if (err) {
      console.error("Error uploading image:", err);
      return res.status(500).json({ error: 'Error uploading image.' });
    }

    try {
      const { description } = req.body;
      const imagePath = req.file ? req.file.path.replace(/\\/g, '/') : '';

      if (!imagePath) {
        return res.status(400).json({ error: 'No image file uploaded' });
      }

      const ad = new Ads({ description, image: imagePath });
      await ad.save();

      res.status(200).json({
        message: 'Ad added successfully',
        ad,
        imageUrl: `${req.protocol}://${req.get('host')}/${imagePath}`
      });
    } catch (error) {
      console.error("Error saving ad data:", error);
      res.status(500).json({ error: 'Error saving ad data' });
    }
  });
};

// Get all ads
const getAds = async (req, res) => {
  try {
    const ads = await Ads.find();
    if (!ads || ads.length === 0) {
      return res.status(404).json({ message: 'No ads found' });
    }

    const adsWithImageUrls = ads.map(ad => ({
      ...ad._doc,
      imageUrl: `${req.protocol}://${req.get('host')}/${ad.image}`
    }));

    res.status(200).json({
      message: 'Ads fetched successfully',
      ads: adsWithImageUrls
    });
  } catch (error) {
    console.error("Error fetching ads:", error);
    res.status(500).json({ error: 'Error fetching ads data' });
  }
};

// Update ad image
const updateImage = (req, res) => {
  console.log("Update Image API hit 4");

  const { adId } = req.params;

  if (!adId) {
    return res.status(400).json({ error: 'Ad ID is required.' });
  }

  upload(req, res, async (err) => {
    if (err) {
      console.error("Error uploading image:", err);
      return res.status(500).json({ error: 'Error uploading image.' });
    }

    try {
      const ad = await Ads.findById(adId);
      if (!ad) {
        return res.status(404).json({ error: 'Ad not found' });
      }

      const newImagePath = req.file ? req.file.path.replace(/\\/g, '/') : ad.image;

      // If a new image is uploaded, delete the old one
      if (req.file && ad.image) {
        const oldImagePath = path.join(__dirname, '../../', ad.image);
        if (fs.existsSync(oldImagePath)) {
          try {
            fs.unlinkSync(oldImagePath);
          } catch (unlinkErr) {
            console.warn("Failed to delete old image:", unlinkErr.message);
          }
        } else {
          console.warn("Old image not found for deletion:", oldImagePath);
        }
      }

      ad.image = newImagePath;
      await ad.save();

      res.status(200).json({
        message: 'Ad image updated successfully',
        ad,
        imageUrl: `${req.protocol}://${req.get('host')}/${newImagePath}`
      });
    } catch (error) {
      console.error("Error updating ad image:", error);
      res.status(500).json({ error: 'Error updating ad image' });
    }
  });
};

module.exports = {
  uploadImagee,
  getAds,
  updateImage,
};

const Ads = require('../../models/admin/ads1Model');
const multer = require('multer');
const path = require('path');

// Configure multer to store uploaded images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/'); // Folder to store images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename with extension
  }
});

const upload = multer({ storage }).single('image');

// Image upload endpoint
const uploadImagee = (req, res) => {
  console.log("Upload API hit");

  upload(req, res, async (err) => {
    if (err) {
      console.error("Error uploading image:", err);
      return res.status(500).json({ error: 'Error uploading image.' });
    }

    try {
      const { description, link } = req.body; // Added link here
      let imagePath = req.file ? req.file.path.replace(/\\/g, '/') : ''; // Normalize path

      if (!imagePath) {
        return res.status(400).json({ error: 'No image file uploaded' });
      }

      const ad = new Ads({
        description,
        image: imagePath,
        link, // Save link here
      });

      await ad.save();

      res.status(200).json({
        message: 'Ad added successfully',
        ad,
        imageUrl: `${req.protocol}://${req.get('host')}/${imagePath}` // Optional full URL
      });
    } catch (error) {
      console.error("Error saving ad data:", error);
      res.status(500).json({ error: 'Error saving ad data' });
    }
  });
};

const getAds = async (req, res) => {
  try {
    // Fetch all ads from the database
    const ads = await Ads.find();

    if (!ads || ads.length === 0) {
      return res.status(404).json({ message: 'No ads found' });
    }

    // Map ads and generate full image URLs
    const adsWithImageUrls = ads.map(ad => ({
      ...ad._doc, // Spread the original ad fields including link
      imageUrl: `${req.protocol}://${req.get('host')}/${ad.image}`, // Generate the image URL
    }));

    res.status(200).json({
      message: 'Ads fetched successfully',
      ads: adsWithImageUrls,
    });
  } catch (error) {
    console.error("Error fetching ads:", error);
    res.status(500).json({ error: 'Error fetching ads data' });
  }
};

const updateImage = (req, res) => {
  console.log("Update Image API hit");

  const { adId } = req.params; // Get the ad ID from the URL parameter

  // Validate if adId is provided
  if (!adId) {
    return res.status(400).json({ error: 'Ad ID is required.' });
  }

  upload(req, res, async (err) => {
    if (err) {
      console.error("Error uploading image:", err);
      return res.status(500).json({ error: 'Error uploading image.' });
    }

    try {
      const ad = await Ads.findById(adId); // Find the ad by ID

      if (!ad) {
        return res.status(404).json({ error: 'Ad not found' });
      }

      // Check if a new image is provided
      let imagePath = req.file ? req.file.path.replace(/\\/g, '/') : ad.image; // Use existing image if no new image is uploaded

      // If a new image is uploaded, we should delete the old image from the server (optional)
      if (req.file && ad.image) {
        const fs = require('fs');
        const oldImagePath = ad.image.replace(/\\/g, '/');
        fs.unlinkSync(oldImagePath); // Delete the old image file from the server (ensure to handle errors)
      }

      // Update the ad image in the database
      ad.image = imagePath;

      // Also update link if provided in body
      if (req.body.link !== undefined) {
        ad.link = req.body.link;
      }

      // Save the updated ad
      await ad.save();

      res.status(200).json({
        message: 'Ad image updated successfully',
        ad,
        imageUrl: `${req.protocol}://${req.get('host')}/${imagePath}` // Optional full URL
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

const Ad = require('../../models/admin/ads5Model');
const multer = require('multer');
const path = require('path');

// Multer config for storing uploaded images locally in /uploads folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // make sure this folder exists or create it
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage });

// Get all ads
const getAllAds = async (req, res) => {
  try {
    const ads = await Ad.find().sort({ createdAt: -1 });
    res.status(200).json(ads);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch ads", error });
  }
};


// Get a single ad by ID
const getAdById = async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);
    if (!ad) return res.status(404).json({ message: "Ad not found" });
    res.status(200).json(ad);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch ad", error });
  }
};


// Create a new ad with image upload
const createAd = async (req, res) => {
  try {
    const { alt } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }
   
    const src = '/uploads/' + req.file.filename; // store the relative path to serve later
    const newAd = new Ad({ src, alt });
    const savedAd = await newAd.save();
    res.status(201).json(savedAd);
  } catch (error) {
    res.status(500).json({ message: "Failed to create ad", error });
  }
};

// Update an existing ad
// Update an existing ad with optional image upload
const updateAd = async (req, res) => {
  try {
    const { link } = req.body;  // Only link now

    let updateFields = { link };  // Removed alt, keep only link

    if (req.file) {
      updateFields.src = '/uploads/' + req.file.filename; // Use new image if provided
    }

    const updatedAd = await Ad.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updatedAd) {
      return res.status(404).json({ message: "Ad not found" });
    }

    res.status(200).json(updatedAd);
  } catch (error) {
    res.status(500).json({ message: "Failed to update ad", error });
  }
};



// Delete an ad
const deleteAd = async (req, res) => {
  try {
    const deletedAd = await Ad.findByIdAndDelete(req.params.id);
    if (!deletedAd) return res.status(404).json({ message: "Ad not found" });
    res.status(200).json({ message: "Ad deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete ad", error });
  }
};

module.exports = {
    upload, // export multer middleware
  getAllAds,
  getAdById,
  createAd,
  updateAd,
  deleteAd,
};

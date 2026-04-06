const Ad = require('../../models/admin/ads5Model');
const multer = require('multer');
const path = require('path');
const AWS = require("@aws-sdk/client-s3");
const multerS3 = require('multer-s3');

// Initialize S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,     // from your .env
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // from your .env
  region: process.env.AWS_REGION                  // e.g., 'ap-south-1'
});

// Multer S3 storage config
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    // acl: 'public-read',  <-- REMOVE this line
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, `ads/${file.fieldname}-${uniqueSuffix}${ext}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
});
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
    const { link } = req.body;
    const adId = req.params.id;

    // Find the existing ad
    const existingAd = await Ad.findById(adId);
    if (!existingAd) {
      return res.status(404).json({ message: "Ad not found" });
    }

    let updateFields = { link };

    // If a new file is uploaded, update src and delete old S3 image
    if (req.file) {
      // Delete old image from S3 if exists
      if (existingAd.src) {
        // Extract key from S3 URL
        const oldKey = existingAd.src.split('.amazonaws.com/')[1];
        if (oldKey) {
          await s3
            .deleteObject({ Bucket: process.env.AWS_BUCKET_NAME, Key: oldKey })
            .promise()
            .catch(err => console.error("S3 delete error:", err));
        }
      }

      // Set new image URL
      updateFields.src = req.file.location; // multer-s3 provides .location
    }

    const updatedAd = await Ad.findByIdAndUpdate(adId, updateFields, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updatedAd);
  } catch (error) {
    console.error("Update ad error:", error);
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

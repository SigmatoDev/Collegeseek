const Ads = require("../../models/admin/ads3model");
const multer = require("multer");
const multerS3 = require("multer-s3");
const AWS = require("@aws-sdk/client-s3");
const path = require("path");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Multer S3 storage
const storage = multerS3({
  s3: s3,
  bucket: process.env.AWS_BUCKET_NAME,
  metadata: (req, file, cb) => cb(null, { fieldName: file.fieldname }),
  key: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({ storage }).single("image");

// Upload new ad
const uploadImagee = (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(500).json({ error: "Error uploading image." });

    try {
      const { description, link } = req.body;
      if (!req.file || !req.file.location) {
        return res.status(400).json({ error: "No image file uploaded" });
      }

      const ad = new Ads({
        description,
        image: req.file.location,
        link,
      });

      await ad.save();

      res.status(200).json({
        message: "Ad added successfully",
        ad,
        imageUrl: req.file.location,
      });
    } catch (error) {
      console.error("Error saving ad:", error);
      res.status(400).json({ error: error.message });
    }
  });
};

// Fetch all ads
const getAds = async (req, res) => {
  try {
    const ads = await Ads.find();
    if (!ads || ads.length === 0) {
      return res.status(404).json({ message: "No ads found" });
    }

    const adsWithImageUrls = ads.map((ad) => ({
      ...ad._doc,
      imageUrl: ad.image,
    }));

    res.status(200).json({
      message: "Ads fetched successfully",
      ads: adsWithImageUrls,
    });
  } catch (error) {
    console.error("Error fetching ads:", error);
    res.status(500).json({ error: "Error fetching ads data" });
  }
};

// Update ad image and/or link
const updateImage = (req, res) => {
  const { adId } = req.params;
  if (!adId) return res.status(400).json({ error: "Ad ID is required." });

  upload(req, res, async (err) => {
    if (err) return res.status(500).json({ error: "Error uploading image." });

    try {
      const ad = await Ads.findById(adId);
      if (!ad) return res.status(404).json({ error: "Ad not found" });

      let newImageUrl = ad.image;

      if (req.file && req.file.location) {
        newImageUrl = req.file.location;

        // Delete old image from S3 safely
        if (ad.image) {
          try {
            const url = new URL(ad.image);
            const oldImageKey = url.pathname.slice(1); // Extract S3 key
            await s3.deleteObject({
              Bucket: process.env.AWS_BUCKET_NAME,
              Key: oldImageKey,
            });
            console.log("Old S3 image deleted successfully");
          } catch (deleteErr) {
            console.error("Error deleting old S3 image:", deleteErr);
          }
        }
      }

      // Update ad
      ad.image = newImageUrl;
      if (req.body.link !== undefined) ad.link = req.body.link;

      await ad.save();

      res.status(200).json({
        message: "Ad updated successfully",
        ad,
        imageUrl: newImageUrl,
      });
    } catch (error) {
      console.error("Error updating ad:", error);
      res.status(400).json({ error: error.message });
    }
  });
};

module.exports = {
  uploadImagee,
  getAds,
  updateImage,
};
const Settings = require("../../models/admin/Settings"); // Your MongoDB settings model
const multer = require("multer");
const path = require("path");

// Configure file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/settings/"); // Changed folder to 'settings' within 'uploads' for better organization
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname)); // Generating unique filenames
  },
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true); // Allow only image files
  } else {
    cb(new Error("Only image files are allowed"), false); // Reject non-image files
  }
};

// Multer upload instance
const upload = multer({ storage, fileFilter });

// ================================
// 🚀 UPDATE SETTINGS CONTROLLER
// ================================
const updateSettings = async (req, res) => {
  try {
    const { siteName } = req.body;
    // Handle file uploads if present
    const siteLogo = req.files["siteLogo"] ? req.files["siteLogo"][0].filename : null;
    const favicon = req.files["favicon"] ? req.files["favicon"][0].filename : null;

    // Find existing settings or create a new one
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
    }

    // Update the settings data with new values, if provided
    settings.siteName = siteName || settings.siteName;
    if (siteLogo) settings.siteLogo = `/uploads/settings/${siteLogo}`;
    if (favicon) settings.favicon = `/uploads/settings/${favicon}`;

    // Save the updated settings to the database
    await settings.save();

    // Sending back the updated settings with the full URL to the client
    res.status(200).json({
      message: "Settings updated successfully",
      settings: {
        siteName: settings.siteName,
        siteLogo: settings.siteLogo, // This will be the relative URL for the logo
        favicon: settings.favicon, // This will be the relative URL for the favicon
      },
    });
  } catch (error) {
    console.error("Error updating settings:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ================================
// 🚀 GET SETTINGS CONTROLLER
// ================================
const getSettings = async (req, res) => {
  try {
    const settings = await Settings.findOne();
    if (!settings) {
      return res.status(404).json({ message: "No settings found" });
    }
    res.status(200).json(settings); // Send back the settings with URLs for siteLogo and favicon
  } catch (error) {
    console.error("Error fetching settings:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ================================
// 🚀 EXPORT CONTROLLERS
// ================================
module.exports = {
  updateSettings,
  getSettings,
  upload,
};

const Settings = require("../../models/admin/Settings");
const multer = require("multer");
const path = require("path");

const DEFAULT_CONTACT = {
  email: "hello@collegeseek.in",
  phone: "1800-572-9877",
  address: "123 College Road, Education City",
};

const DEFAULT_SOCIAL_LINKS = {
  facebook: "#",
  instagram: "#",
  linkedin: "#",
  x: "#",
  youtube: "#",
};

const buildSettingsResponse = (settingsDoc) => {
  const social = { ...DEFAULT_SOCIAL_LINKS };

  if (settingsDoc?.socialLinks) {
    Object.keys(DEFAULT_SOCIAL_LINKS).forEach((key) => {
      if (settingsDoc.socialLinks[key]) {
        social[key] = settingsDoc.socialLinks[key];
      }
    });
  }

  return {
    siteName: settingsDoc?.siteName || "",
    siteLogo: settingsDoc?.siteLogo || "",
    favicon: settingsDoc?.favicon || "",
    tinymceApiKey: settingsDoc?.tinymceApiKey || "",
    contactEmail: settingsDoc?.contactEmail || DEFAULT_CONTACT.email,
    contactPhone: settingsDoc?.contactPhone || DEFAULT_CONTACT.phone,
    contactAddress: settingsDoc?.contactAddress || DEFAULT_CONTACT.address,
    socialLinks: social,
  };
};

const sanitizeInput = (value) => {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : undefined;
};

// Configure file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/settings/");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  },
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

// Multer upload instance
const upload = multer({ storage, fileFilter });

// ================================
// 🚀 UPDATE SETTINGS CONTROLLER
// ================================
const updateSettings = async (req, res) => {
  try {
    const {
      siteName,
      tinymceApiKey,
      contactEmail,
      contactPhone,
      contactAddress,
      facebook,
      instagram,
      linkedin,
      x,
      youtube,
    } = req.body;

    const siteLogo = req.files["siteLogo"] ? req.files["siteLogo"][0].filename : null;
    const favicon = req.files["favicon"] ? req.files["favicon"][0].filename : null;

    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
    }

    settings.siteName = siteName || settings.siteName;
    settings.tinymceApiKey = tinymceApiKey || settings.tinymceApiKey;

    const nextEmail = sanitizeInput(contactEmail);
    const nextPhone = sanitizeInput(contactPhone);
    if (nextEmail !== undefined) settings.contactEmail = nextEmail;
    if (nextPhone !== undefined) settings.contactPhone = nextPhone;
    const nextAddress = sanitizeInput(contactAddress);
    if (nextAddress !== undefined) settings.contactAddress = nextAddress;

    const socialUpdates = {
      facebook: sanitizeInput(facebook),
      instagram: sanitizeInput(instagram),
      linkedin: sanitizeInput(linkedin),
      x: sanitizeInput(x),
      youtube: sanitizeInput(youtube),
    };

    settings.socialLinks = settings.socialLinks || {};
    Object.entries(socialUpdates).forEach(([key, value]) => {
      if (value !== undefined) {
        settings.socialLinks[key] = value;
      }
    });

    if (siteLogo) settings.siteLogo = `/uploads/settings/${siteLogo}`;
    if (favicon) settings.favicon = `/uploads/settings/${favicon}`;

    await settings.save();

    res.status(200).json({
      message: "Settings updated successfully",
      settings: buildSettingsResponse(settings),
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
    res.status(200).json(buildSettingsResponse(settings || null));
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

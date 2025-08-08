// controllers/meta.controller.js
const Meta = require("../../models/admin/contactUsMetaModel");

// Create or Update Meta
exports.upsertMeta = async (req, res) => {
  try {
    const { page, title, description } = req.body;

    const meta = await Meta.findOneAndUpdate(
      { page },
      { title, description },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json(meta);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Meta by Page
exports.getMetaByContactPage = async (req, res) => {
  try {
    const { page } = req.query;
    if (!page) {
      return res.status(400).json({ message: "Query param 'page' is required." });
    }

    const meta = await Meta.findOne({ page });

    if (!meta) {
      return res.status(404).json({ message: `Meta not found for page: ${page}` });
    }

    res.status(200).json(meta);
  } catch (err) {
    console.error("❌ Error fetching meta:", err);
    res.status(500).json({ message: "Server error while fetching metadata." });
  }
};

exports.contactUpdateMeta = async (req, res) => {
  try {
    const {
      page,
      title,
      description,
      keywords,
      ogTitle,
      ogDescription,
      ogUrl,
      ogSiteName,
      ogType,
      xTitle,
      xDescription,
    } = req.body;

    if (!page || !title || !description) {
      return res.status(400).json({ message: "Page, title, and description are required." });
    }

    const updated = await Meta.findOneAndUpdate(
      { page },
      {
        title,
        description,
        keywords,
        ogTitle,
        ogDescription,
        ogUrl,
        ogSiteName,
        ogType,
        xTitle,
        xDescription,
      },
      { new: true, upsert: true }
    );

    res.json(updated);
  } catch (err) {
    console.error("Error updating meta:", err);
    res.status(500).json({ message: "Error updating meta" });
  }
};
// controllers/meta.controller.js
const Meta = require("../../models/admin/collegeMetaModel");

// GET meta for a specific page
exports.getMetaByPage = async (req, res) => {
  try {
    const meta = await Meta.findOne({ page: req.params.page });
    if (!meta) return res.status(404).json({ message: "Meta not found" });
    res.json(meta);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST new meta
exports.createMeta = async (req, res) => {
  try {
    const exists = await Meta.findOne({ page: req.body.page });
    if (exists)
      return res.status(400).json({ message: "Meta already exists for this page" });

    const meta = new Meta(req.body);
    await meta.save();
    res.status(201).json(meta);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT update existing meta
exports.updateMeta = async (req, res) => {
  try {
    const updated = await Meta.findOneAndUpdate(
      { page: req.params.page },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: "Meta not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

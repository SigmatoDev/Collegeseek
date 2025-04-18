// controllers/addController.js
const AddItem = require('../../models/admin/adsModel');

exports.createItem = async (req, res) => {
  try {
    const { title, description } = req.body;
    const imageUrl = req.file ? req.file.path : null;

    const newItem = new AddItem({
      title,
      description,
      imageUrl,
    });

    await newItem.save();

    res.status(201).json({ message: 'Item created successfully', data: newItem });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

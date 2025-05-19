const Specialization = require('../../models/admin/specialization');

// Create a new specialization
const createSpecialization = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Specialization name is required' });
    }

    // Check if the specialization name already exists
    const existingSpecialization = await Specialization.findOne({ name: name.trim() });
    if (existingSpecialization) {
      return res.status(409).json({ message: 'Specialization with this name already exists' });
    }

    const newSpecialization = new Specialization({ name: name.trim() });
    const savedSpecialization = await newSpecialization.save();

    res.status(201).json(savedSpecialization);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get all specializations
const getAllSpecializations = async (req, res) => {
  try {
    const specializations = await Specialization.find();
    res.status(200).json(specializations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get single specialization by ID
const getSpecializationById = async (req, res) => {
  try {
    const specialization = await Specialization.findById(req.params.id);

    if (!specialization) {
      return res.status(404).json({ message: 'Specialization not found' });
    }

    res.status(200).json(specialization);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update specialization
const updateSpecialization = async (req, res) => {
  try {
    const { name } = req.body;
    const id = req.params.id;

    if (!name) {
      return res.status(400).json({ message: 'Specialization name is required' });
    }

    // Check if specialization with the new name already exists (excluding the current one)
    const existingSpecialization = await Specialization.findOne({ name: name.trim(), _id: { $ne: id } });
    if (existingSpecialization) {
      return res.status(409).json({ message: 'Specialization with this name already exists' });
    }

    const updated = await Specialization.findByIdAndUpdate(
      id,
      { name: name.trim() },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Specialization not found' });
    }

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


// Delete specialization
const deleteSpecialization = async (req, res) => {
  try {
    const deleted = await Specialization.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: 'Specialization not found' });
    }

    res.status(200).json({ message: 'Specialization deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = {
  createSpecialization,
  getAllSpecializations,
  getSpecializationById,
  updateSpecialization,
  deleteSpecialization,
};

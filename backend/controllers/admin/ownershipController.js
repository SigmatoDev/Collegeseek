const Ownership = require('../../models/admin/ownerShip');

// Create a new ownership
const createOwnership = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Ownership name is required' });
    }

    // Check if ownership with the same name already exists (case-insensitive)
    const existingOwnership = await Ownership.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });

    if (existingOwnership) {
      return res.status(400).json({ message: 'Ownership name already exists' });
    }

    const newOwnership = new Ownership({ name });
    const savedOwnership = await newOwnership.save();

    res.status(201).json(savedOwnership);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


// Get all ownerships
const getAllOwnerships = async (req, res) => {
  try {
    const ownerships = await Ownership.find();
    res.status(200).json(ownerships);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get single ownership by ID
const getOwnershipById = async (req, res) => {
  try {
    const ownership = await Ownership.findById(req.params.id);

    if (!ownership) {
      return res.status(404).json({ message: 'Ownership not found' });
    }

    res.status(200).json(ownership);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update ownership
const updateOwnership = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;

    if (!name) {
      return res.status(400).json({ message: 'Ownership name is required' });
    }

    // Check if another ownership with the same name exists (case-insensitive)
    const existingOwnership = await Ownership.findOne({ 
      _id: { $ne: id }, 
      name: { $regex: new RegExp(`^${name}$`, 'i') } 
    });

    if (existingOwnership) {
      return res.status(400).json({ message: 'Ownership name already exists' });
    }

    const updated = await Ownership.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Ownership not found' });
    }

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


// Delete ownership
const deleteOwnership = async (req, res) => {
  try {
    const deleted = await Ownership.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: 'Ownership not found' });
    }

    res.status(200).json({ message: 'Ownership deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = {
  createOwnership,
  getAllOwnerships,
  getOwnershipById,
  updateOwnership,
  deleteOwnership,
};

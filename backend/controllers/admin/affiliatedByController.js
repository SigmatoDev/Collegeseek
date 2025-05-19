// controllers/affiliatedByController.js
const AffiliatedBy = require('../../models/admin/affiliatedBy');

// Create new affiliation
const createAffiliatedBy = async (req, res) => {
  try {
    const { name, code } = req.body;

    // Check if affiliation with the same name already exists
    const existingAffiliation = await AffiliatedBy.findOne({ name });

    if (existingAffiliation) {
      return res.status(400).json({
        success: false,
        message: 'Affiliation with this name already exists',
      });
    }

    const newAffiliation = new AffiliatedBy({ name, code });
    await newAffiliation.save();

    res.status(201).json({ success: true, data: newAffiliation });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};


// Get all affiliations
const getAllAffiliatedBy = async (req, res) => {
  try {
    const affiliations = await AffiliatedBy.find();
    res.status(200).json({ success: true, data: affiliations });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get single affiliation by ID
const getAffiliatedByById = async (req, res) => {
  console.log(`API hit: Fetching affiliated data for ID: ${req.params.id} at ${new Date().toISOString()}`);

  try {
    console.log("Fetching affiliated data for ID:", req.params.id);  // Log the requested ID

    const affiliation = await AffiliatedBy.findById(req.params.id);

    if (!affiliation) {
      console.log("Affiliation not found for ID:", req.params.id);  // Log when affiliation is not found
      return res.status(404).json({ success: false, message: 'Affiliation not found' });
    }

    console.log("Affiliation found:", affiliation);  // Log the found affiliation data
    res.status(200).json({ success: true, data: affiliation });
  } catch (error) {
    console.error("Error fetching affiliated data:", error);  // Log any errors that occur
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};


// Update affiliation
const updateAffiliatedBy = async (req, res) => {
  try {
    const { name, code } = req.body;
    const { id } = req.params;

    // Check if another affiliation with the same name exists
    const existingAffiliation = await AffiliatedBy.findOne({ name, _id: { $ne: id } });

    if (existingAffiliation) {
      return res.status(400).json({
        success: false,
        message: 'Affiliation with this name already exists',
      });
    }

    const affiliation = await AffiliatedBy.findByIdAndUpdate(
      id,
      { name, code },
      { new: true }
    );

    if (!affiliation) {
      return res.status(404).json({ success: false, message: 'Affiliation not found' });
    }

    res.status(200).json({ success: true, data: affiliation });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};


// Delete affiliation
const deleteAffiliatedBy = async (req, res) => {
  try {
    const affiliation = await AffiliatedBy.findByIdAndDelete(req.params.id);
    if (!affiliation) {
      return res.status(404).json({ success: false, message: 'Affiliation not found' });
    }
    res.status(200).json({ success: true, message: 'Affiliation deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Export all controller functions
module.exports = {
  createAffiliatedBy,
  getAllAffiliatedBy,
  getAffiliatedByById,
  updateAffiliatedBy,
  deleteAffiliatedBy,
};

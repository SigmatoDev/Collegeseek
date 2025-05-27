// controllers/affiliatedByController.js
const AffiliatedBy = require("../../models/admin/affiliatedBy");

// Create new affiliation
const createAffiliatedBy = async (req, res) => {
  try {
    const { name, code } = req.body;

    // Check if affiliation with the same name already exists
    const existingAffiliation = await AffiliatedBy.findOne({ name });

    if (existingAffiliation) {
      return res.status(400).json({
        success: false,
        message: "Affiliation with this name already exists",
      });
    }

    const newAffiliation = new AffiliatedBy({ name, code });
    await newAffiliation.save();

    res.status(201).json({ success: true, data: newAffiliation });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

// Get all affiliations
const getAllAffiliatedBy2 = async (req, res) => {
  try {
    const affiliations = await AffiliatedBy.find();
    res.status(200).json({ success: true, data: affiliations });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

const getAllAffiliatedBy = async (req, res) => {
  try {
    // Parse page and limit from query parameters, set defaults
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Calculate how many documents to skip
    const skip = (page - 1) * limit;

    // Get total count of documents
    const total = await AffiliatedBy.countDocuments();

    // Get paginated results
    const affiliations = await AffiliatedBy.find().skip(skip).limit(limit);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: affiliations,
      pagination: {
        totalItems: total,
        totalPages,
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

// Get single affiliation by ID
const getAffiliatedByById = async (req, res) => {
  console.log(
    `API hit: Fetching affiliated data for ID: ${
      req.params.id
    } at ${new Date().toISOString()}`
  );

  try {
    console.log("Fetching affiliated data for ID:", req.params.id); // Log the requested ID

    const affiliation = await AffiliatedBy.findById(req.params.id);

    if (!affiliation) {
      console.log("Affiliation not found for ID:", req.params.id); // Log when affiliation is not found
      return res
        .status(404)
        .json({ success: false, message: "Affiliation not found" });
    }

    console.log("Affiliation found:", affiliation); // Log the found affiliation data
    res.status(200).json({ success: true, data: affiliation });
  } catch (error) {
    console.error("Error fetching affiliated data:", error); // Log any errors that occur
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

// Update affiliation
const updateAffiliatedBy = async (req, res) => {
  try {
    const { name, code } = req.body;
    const { id } = req.params;

    // Check if another affiliation with the same name exists
    const existingAffiliation = await AffiliatedBy.findOne({
      name,
      _id: { $ne: id },
    });

    if (existingAffiliation) {
      return res.status(400).json({
        success: false,
        message: "Affiliation with this name already exists",
      });
    }

    const affiliation = await AffiliatedBy.findByIdAndUpdate(
      id,
      { name, code },
      { new: true }
    );

    if (!affiliation) {
      return res
        .status(404)
        .json({ success: false, message: "Affiliation not found" });
    }

    res.status(200).json({ success: true, data: affiliation });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

// Delete affiliation
const deleteAffiliatedBy = async (req, res) => {
  try {
    const affiliation = await AffiliatedBy.findByIdAndDelete(req.params.id);
    if (!affiliation) {
      return res
        .status(404)
        .json({ success: false, message: "Affiliation not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Affiliation deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

// Export all controller functions
module.exports = {
  createAffiliatedBy,
  getAllAffiliatedBy,
  getAllAffiliatedBy2,
  getAffiliatedByById,
  updateAffiliatedBy,
  deleteAffiliatedBy,
};

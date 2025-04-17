const Counselling = require("../../models/users/CounsellingModel");

// Handle submitting counselling request
const submitCounsellingRequest = async (req, res) => {
  const { name, email, phone, college, message } = req.body;

  try {
    // Validate incoming data (basic)
    if (!name || !email || !phone || !college) {
      return res.status(400).json({ message: "All required fields must be filled." });
    }

    const newCounsellingRequest = new Counselling({
      name,
      email,
      phone,
      college,
      message,
    });

    // Save to database
    await newCounsellingRequest.save();

    return res.status(201).json({ message: "Counselling request submitted successfully." });
  } catch (error) {
    console.error("Error submitting counselling request:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// Get all counselling requests
const getAllCounsellingRequests = async (req, res) => {
  try {
    const counsellingRequests = await Counselling.find();
    return res.status(200).json({ data: counsellingRequests });
  } catch (error) {
    console.error("Error fetching counselling requests:", error);
    return res.status(500).json({ message: "Failed to fetch counselling requests." });
  }
};

// Get counselling request by ID
const getCounsellingRequestById = async (req, res) => {
  const { id } = req.params;

  try {
    const counsellingRequest = await Counselling.findById(id);
    if (!counsellingRequest) {
      return res.status(404).json({ message: "Counselling request not found." });
    }
    return res.status(200).json({ data: counsellingRequest });
  } catch (error) {
    console.error("Error fetching counselling request:", error);
    return res.status(500).json({ message: "Failed to fetch counselling request." });
  }
};

// Edit counselling request by ID
const editCounsellingRequest = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, college, message } = req.body;

  try {
    const updatedCounsellingRequest = await Counselling.findByIdAndUpdate(
      id,
      { name, email, phone, college, message },
      { new: true } // Return the updated document
    );

    if (!updatedCounsellingRequest) {
      return res.status(404).json({ message: "Counselling request not found." });
    }

    return res.status(200).json({ message: "Counselling request updated successfully.", data: updatedCounsellingRequest });
  } catch (error) {
    console.error("Error updating counselling request:", error);
    return res.status(500).json({ message: "Failed to update counselling request." });
  }
};

// Delete counselling request by ID
const deleteCounsellingRequest = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCounsellingRequest = await Counselling.findByIdAndDelete(id);

    if (!deletedCounsellingRequest) {
      return res.status(404).json({ message: "Counselling request not found." });
    }

    return res.status(200).json({ message: "Counselling request deleted successfully." });
  } catch (error) {
    console.error("Error deleting counselling request:", error);
    return res.status(500).json({ message: "Failed to delete counselling request." });
  }
};

module.exports = {
  submitCounsellingRequest,
  getAllCounsellingRequests,
  getCounsellingRequestById,
  editCounsellingRequest,
  deleteCounsellingRequest,
};

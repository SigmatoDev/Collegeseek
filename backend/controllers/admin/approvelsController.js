const Approval = require('../../models/admin/approvels'); // Import the Approval model

// Create a new approval
const createApproval = async (req, res) => {
  try {
    const { name, code } = req.body;

    // Check if the approval already exists (based on name)
    const existingApproval = await Approval.findOne({ name });
    if (existingApproval) {
      return res.status(400).json({ message: 'Approval with this name already exists' });
    }

    const approval = new Approval({
      name,
      code
    });

    await approval.save();
    res.status(201).json({ message: 'Approval created successfully', approval });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};


// Get all approvals
const getAllApprovals = async (req, res) => {
  try {
    const approvals = await Approval.find();
    res.status(200).json(approvals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get a specific approval by ID
const getApprovalById = async (req, res) => {
  try {
    const approval = await Approval.findById(req.params.id);
    if (!approval) {
      return res.status(404).json({ message: 'Approval not found' });
    }
    res.status(200).json(approval);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update an approval by ID
const updateApproval = async (req, res) => {
  try {
    const { name, code } = req.body;
    const approvalId = req.params.id;

    // Check if another approval with the same name exists
    const existingApproval = await Approval.findOne({ name, _id: { $ne: approvalId } });
    if (existingApproval) {
      return res.status(400).json({ message: 'Approval with this name already exists' });
    }

    const approval = await Approval.findByIdAndUpdate(
      approvalId,
      { name, code },
      { new: true }
    );

    if (!approval) {
      return res.status(404).json({ message: 'Approval not found' });
    }

    res.status(200).json({ message: 'Approval updated successfully', approval });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};


// Delete an approval by ID
const deleteApproval = async (req, res) => {
  try {
    const approval = await Approval.findByIdAndDelete(req.params.id);
    if (!approval) {
      return res.status(404).json({ message: 'Approval not found' });
    }
    res.status(200).json({ message: 'Approval deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = {
  createApproval,
  getAllApprovals,
  getApprovalById,
  updateApproval,
  deleteApproval
};

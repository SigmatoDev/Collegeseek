const mongoose = require('mongoose');
const UserShortlist = require('../../models/users/shortlistModel');
const College = require('../../models/admin/collegemodel');
const User = require('../../models/users/auth/usersModel');
// Create shortlist (already done)
const createShortlistForUser = async (req, res) => {
  const { collegeId, name, email, phone } = req.body;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const college = await College.findById(collegeId);
    if (!college) return res.status(404).json({ message: 'College not found.' });

    const newShortlist = new UserShortlist({
      userId,
      collegeId,
      name,
      email,
      phone: phone || '',
    });

    await newShortlist.save();

    res.status(201).json({
      message: 'Successfully added to shortlist!',
      data: newShortlist,
    });
  } catch (error) {
    console.error('Shortlist Error:', error.message);
    res.status(500).json({ message: 'Failed to add to shortlist.' });
  }
};

// ✅ Get all shortlists
const getAllShortlists = async (req, res) => {
  try {
    const shortlists = await UserShortlist.find()
      .populate('userId', 'name email')
      .populate('collegeId', 'name location');

    res.status(200).json({ data: shortlists });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching shortlists', error: error.message });
  }
};


const getUserShortlistById = async (req, res) => {
  try {
    const { id } = req.params;

    const shortlistedColleges = await UserShortlist.find({ userId: id })
      .populate('collegeId') // Optional: populates full college data
      .lean(); // Returns plain JS objects instead of Mongoose docs

    if (!shortlistedColleges || shortlistedColleges.length === 0) {
      return res.status(404).json({ message: 'No shortlisted colleges found.' });
    }

    res.status(200).json({ data: shortlistedColleges });
  } catch (error) {
    console.error('Error fetching shortlisted colleges:', error);
    res.status(500).json({ message: 'Server error while fetching data.' });
  }
};





// ✅ Get shortlists by logged-in user
const getUserShortlists = async (req, res) => {
  const userId = req.user._id; // Access the user ID from the request object
  
  try {
    const shortlists = await UserShortlist.find({ userId }).populate('collegeId'); // Populate related colleges
    
    if (!shortlists || shortlists.length === 0) {
      return res.status(404).json({ success: false, message: 'No shortlisted colleges found for this user' });
    }

    res.status(200).json({ success: true, data: shortlists });
  } catch (err) {
    console.error("Error fetching shortlists:", err);
    res.status(500).json({ success: false, message: 'Error fetching shortlisted colleges' });
  }
};

const removeShortlistedCollege = async (req, res) => {
  try {
    const { userId, shortlistId } = req.params; // Using shortlistId (not collegeId)

    // Validate MongoDB ObjectId format
    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(shortlistId)
    ) {
      return res.status(400).json({ message: 'Invalid userId or shortlistId format.' });
    }

    // Find and delete the shortlist entry by _id and userId
    const result = await UserShortlist.findOneAndDelete({
      _id: shortlistId,
      userId: userId,
    });

    if (!result) {
      return res.status(404).json({ message: 'Shortlisted college not found.' });
    }

    res.status(200).json({ message: 'College removed from shortlist successfully.' });
  } catch (error) {
    console.error('Error removing shortlisted college:', error);
    res.status(500).json({ message: 'Server error while removing the college.' });
  }
};







module.exports = {
  createShortlistForUser,
  getAllShortlists,
  getUserShortlistById,
  getUserShortlists,
  removeShortlistedCollege,
};


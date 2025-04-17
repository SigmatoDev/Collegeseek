const User = require('../../models/users/auth/usersModel');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const getUserProfile = async (req, res) => {
  try {
      const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header

      if (!token) {
          return res.status(401).json({ message: 'No token provided' });
      }

      // Verify and decode the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check if userId exists in the decoded token
      if (!decoded.userId || !mongoose.Types.ObjectId.isValid(decoded.userId)) {
          return res.status(400).json({ success: false, message: 'Invalid user ID in token' });
      }

      const user = await User.findById(decoded.userId).select('-password');

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      return res.status(200).json(user); // Return user data if found
  } catch (error) {
      console.error(error); // Log the error for debugging
      return res.status(500).json({ message: 'Server error' });
  }
};

const getUserProfileById = async (req, res) => {

  try {
    const { userId } = req.params;

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID' });
    }

    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

const updateProfile = async (req, res) => {
  const { name, phone, address } = req.body;
  const userId = req.params.id;

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user details
    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.address = address || user.address;

    // Save updated user
    const updatedUser = await user.save();

    // Return updated user data
    res.json({
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        address: updatedUser.address,
        createdAt: updatedUser.createdAt,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Error updating profile', error: err.message });
  }
};



module.exports = { getUserProfile , getUserProfileById , updateProfile };

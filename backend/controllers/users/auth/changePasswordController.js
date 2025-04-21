const bcrypt = require('bcryptjs');
const User = require('../../../models/users/auth/usersModel');  // Assuming the correct path

// Change Password Function
const changePassword = async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  const userId = req.user.id;  // Get the user ID from the JWT token (stored in req.user)

  if (!currentPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({ success: false, message: 'Please provide all required fields.' });
  }

  // Check if new password matches confirm password
  if (newPassword !== confirmPassword) {
    return res.status(400).json({ success: false, message: 'New password and confirmation password do not match.' });
  }

  try {
    // Fetch user from the database
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Compare current password with the stored password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update the user's password in the database
    user.password = hashedPassword;
    await user.save();  // Save the updated user

    // Send success response
    return res.status(200).json({ success: true, message: 'Password changed successfully.' });
  } catch (error) {
    console.error('Change Password Error:', error);
    return res.status(500).json({ success: false, message: 'Server error, please try again later.' });
  }
};

module.exports = { changePassword };

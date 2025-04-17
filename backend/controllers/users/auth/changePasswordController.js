// controllers/users/auth/changePassword.js
const bcrypt = require("bcryptjs");
const User = require("../../../models/users/auth/usersModel");

const changePassword = async (req, res) => {
  console.log("🔐 Incoming body:", req.body);

  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({ success: false, message: "All fields are required." });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ success: false, message: "New passwords do not match." });
  }

  try {
    const userId = req.user.id; // From protect middleware
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Current password is incorrect." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ success: true, message: "Password changed successfully." });
  } catch (error) {
    console.error("Password change error:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

module.exports = { changePassword };

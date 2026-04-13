const Admin = require("../../../models/admin/auth/adminModel");

exports.changePassword = async (req, res) => {
  try {
    const { adminId, oldPassword, newPassword } = req.body;

    if (!adminId || !oldPassword || !newPassword) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Find admin by ID
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found." });
    }

    // Check old password using the model's matchPassword method
    const isMatch = await admin.matchPassword(oldPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect." });
    }

    // ✅ Just assign plain password — pre-save hook will hash it automatically
    admin.password = newPassword;
    await admin.save();

    return res.status(200).json({ message: "Password changed successfully!" });
  } catch (error) {
    console.error("Change password error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
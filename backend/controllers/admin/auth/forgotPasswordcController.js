const Admin = require('../../../models/admin/auth/adminModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Forgot Password - Sends Reset Link
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: 'Email is required.' });

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: 'Email not found' });

    const token = jwt.sign({ id: admin._id }, JWT_SECRET, { expiresIn: '15m' });
    const resetLink = `${FRONTEND_URL}/admin/auth/resetPassword/${token}`;

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Admin Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Reset your password',
      html: `
        <p>You requested a password reset.</p>
        <p>Click here to reset it: <a href="${resetLink}">${resetLink}</a></p>
        <p>This link will expire in 15 minutes.</p>
      `,
    });

    res.status(200).json({ message: 'Reset link sent to your email.' });
  } catch (error) {
    console.error('Error sending reset link:', error);
    res.status(500).json({ message: 'Error sending reset link.' });
  }
};

// Reset Password - Updates Password in DB
const resetPassword = async (req, res) => {
  const { token, password, confirmPassword } = req.body;

  // Check if passwords match
  if (password !== confirmPassword) {
    return res.status(400).json({ success: false, message: 'Passwords do not match' });
  }

  try {
    // Decode the token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Find the admin based on the decoded ID from token
    const admin = await Admin.findById(decoded.id);

    // If admin not found
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the admin's password
    admin.password = hashedPassword;
    await admin.save();

    res.status(200).json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ success: false, message: 'Token has expired' });
    }
    res.status(500).json({ success: false, message: 'Error resetting password' });
  }
};

module.exports = {
  forgotPassword,
  resetPassword,
};

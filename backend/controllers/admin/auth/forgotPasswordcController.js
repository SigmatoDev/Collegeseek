const Admin = require('../../../models/admin/auth/adminModel');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

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

    return res.status(200).json({ message: 'Reset link sent to your email.' });
  } catch (error) {
    console.error('Error sending reset link:', error);
    return res.status(500).json({ message: 'Error sending reset link.' });
  }
};

const resetPassword = async (req, res) => {
  // ✅ FIX 1: get token from req.params, not req.body
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  if (!password || !confirmPassword) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ success: false, message: 'Passwords do not match.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found.' });
    }

    // ✅ FIX 2: assign plain password — pre-save hook in model handles hashing
    // Do NOT use bcrypt.hash here, the model does it automatically
    admin.password = password;
    await admin.save();

    return res.status(200).json({ success: true, message: 'Password reset successfully.' });
  } catch (error) {
    console.error('Error resetting password:', error);
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ success: false, message: 'Reset link has expired. Please request a new one.' });
    }
    return res.status(500).json({ success: false, message: 'Error resetting password.' });
  }
};

module.exports = { forgotPassword, resetPassword };
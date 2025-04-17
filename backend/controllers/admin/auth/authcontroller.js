const Admin = require('../../../models/admin/auth/adminModel');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id, email) => {
  return jwt.sign({ id, email }, process.env.JWT_SECRET, { expiresIn: '2d' });
};

// Admin Signup
const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ success: false, message: 'Admin already exists' });
    }

    // Create and save admin (password will be hashed in model)
    const newAdmin = new Admin({ name, email, password });
    await newAdmin.save();

    res.status(201).json({
      success: true,
      message: 'Admin created successfully',
      admin: { id: newAdmin._id, name: newAdmin.name, email: newAdmin.email },
      token: generateToken(newAdmin._id, newAdmin.email),
    });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Login Controller
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if admin exists
    const admin = await Admin.findOne({ email }).exec();

    if (!admin) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Debugging: Log the found admin
    console.log("Found Admin:", admin);

    // Check if password matches
    const isMatch = await admin.matchPassword(password);

    // Debugging: Log password match result
    console.log("Password Match:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = generateToken(admin._id, admin.email);

    // Send response with token
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token: token,
      admin: { id: admin._id, name: admin.name, email: admin.email },
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


const getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    res.status(200).json({ success: true, data: admin });
  } catch (error) {
    console.error("Get Admin By ID Error:", error);
    res.status(500).json({ success: false, message: "Failed to retrieve admin." });
  }
};

// Get All Admins
const getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select('-password'); // Exclude passwords from response
    res.status(200).json({ success: true, data: admins });
  } catch (error) {
    console.error('Get Admins Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Delete Admin
const deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    await Admin.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Admin deleted successfully' });
  } catch (error) {
    console.error('Delete Admin Error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete admin' });
  }
};

// Update Admin
const updateAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const updateData = { name, email };

    // Hash new password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const admin = await Admin.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });

    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    res.status(200).json({ success: true, message: 'Admin updated successfully', data: admin });
  } catch (error) {
    console.error('Update Admin Error:', error);
    res.status(500).json({ success: false, message: 'Update failed' });
  }
};

module.exports = { signup, login, getAdmins, deleteAdmin, getAdminById, updateAdmin };

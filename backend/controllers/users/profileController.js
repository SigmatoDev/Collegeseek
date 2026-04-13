const User = require('../../models/users/auth/usersModel');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');
const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
const s3 = require('../../utils/s3');

// ✅ multer-s3 upload configured inside controller
const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_BUCKET_NAME,
    // acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const filename = `profile-images/${req.params.id}-${Date.now()}${ext}`;
      cb(null, filename);
    },
  }),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only JPG, PNG, and WEBP images are allowed'));
  },
});

// ✅ helper to run multer as a promise inside the controller
const runUpload = (req, res) =>
  new Promise((resolve, reject) => {
    upload.single('profileImage')(req, res, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });

// ─────────────────────────────────────────────
const getUserProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.id || !mongoose.Types.ObjectId.isValid(decoded.id)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID in token' });
    }

    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// ─────────────────────────────────────────────
const getUserProfileById = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID' });
    }

    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─────────────────────────────────────────────
const updateProfile = async (req, res) => {
  try {
    // ✅ run multer upload first inside the controller
    await runUpload(req, res);

    const { name, phone, address } = req.body;
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // ✅ delete old S3 image if a new one was uploaded
    if (req.file && user.profileImage) {
      try {
        const oldKey = user.profileImage.split('.com/')[1];
        await s3.send(new DeleteObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: oldKey,
        }));
      } catch (deleteErr) {
        console.warn('Could not delete old image:', deleteErr.message);
      }
    }

    user.name    = name    || user.name;
    user.phone   = phone   || user.phone;
    user.address = address || user.address;

    // ✅ save new S3 URL if image was uploaded
    if (req.file) {
      user.profileImage = req.file.location;
    }

    const updatedUser = await user.save();

    return res.json({
      user: {
        _id:          updatedUser._id,
        name:         updatedUser.name,
        email:        updatedUser.email,
        phone:        updatedUser.phone,
        address:      updatedUser.address,
        profileImage: updatedUser.profileImage,
        createdAt:    updatedUser.createdAt,
      },
    });
  } catch (err) {
    console.error('Update profile error:', err);
    return res.status(500).json({ message: 'Error updating profile', error: err.message });
  }
};

module.exports = { getUserProfile, getUserProfileById, updateProfile };
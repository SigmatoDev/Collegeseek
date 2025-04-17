const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/users/authMiddleware'); // Optional: If you want to use a middleware for authentication
const { getUserProfile, getUserProfileById, updateProfile } = require('../../controllers/users/profileController');

// Secure route to get the user profile
router.get('user/profile', authMiddleware, getUserProfile);
router.get('/get/profiles/by/:userId', getUserProfileById);
router.put('/update/profile/:id', authMiddleware, updateProfile);


module.exports = router;

const express = require('express');
const router = express.Router();

const authenticateUser = require('../../middlewares/users/authMiddleware');
const {
  createShortlistForUser,
  getAllShortlists,
  getUserShortlistById,
  getUserShortlists,
  removeShortlistedCollege,
} = require('../../controllers/users/shortlistController');

// 🔐 Create a shortlist (Requires login)
router.post('/shortlist', authenticateUser, createShortlistForUser);

// 🔓 Get all shortlists (Admin or public route, depends on your use case)
router.get('/shortlist', getAllShortlists);

// 🔓 Get a shortlist by ID
router.get('/get/user/shortlistedClg/by/:id', getUserShortlistById);

// 🔐 Get shortlists of logged-in user
router.get('/user/shortlists', authenticateUser, getUserShortlists);

router.delete('/delete/user/shortlistedClg/:userId/:shortlistId', removeShortlistedCollege);


module.exports = router;

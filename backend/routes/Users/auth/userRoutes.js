const express = require("express");
const {
  signup,
  login,
  getUsers,
  getUserById,
  deleteUser,
  updateUser,
} = require("../../../controllers/users/auth/authcontroller"); // Updated import
const protect = require("../../../middlewares/users/authMiddleware"); // Updated middleware path


const router = express.Router();

// POST route for user signup
router.post("/user/signup", signup);

// POST route for user login
router.post("/user/login", login);

// Protected routes (Require authentication)
router.get("/users", protect, getUsers);
router.get("/user/:id", protect, getUserById);
router.delete("/user/:id", protect, deleteUser);
router.put("/user/:id", protect, updateUser);




// Protected route (User Dashboard)
router.get("/user/dashboard", protect, (req, res) => {
  res.status(200).json({ message: "Welcome to the user dashboard", user: req.user });
});

module.exports = router;

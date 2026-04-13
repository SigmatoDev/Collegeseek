const express = require("express");
const {
  signup,
  login,
  loginWithGoogle,
  getUsers,
  getUserById,
  deleteUser,
  updateUser,
} = require("../../../controllers/users/auth/authcontroller"); // Updated import
const protect = require("../../../middlewares/users/authMiddleware"); // Updated middleware path
const { changePassword } = require("../../../controllers/users/auth/changePasswordController");


const router = express.Router();

// POST route for user signup
// authRoutes.js
router.post("/user/signup", signup);
router.post("/user/login", login);
router.post("/user/login/google", loginWithGoogle);

router.get("/get/users", getUsers);
router.get("/id/user/:id", getUserById);
router.delete("/user/:id", deleteUser);

// ✅ Specific route BEFORE dynamic :id route
router.put("/user/change-password", protect, changePassword);
router.put("/user/:id", protect, updateUser);  // ✅ Dynamic route AFTER




// Protected route (User Dashboard)
router.get("/user/dashboard", protect, (req, res) => {
  res.status(200).json({ message: "Welcome to the user dashboard", user: req.user });
});

module.exports = router;

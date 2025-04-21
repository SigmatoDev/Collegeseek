// routes/users/auth/usersRoutes.js
const express = require("express");
const router = express.Router();

const protect = require("../../../middlewares/users/authMiddleware");
const {
  forgotPassword,
  resetPassword,
} = require("../../../controllers/users/auth/forgotPasswordController");

const {
  changePassword,
} = require("../../../controllers/users/auth/changePasswordController");

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/user/change-password", protect, changePassword);

module.exports = router;

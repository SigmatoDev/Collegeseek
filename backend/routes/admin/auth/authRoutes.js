const express = require('express');
const { signup, login, getAdmins, getAdminById, deleteAdmin, updateAdmin, } = require('../../../controllers/admin/auth/authcontroller');
const {  changeAdminPassword } = require('../../../controllers/admin/auth/changePasswordController');
const protect = require('../../../middlewares/admin/authMiddleware'); // FIXED import

const router = express.Router();

// POST route for admin signup
router.post('/admin/signup', signup);

// POST route for admin login
router.post('/admin/login', login);

router.get("/admin", protect, getAdmins);
router.get("/admin/:id", protect, getAdminById); // ✅ Added this route
router.delete("/admin/:id", protect, deleteAdmin);
router.put("/admin/:id", protect, updateAdmin);
router.post("/change-password", changeAdminPassword);


// Protected route (Admin dashboard)
router.get('/admin/dashboard', protect, (req, res) => {
  res.status(200).json({ message: 'Welcome to the admin dashboard', admin: req.admin });
});

module.exports = router;
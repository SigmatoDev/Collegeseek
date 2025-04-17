const express = require('express');
const { resetPassword, forgotPassword } = require('../../../controllers/admin/auth/forgotPasswordcController');
const router = express.Router();



router.post('/admin/forgot-password', forgotPassword);
router.post('/admin/reset-password/:token', resetPassword);

module.exports = router;

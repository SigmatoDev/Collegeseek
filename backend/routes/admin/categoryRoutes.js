const express = require('express');
const { getCategoryData } = require('../../controllers/admin/categoryController');
const router = express.Router();

router.get('/categories', getCategoryData);

module.exports = router;

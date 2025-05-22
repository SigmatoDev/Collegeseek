const express = require('express');
const { getAlltrendingNow, createtrendingNow, updateTrendingNow, deleteTrendingNow, gettrendingNowById } = require('../../controllers/admin/trendingNowController');


const router = express.Router();

// GET all exams
router.get('/get/trendingNow', getAlltrendingNow);

// POST create exam
router.post('/create/trendingNow', createtrendingNow);

// PUT update exam by ID
router.put('/update/trendingNow/:id', updateTrendingNow);

// DELETE delete exam by ID
router.delete('/d/trendingNow/:id', deleteTrendingNow);

router.get('/id/trendingNow/:id', gettrendingNowById);

module.exports = router;

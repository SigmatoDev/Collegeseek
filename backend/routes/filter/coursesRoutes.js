const express = require('express');
const { getCoursesByStreamId } = require('../../controllers/filter/coursesFilter');
const router = express.Router();

router.get('/courses/by-stream/:streamId', getCoursesByStreamId);

module.exports = router;

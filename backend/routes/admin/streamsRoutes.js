const express = require('express');
const { createStream, getStreams, getStreamById, updateStream, deleteStream } = require('../../controllers/admin/streamsController');
const router = express.Router();


// Routes for Stream
router.post('/create/streams/', createStream);         // Create new stream
router.get('/get/streams/', getStreams);            // Get all streams
router.get('/id/streams/:id', getStreamById);      // Get a single stream by ID
router.put('/update/streams/:id', updateStream);       // Update a stream by ID
router.delete('/d/streams/:id', deleteStream);    // Delete a stream by ID

module.exports = router;

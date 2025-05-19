// const express = require('express');
// const { createStream, getStreams, getStreamById, updateStream, deleteStream } = require('../../controllers/admin/streamsController');
// const router = express.Router();


// // Routes for Stream
// router.post('/create/streams/', createStream);         // Create new stream
// router.get('/get/streams/', getStreams);            // Get all streams
// router.get('/id/streams/:id', getStreamById);      // Get a single stream by ID
// router.put('/update/streams/:id', updateStream);       // Update a stream by ID
// router.delete('/d/streams/:id', deleteStream);    // Delete a stream by ID

// module.exports = router;
const express = require('express');
const {
  createStream,
  getStreams,
  getStreamById,
  updateStream,
  deleteStream
} = require('../../controllers/admin/streamsController');

const router = express.Router();
const multer = require('multer');

// ✅ Include the multer config you already created
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPG, PNG, and WEBP are allowed."), false);
    }
  },
});

// ✅ Use `upload.single("image")` for POST and PUT
router.post('/create/streams/', upload.single("image"), createStream);
router.get('/get/streams/', getStreams);            // Get all streams
router.get('/id/streams/:id', getStreamById);      // Get a single stream by ID
router.put('/update/streams/:id', upload.single("image"), updateStream);
router.delete('/d/streams/:id', deleteStream);    // Delete a stream by ID

module.exports = router;

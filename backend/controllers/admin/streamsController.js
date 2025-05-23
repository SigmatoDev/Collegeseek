const Stream = require('../../models/admin/streams');

// Create a new stream
// createStream
const createStream = async (req, res) => {
  try {
    const { name } = req.body;
    const image = req.file ? req.file.path : null;

    if (!name) return res.status(400).json({ message: 'Stream name is required' });

    const existingStream = await Stream.findOne({ name });
    if (existingStream) {
      return res.status(400).json({ message: 'Stream with this name already exists' });
    }

    const stream = new Stream({ name, image });
    await stream.save();
    res.status(201).json(stream);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Get all streams
const getStreams = async (req, res) => {
  try {
    const streams = await Stream.find();
    res.status(200).json(streams);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Get a stream by ID
const getStreamById = async (req, res) => {
  try {
    const stream = await Stream.findById(req.params.id);
    if (!stream) return res.status(404).json({ message: 'Stream not found' });

    res.status(200).json(stream);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Update a stream

// updateStream
const updateStream = async (req, res) => {
  try {
    const { name } = req.body;
    const streamId = req.params.id;
    const image = req.file ? req.file.path : null;

    if (!name) return res.status(400).json({ message: 'Stream name is required' });

    const existingStream = await Stream.findOne({ name, _id: { $ne: streamId } });
    if (existingStream) {
      return res.status(400).json({ message: 'Stream with this name already exists' });
    }

    const updateData = { name };
    if (image) updateData.image = image;

    const stream = await Stream.findByIdAndUpdate(streamId, updateData, { new: true });
    if (!stream) return res.status(404).json({ message: 'Stream not found' });

    res.status(200).json(stream);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Delete a stream
const deleteStream = async (req, res) => {
  try {
    const stream = await Stream.findByIdAndDelete(req.params.id);
    if (!stream) return res.status(404).json({ message: 'Stream not found' });

    res.status(200).json({ message: 'Stream deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Export all controllers
module.exports = {
  createStream,
  getStreams,
  getStreamById,
  updateStream,
  deleteStream
};

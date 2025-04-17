const Callback = require("../../models/admin/newsLetter");

// Submit callback request
const submitCallback = async (req, res) => {
  try {
    const { name, mobile, email, stream } = req.body;

    if (!name || !mobile || !email || !stream) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newCallback = new Callback({ name, mobile, email, stream });
    await newCallback.save();

    res.status(201).json({ message: "Callback request submitted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all callback requests (for admin)
const getCallbacks = async (req, res) => {
  try {
    const callbacks = await Callback.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: callbacks, // Always return a consistent format
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Delete callback request
const deleteCallback = async (req, res) => {
  try {
    const { id } = req.params;
    
    const callback = await Callback.findByIdAndDelete(id);
    if (!callback) {
      return res.status(404).json({ success: false, message: "Callback request not found" });
    }

    res.status(200).json({ success: true, message: "Callback request deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports = { submitCallback, getCallbacks , deleteCallback};

// controllers/examController.js
const Exam = require('../../models/admin/trendingNow');

// Get all exams
exports.getAlltrendingNow = async (req, res) => {
  try {
    const exams = await Exam.find().sort({ name: 1 }); // sorted alphabetically
    res.status(200).json(exams);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching exams', error });
  }
};

// Add a new exam
exports.createtrendingNow = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Exam name is required' });
    }

    const existingExam = await Exam.findOne({ name });
    if (existingExam) {
      return res.status(400).json({ message: 'Exam already exists' });
    }

    const exam = new Exam({ name });
    await exam.save();

    res.status(201).json(exam);
  } catch (error) {
    res.status(500).json({ message: 'Server error creating exam', error });
  }
};

// Update exam by ID
exports.updateTrendingNow = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Exam name is required' });
    }

    const existingExam = await Exam.findOne({ name, _id: { $ne: id } });
    if (existingExam) {
      return res.status(400).json({ message: 'Another exam with this name already exists' });
    }

    const updatedExam = await Exam.findByIdAndUpdate(id, { name }, { new: true });

    if (!updatedExam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    res.status(200).json(updatedExam);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating exam', error });
  }
};

// Delete exam by ID
exports.deleteTrendingNow = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedExam = await Exam.findByIdAndDelete(id);

    if (!deletedExam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    res.status(200).json({ message: 'Exam deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting exam', error });
  }
};

exports.gettrendingNowById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).json({ message: "Exam not found" });
    res.status(200).json(exam);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
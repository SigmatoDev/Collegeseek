const ExamsAccepted = require('../../models/admin/examExpected');

// Create a new exam
const createExam = async (req, res) => {
  try {
    const { name, code } = req.body;
    const image = req.file ? `uploads/${req.file.filename}` : null;

    if (!name || !code) {
      return res.status(400).json({ message: 'Name and code are required' });
    }

    // Check if exam with same name or code already exists
    const existingExam = await ExamsAccepted.findOne({ 
      $or: [{ name }, { code }]
    });

    if (existingExam) {
      return res.status(409).json({ message: 'Exam with the same name or code already exists' });
    }

    const exam = new ExamsAccepted({ name, code, image });
    await exam.save();

    res.status(201).json({ message: 'Exam created successfully', exam });
  } catch (error) {
    res.status(500).json({ message: 'Error creating exam', error });
  }
};



// Get all exams
const getAllExams = async (req, res) => {
  try {
    const exams = await ExamsAccepted.find();
    res.status(200).json(exams);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching exams', error });
  }
};

// Get single exam by ID
const getExamById = async (req, res) => {
  try {
    const exam = await ExamsAccepted.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    res.status(200).json(exam);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching exam', error });
  }
};

// Update exam by ID
const updateExam = async (req, res) => {
  try {
    const { name, code } = req.body;
    const image = req.file ? `uploads/${req.file.filename}` : null;
    const examId = req.params.id;

    // Check if another exam with the same name or code exists (exclude the current exam)
    const existingExam = await ExamsAccepted.findOne({
      _id: { $ne: examId },
      $or: [{ name }, { code }],
    });

    if (existingExam) {
      return res.status(409).json({ message: 'Another exam with the same name or code already exists' });
    }

    // Prepare update object conditionally including image
    const updateData = { name, code };
    if (image !== undefined) updateData.image = image;

    const exam = await ExamsAccepted.findByIdAndUpdate(
      examId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    res.status(200).json({ message: 'Exam updated successfully', exam });
  } catch (error) {
    res.status(500).json({ message: 'Error updating exam', error });
  }
};

// Delete exam by ID
const deleteExam = async (req, res) => {
  try {
    const exam = await ExamsAccepted.findByIdAndDelete(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    res.status(200).json({ message: 'Exam deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting exam', error });
  }
};

module.exports = {
  createExam,
  getAllExams,
  getExamById,
  updateExam,
  deleteExam
};

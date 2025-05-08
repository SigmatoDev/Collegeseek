const ProgramMode = require('../../models/admin/programMode');

const createProgramMode = async (req, res) => {
  try {
    const { name } = req.body;
    const newProgramMode = new ProgramMode({ name });
    await newProgramMode.save();
    res.status(201).json(newProgramMode);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create program mode', error });
  }
};

const getAllProgramModes = async (req, res) => {
  try {
    const modes = await ProgramMode.find();
    res.status(200).json(modes);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch program modes', error });
  }
};

const getProgramModeById = async (req, res) => {
  try {
    const mode = await ProgramMode.findById(req.params.id);
    if (!mode) {
      return res.status(404).json({ message: 'Program mode not found' });
    }
    res.status(200).json(mode);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch program mode', error });
  }
};

const updateProgramMode = async (req, res) => {
  try {
    const { name } = req.body;
    const updatedMode = await ProgramMode.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );
    if (!updatedMode) {
      return res.status(404).json({ message: 'Program mode not found' });
    }
    res.status(200).json(updatedMode);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update program mode', error });
  }
};

const deleteProgramMode = async (req, res) => {
  try {
    const deleted = await ProgramMode.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Program mode not found' });
    }
    res.status(200).json({ message: 'Program mode deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete program mode', error });
  }
};

const programModeController = {
  createProgramMode,
  getAllProgramModes,
  getProgramModeById,
  updateProgramMode,
  deleteProgramMode,
};

module.exports = programModeController;

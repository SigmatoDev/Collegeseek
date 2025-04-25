// controllers/admin/moduleController.js

const Module = require("../../models/admin/Module");

// Create a new module
const createModule = async (req, res) => {
  try {
    const { title, type, content } = req.body;

    const newModule = new Module({
      title,
      type,
      content,
    });

    await newModule.save();
    res.status(201).json(newModule);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create module" });
  }
};

// Get all modules
const getModules = async (req, res) => {
  try {
    const modules = await Module.find();
    res.status(200).json(modules);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch modules" });
  }
};

module.exports = {
  createModule,
  getModules,
};

// controllers/admin/pageController.js

const Page = require("../../models/admin/Page");
const Module = require("../../models/admin/Module");

// Create a new page
const createPage = async (req, res) => {
  console.log("Creating a new page");
  try {
    const { title, description, modules } = req.body;

    const newPage = new Page({
      title,
      description,
      modules,
    });

    await newPage.save();
    res.status(201).json(newPage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create page" });
  }
};

// Get all pages
const getPages = async (req, res) => {
  try {
    const pages = await Page.find().populate("modules.moduleId"); // Populate module data
    res.status(200).json(pages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch pages" });
  }
};

module.exports = {
  createPage,
  getPages,
};

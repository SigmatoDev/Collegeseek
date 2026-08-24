const ExamMenu = require("../../models/admin/examMenuModel");

// Controller to GET all exam menus
exports.getExamMenus = async (req, res) => {
  try {
    let menus = await ExamMenu.find().populate('columns.links');
    if (menus.length === 0) {
      const defaultMenu = await ExamMenu.create({ name: "Exam Menu", columns: [] });
      menus = [defaultMenu];
    }
    res.status(200).json({ success: true, data: menus });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Controller for updating column title
exports.updateExamColumnTitle = async (req, res) => {
  const { menuId, columnId } = req.params;
  const { title } = req.body;

  try {
    const updatedMenu = await ExamMenu.findOneAndUpdate(
      { _id: menuId, "columns._id": columnId },
      { $set: { "columns.$.title": title } },
      { new: true, runValidators: true }
    );

    if (!updatedMenu) return res.status(404).json({ success: false, message: "Exam menu or column not found" });

    res.status(200).json({ success: true, data: updatedMenu });
  } catch (error) {
    console.error("Error in updateExamColumnTitle:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Controller for updating link label and URL
exports.updateExamLink = async (req, res) => {
  try {
    const { menuId, columnId, linkId } = req.params;
    const { label, url } = req.body;

    const result = await ExamMenu.updateOne(
      {
        _id: menuId,
        "columns._id": columnId,
        "columns.links._id": linkId,
      },
      {
        $set: {
          "columns.$[col].links.$[lnk].label": label,
          "columns.$[col].links.$[lnk].url": url,
        },
      },
      {
        arrayFilters: [
          { "col._id": columnId },
          { "lnk._id": linkId },
        ],
        runValidators: true,
      }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ success: false, message: "Exam menu, column, or link not found or not modified." });
    }

    const updatedMenu = await ExamMenu.findById(menuId);

    res.status(200).json({ success: true, data: updatedMenu });
  } catch (error) {
    console.error("Error in updateExamLink:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add a new link to a specific column in an exam menu
exports.createExamLink = async (req, res) => {
  try {
    const { menuId, columnId } = req.params;
    const { label, url } = req.body;

    const result = await ExamMenu.updateOne(
      {
        _id: menuId,
        "columns._id": columnId
      },
      {
        $push: {
          "columns.$[col].links": { label, url }
        }
      },
      {
        arrayFilters: [
          { "col._id": columnId }
        ],
        runValidators: true
      }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ success: false, message: "Exam menu or column not found." });
    }

    const updatedMenu = await ExamMenu.findById(menuId);

    res.status(200).json({ success: true, data: updatedMenu });
  } catch (error) {
    console.error("Error in createExamLink:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Reorder exam menu columns/links
exports.reorderExamMenu = async (req, res) => {
  const { menuId } = req.params;
  const { updatedColumns } = req.body;

  try {
    const updatedMenu = await ExamMenu.findByIdAndUpdate(
      menuId,
      { columns: updatedColumns },
      { new: true, runValidators: true }
    );

    if (!updatedMenu) {
      return res.status(404).json({ message: 'Exam menu not found' });
    }

    res.json(updatedMenu);
  } catch (error) {
    console.error('Error reordering exam menu:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Remove a link from an exam menu column
exports.removeExamLink = async (req, res) => {
  const { menuId, columnId, linkId } = req.params;

  try {
    const result = await ExamMenu.updateOne(
      {
        _id: menuId,
        "columns._id": columnId
      },
      {
        $pull: {
          "columns.$[col].links": { _id: linkId }
        }
      },
      {
        arrayFilters: [
          { "col._id": columnId }
        ],
        runValidators: true
      }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ success: false, message: "Exam menu, column, or link not found." });
    }

    const updatedMenu = await ExamMenu.findById(menuId);

    res.status(200).json({ success: true, data: updatedMenu });
  } catch (error) {
    console.error("Error in removeExamLink:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add a new column to an exam menu
exports.createExamColumn = async (req, res) => {
  const { menuId } = req.params;
  const { title } = req.body;

  try {
    const updatedMenu = await ExamMenu.findByIdAndUpdate(
      menuId,
      { $push: { columns: { title, links: [] } } },
      { new: true, runValidators: true }
    );

    if (!updatedMenu) {
      return res.status(404).json({ success: false, message: "Exam menu not found." });
    }

    res.status(200).json({ success: true, data: updatedMenu });
  } catch (error) {
    console.error("Error in createExamColumn:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a column from an exam menu
exports.deleteExamColumn = async (req, res) => {
  const { menuId, columnId } = req.params;

  try {
    const updatedMenu = await ExamMenu.findByIdAndUpdate(
      menuId,
      { $pull: { columns: { _id: columnId } } },
      { new: true }
    );

    if (!updatedMenu) {
      return res.status(404).json({ success: false, message: "Exam menu not found." });
    }

    res.status(200).json({ success: true, data: updatedMenu });
  } catch (error) {
    console.error("Error in deleteExamColumn:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


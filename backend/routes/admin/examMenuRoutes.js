const express = require('express');
const router = express.Router();

const {
  getExamMenus,
  updateExamColumnTitle,
  updateExamLink,
  createExamLink,
  reorderExamMenu,
  removeExamLink,
  createExamColumn,
  deleteExamColumn
} = require("../../controllers/admin/examMenuController");

// Route to GET all exam menus
router.get('/exam-menus', getExamMenus);

// Update column title
router.put('/exam-menus/:menuId/column/:columnId', updateExamColumnTitle);

// Update link label and URL
router.put('/exam-menus/:menuId/column/:columnId/link/:linkId', updateExamLink);

// Add a new link to a column
router.post('/exam-menus/:menuId/columns/:columnId/links', createExamLink);

// Reorder menu columns/links
router.put('/exam-menus/:menuId/reorder', reorderExamMenu);

// Delete a link from a column
router.delete('/exam-menu/:menuId/column/:columnId/link/:linkId', removeExamLink);

// Create a new column
router.post('/exam-menus/:menuId/columns', createExamColumn);

// Delete a column
router.delete('/exam-menus/:menuId/column/:columnId', deleteExamColumn);

module.exports = router;


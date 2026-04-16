// // routes/menuRoutes.js
// const express = require("express");
// const router = express.Router();
// const {
//   getMenu,
//   updateMenu,
//   deleteLink,
//   getMenuById,
//   addLink,
// } = require("../../controllers/admin/menuController");

// router.get("/menu/:menuId", getMenu);
// router.get("/menu/:menuId", getMenuById);
// router.put("/menu/:menuId", updateMenu);
// router.post("/menu/:menuId/column/:columnId/link", addLink);
// router.delete("/menu/:menuId/column/:columnId/link/:linkId", deleteLink);

// module.exports = router;

const express = require('express');
const router = express.Router();

// Importing the controller functions
const { getMenus, updateColumnTitle, updateLink, createLink, reorderMenu, removeLink, createColumn, deleteColumn } = require("../../controllers/admin/menuController");

// Route to GET all menus
router.get('/menus', getMenus);

// Update column title
router.put('/menus/:menuId/column/:columnId', updateColumnTitle);

// Update link label and URL
router.put('/menus/:menuId/column/:columnId/link/:linkId', updateLink);

router.post('/menus/:menuId/columns/:columnId/links', createLink);

router.put('/menus/:menuId/reorder', reorderMenu);

router.delete('/menu/:menuId/column/:columnId/link/:linkId', removeLink);

router.post('/menus/:menuId/columns', createColumn);
router.delete('/menus/:menuId/column/:columnId', deleteColumn);



module.exports = router;

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
const { getMenus, updateColumnTitle, updateLink } = require("../../controllers/admin/menuController");

// Route to GET all menus
router.get('/menus', getMenus);

// Update column title
router.put('/menus/:menuId/column/:columnId', updateColumnTitle);

// Update link label and URL
router.put('/menus/:menuId/column/:columnId/link/:linkId', updateLink);



module.exports = router;

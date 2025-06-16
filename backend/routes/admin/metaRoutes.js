// routes/meta.routes.js
const express = require("express");
const { upsertMeta, getMetaByPage, getMeta, updateMeta } = require("../../controllers/admin/metaController");
const router = express.Router();

// Create or update meta
router.post("/meta", upsertMeta);

// Get meta by page name
router.get("/get/meta", getMeta);
router.post("/update/meta", updateMeta); // or use PUT


module.exports = router;

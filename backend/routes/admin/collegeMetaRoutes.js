// routes/meta.routes.js
const express = require("express");
const { getMetaByPage, createMeta, updateMeta } = require("../../controllers/admin/collegeMetaControlller");
const router = express.Router();

router.get("/get/meta/:page",  getMetaByPage);
router.post("/", createMeta);
router.put("/update/meta:page", updateMeta);

module.exports = router;

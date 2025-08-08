// routes/meta.routes.js
const express = require("express");
const { upsertMeta, getMeta, updateMeta } = require("../../controllers/admin/homeMetaController");
const { getMetaByPage, aboutUpdateMeta } = require("../../controllers/admin/adoutMetaController");
const { getMetaByContactPage, contactUpdateMeta } = require("../../controllers/admin/contactMetacontroller");
const router = express.Router();

// Create or update meta
router.post("/meta", upsertMeta);

// Get meta by page name
router.get("/get/meta", getMeta);
router.post("/update/meta", updateMeta); // or use PUT
router.get("/aboutget/meta", getMetaByPage);
router.post("/aboutupdate/meta", aboutUpdateMeta); // or use PUT
router.get("/Contactget/meta", getMetaByContactPage);
router.post("/Contactupdate/meta", contactUpdateMeta); // or use PUT



module.exports = router;

const express = require("express");
const { submitCallback, getCallbacks , deleteCallback } = require("../../controllers/admin/newsLetterController");

const router = express.Router();

// Route to submit callback request
router.post("/callback", submitCallback);

// Route to get all callback requests (for admin use)
router.get("/callbacks", getCallbacks);

router.delete("/callbacks/:id", deleteCallback); // ✅ Add this


module.exports = router;

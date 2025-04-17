const express = require("express");
const {
  submitCounsellingRequest,
  getAllCounsellingRequests,
  getCounsellingRequestById,
  editCounsellingRequest,
  deleteCounsellingRequest,
} = require("../../controllers/users/counsellingController");

const router = express.Router();

// Route to submit counselling request
router.post("/counselling", submitCounsellingRequest);

// Route to get all counselling requests
router.get("/counselling", getAllCounsellingRequests);

// Route to get counselling request by ID
router.get("/counselling/:id", getCounsellingRequestById);

// Route to edit counselling request by ID
router.put("/counselling/:id", editCounsellingRequest);

// Route to delete counselling request by ID
router.delete("/counselling/:id", deleteCounsellingRequest);

module.exports = router;

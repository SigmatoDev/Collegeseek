// routes/enrollmentRoutes.js

const express = require("express");
const router = express.Router();
const { createEnrollment ,getAllEnrollments , getEnrollmentById ,  deleteEnrollment , updateEnrollment} = require("../../controllers/users/enrollmentController");

// POST route for creating an enrollment
router.post("/enroll", createEnrollment);
router.get("/enrollments", getAllEnrollments);

// GET route to fetch a single enrollment by ID
router.get("/enrollments/:id", getEnrollmentById);

// DELETE route to delete an enrollment by ID
router.delete("/enrollments/:id", deleteEnrollment);

router.put('/enrollments/:id', updateEnrollment);


module.exports = router;

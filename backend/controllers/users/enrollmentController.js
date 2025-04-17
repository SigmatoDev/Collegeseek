const Enrollment = require("../../models/users/enrollmentModel");

// Function to handle form submission (Create)
const createEnrollment = async (req, res) => {
  const { name, email, phone, course, message } = req.body;

  // Validation (could be expanded further)
  if (!name || !email || !phone || !course) {
    return res.status(400).json({ message: "All fields except message are required" });
  }

  try {
    // Create a new enrollment
    const newEnrollment = new Enrollment({
      name,
      email,
      phone,
      course,
      message,
    });

    // Save the enrollment in the database
    await newEnrollment.save();

    return res.status(201).json({
      message: "Enrollment successful",
      enrollment: newEnrollment,
    });
  } catch (error) {
    console.error("Error creating enrollment:", error);
    return res.status(500).json({ message: "An error occurred while processing your enrollment" });
  }
};

// Function to get all enrollments
const getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find(); // Fetch all enrollments
    return res.status(200).json({ enrollments });
  } catch (error) {
    console.error("Error fetching enrollments:", error);
    return res.status(500).json({ message: "An error occurred while fetching enrollments" });
  }
};

// Function to get a single enrollment by ID
const getEnrollmentById = async (req, res) => {
  const { id } = req.params; // Get the ID from the URL parameter

  try {
    const enrollment = await Enrollment.findById(id); // Find the enrollment by ID
    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }
    return res.status(200).json({ enrollment });
  } catch (error) {
    console.error("Error fetching enrollment by ID:", error);
    return res.status(500).json({ message: "An error occurred while fetching the enrollment" });
  }
};

// Controller to update an enrollment by ID
const updateEnrollment = async (req, res) => {
  try {
    const enrollmentId = req.params.id;
    const { name, email, phone, course, message } = req.body;

    const updatedEnrollment = await Enrollment.findByIdAndUpdate(
      enrollmentId,
      { name, email, phone, course, message },
      { new: true }
    );

    if (!updatedEnrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    res.status(200).json({ enrollment: updatedEnrollment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Function to delete an enrollment by ID
const deleteEnrollment = async (req, res) => {
  const { id } = req.params; // Get the ID from the URL parameter

  try {
    const enrollment = await Enrollment.findByIdAndDelete(id); // Delete the enrollment by ID
    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }
    return res.status(200).json({ message: "Enrollment deleted successfully" });
  } catch (error) {
    console.error("Error deleting enrollment:", error);
    return res.status(500).json({ message: "An error occurred while deleting the enrollment" });
  }
};

// Exporting the controller functions
module.exports = {
  createEnrollment,
  getAllEnrollments,
  getEnrollmentById,
  updateEnrollment,
  deleteEnrollment,
};

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(
  cors({
    origin: process.env.CLIENT_URL, // or '*' if public
    credentials: true,
  })
);
app.use(express.json());

// Ensure Uploads Folder Exists
const uploadDir = path.join(__dirname, "./uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Serve Static Files (for uploaded images)
app.use("/uploads", express.static("uploads"));
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));



//new for pages
// Allow larger JSON payloads up to 50MB (for base64 encoded data, etc.)
app.use(express.json({ limit: "50mb" })); 
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// Connect to MongoDB
connectDB();

// Routes
app.use("/api", require("./routes/admin/auth/authRoutes"));
app.use("/api", require("./routes/Users/auth/userRoutes"));
app.use("/api", require("./routes/admin/collegeRoutes"));
app.use("/api", require("./routes/admin/coursesRoutes"));
app.use("/api", require("./routes/admin/blogRoutes"));
app.use("/api", require("./routes/admin/settingsRoutes"));
app.use("/api", require("./routes/admin/documentRoutes"));
app.use("/api", require("./routes/admin/courseListRoutes"));
app.use("/api", require("./routes/admin/searchRoutes"));
app.use("/api", require("./routes/admin/menuRoutes"));
app.use("/api", require("./routes/Users/counsellingRoutes"));
app.use("/api", require("./routes/admin/newsLetterRoutes"));
app.use("/api", require("./routes/admin/filterRoutes"));
app.use("/api", require("./routes/Users/enrollmentRoutes"));
app.use("/api", require("./routes/Users/auth/forgotPasswordRoutes"));
app.use("/api", require("./routes/Users/shortlistRoutes"));
app.use("/api", require("./routes/admin/auth/forgotPasswordRoutes"));
app.use("/api", require("./routes/Users/profileRoutes"));
app.use("/api", require("./routes/Users/contactUsRountes"));
app.use("/api", require("./routes/admin/dashboardRoutes"));
app.use("/api", require("./routes/admin/termsAndConditionsRoutes"));
app.use("/api", require("./routes/admin/privacyPolicyRoutes"));
app.use("/api", require("./routes/admin/importCollegeRoute"));
app.use("/api", require("./routes/admin/moduleRoutes"));
app.use("/api", require("./routes/admin/pageRoutes"));
app.use("/api", require("./routes/admin/approvelsRoutes"));
app.use("/api", require("./routes/admin/affiliatedByRoutes"));
app.use("/api", require("./routes/admin/examExpectedRoutes"));
app.use("/api", require("./routes/admin/ownershipRoutes"));
app.use("/api", require("./routes/admin/streamsRoutes"));
app.use("/api", require("./routes/admin/programModeRoutes"));
app.use("/api", require("./routes/admin/ads1Routes"));
app.use("/api", require("./routes/admin/ads2Routes"));
app.use("/api", require("./routes/admin/ads3Routes"));
app.use("/api", require("./routes/admin/ads4Routes"));

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

const express = require("express");
const multer = require("multer");
const mongoose = require('mongoose'); // Add this import statement
const fs = require("fs");
const path = require("path");
const College = require("../../models/admin/collegemodel");
const Upload = require("../../models/admin/documentModel");

const router = express.Router();

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, "../../public/uploads/documents/");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File Filter to Allow Only Documents
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only PDF, DOC, DOCX, and TXT are allowed."), false);
  }
};

// Upload Middleware
const upload = multer({ storage, fileFilter });

// @desc Get all uploaded files
// @route GET /api/uploads/documents
// @access Public
const getUploadFiles = async (req, res) => {
  try {
    const files = await Upload.find().populate("college_id", "name");
    res.status(200).json(files);
  } catch (error) {
    console.error("Error fetching uploaded files:", error);
    res.status(500).json({ message: "Failed to fetch uploaded files" });
  }
};

// @desc Get single uploaded file by ID
// @route GET /api/uploads/documents/:id
// @access Public


const getUploadFileById = async (req, res) => {
  const { id } = req.params;

  try {
    const file = await Upload.findById(id);  // Fetch file details from DB
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // Ensure only the relative file path (uploads/documents/filename.pdf) is used (without the leading slash)
    const filePath = path.join(__dirname, "..", "..", "public", file.filePath); 
    console.log("Serving file from:", filePath);  // Debugging log

    // Check if the file exists before serving it
    try {
      await fs.promises.access(filePath, fs.constants.F_OK);  // Check if file exists
      console.log("File exists, starting download...");
      res.download(filePath, file.fileName);  // Serve the file
    } catch (err) {
      console.error("File not found:", err);
      return res.status(404).json({ message: "File not found" });
    }
  } catch (error) {
    console.error("Error fetching file:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @desc Upload a new file
// @route POST /api/uploads/documents
// @access Public
const createUploadFile = async (req, res) => {
  upload.single("file")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    if (!req.file || !req.body.college_id) {
      return res.status(400).json({ message: "File and College ID are required" });
    }

    try {
      const { college_id } = req.body;

      // Validate college existence
      const college = await College.findById(college_id);
      if (!college) return res.status(404).json({ message: "College not found" });

      // Save file details in DB
      const newUpload = new Upload({
        fileName: req.file.filename,
        filePath: `/uploads/documents/${req.file.filename}`,
        college_id: college_id,
      });

      await newUpload.save();

      res.status(201).json({
        message: "File uploaded successfully",
        upload: newUpload,
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({ message: "File upload failed" });
    }
  });
};

// @desc Update file details (not the file itself)
// @route PUT /api/uploads/documents/:id
// @access Public
const updateUploadFile = async (req, res) => {
  try {
    const { college_id } = req.body;

    // Validate college existence if updating college_id
    if (college_id) {
      const college = await College.findById(college_id);
      if (!college) return res.status(404).json({ message: "College not found" });
    }

    const updatedFile = await Upload.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updatedFile) return res.status(404).json({ message: "File not found" });

    res.status(200).json(updatedFile);
  } catch (error) {
    console.error("Error updating file:", error);
    res.status(500).json({ message: "Failed to update file" });
  }
};

// @desc Delete an uploaded file
// @route DELETE /api/uploads/documents/:id
// @access Public
// @desc Delete an uploaded file
// @route DELETE /api/uploads/:id
// @access Public
const deleteUploadFile = async (req, res) => {
  try {
    const file = await Upload.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // Check if filePath is available
    if (!file.filePath || typeof file.filePath !== "string") {
      return res.status(400).json({ message: "File path is missing or invalid" });
    }

    const fullPath = path.join(__dirname, "..", file.filePath);

    // Check if file exists before deleting
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      console.log(`Deleted file from disk: ${fullPath}`);
    } else {
      console.warn(`File not found on disk: ${fullPath}`);
    }

    // Remove from database
    await Upload.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({ message: "Failed to delete file" });
  }
};




module.exports = {
  getUploadFiles,
  getUploadFileById,
  createUploadFile,
  updateUploadFile,
  deleteUploadFile,
};

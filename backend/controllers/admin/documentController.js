const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const College = require("../../models/admin/collegemodel");
const Upload = require("../../models/admin/documentModel");
const compressPdf = require("../../utils/compressPdf");

const router = express.Router();

/* =====================================================
   1️⃣ DEFINE UPLOAD ROOT
===================================================== */
const UPLOAD_ROOT = path.join(__dirname, "../../uploads/documents");

// Ensure the folder exists
if (!fs.existsSync(UPLOAD_ROOT)) {
  console.log("📁 Upload folder missing. Creating:", UPLOAD_ROOT);
  fs.mkdirSync(UPLOAD_ROOT, { recursive: true });
}

/* =====================================================
   2️⃣ MULTER CONFIGURATION
===================================================== */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_ROOT),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
  ];
  if (allowedTypes.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Invalid file type. Only PDF, DOC, DOCX, TXT allowed"), false);
};

// Increase file size limit safely to 50MB
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 },
});
/* =====================================================
   ✅ 3. GET ALL FILES (PAGINATED)
===================================================== */

const getUploadFiles = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Upload.countDocuments();

    const files = await Upload.find()
      .populate("college_id", "name")
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      total,
      page,
      totalPages: Math.ceil(total / limit),
      files,
    });
  } catch (error) {
    console.error("Error fetching uploaded files:", error);
    res.status(500).json({ message: "Failed to fetch uploaded files" });
  }
};

/* =====================================================
   ✅ 4. GET FILE BY ID
===================================================== */

const getUploadFileById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid file ID" });
    }

    const file = await Upload.findById(id).lean();

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    res.status(200).json({ success: true, data: file });
  } catch (error) {
    console.error("Error fetching file:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* =====================================================
   ✅ 5. CREATE FILE (UPLOAD + PDF COMPRESSION)
===================================================== */

const createUploadFile = async (req, res) => {
  upload.single("file")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.code === "LIMIT_FILE_SIZE" ? "Max upload size is 50MB" : err.message });
    }

    if (!req.file || !req.body.college_id) {
      return res.status(400).json({ message: "File and College ID are required" });
    }

    try {
      let finalName = req.file.filename;
      let finalPath = req.file.path;

      // Always compress PDFs
      if (req.file.mimetype === "application/pdf") {
        try {
          const compressedPath = await compressPdf(req.file.path);

          // Replace original with compressed
          fs.unlinkSync(req.file.path);
          finalName = path.basename(compressedPath);
          finalPath = compressedPath;
        } catch (err) {
          console.warn("⚠️ PDF compression failed, using original file");
        }
      }

      const uploadDoc = new Upload({
        fileName: finalName,
        filePath: `/uploads/documents/${finalName}`,
        college_id: req.body.college_id,
      });

      await uploadDoc.save();

      res.status(201).json({ message: "File uploaded successfully", upload: uploadDoc });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ message: "Upload failed" });
    }
  });
};


/* =====================================================
   ✅ 6. UPDATE FILE
===================================================== */

const updateUploadFile = async (req, res) => {
  upload.single("file")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.code === "LIMIT_FILE_SIZE" ? "Max upload size is 50MB" : err.message });
    }

    try {
      const { id } = req.params;
      const { college_id } = req.body;

      const existingFile = await Upload.findById(id);
      if (!existingFile) return res.status(404).json({ message: "File not found" });

      // Update college if provided
      if (college_id) {
        const college = await College.findById(college_id);
        if (!college) return res.status(404).json({ message: "College not found" });
        existingFile.college_id = college_id;
      }

      if (req.file) {
        // Remove old file
        const oldPath = path.join(UPLOAD_ROOT, path.basename(existingFile.filePath));
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);

        let finalName = req.file.filename;
        let finalPath = req.file.path;

        // Always compress PDFs
        if (req.file.mimetype === "application/pdf") {
          try {
            const compressedPath = await compressPdf(req.file.path);
            fs.unlinkSync(req.file.path);
            finalName = path.basename(compressedPath);
            finalPath = compressedPath;
          } catch (err) {
            console.warn("⚠️ PDF compression failed, using original file");
          }
        }

        existingFile.fileName = finalName;
        existingFile.filePath = `/uploads/documents/${finalName}`;
      }

      await existingFile.save();
      res.status(200).json({ message: "File updated successfully", upload: existingFile });
    } catch (error) {
      console.error("Update error:", error);
      res.status(500).json({ message: "Failed to update file" });
    }
  });
};

/* =====================================================
   ✅ 7. DELETE FILE
===================================================== */

const deleteUploadFile = async (req, res) => {
  try {
    const file = await Upload.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    const fullPath = path.join(
      __dirname,
      "../../uploads/documents",
      file.fileName,
    );

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }

    await Upload.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
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
// const express = require("express");
// const multer = require("multer");
// const mongoose = require('mongoose'); // Add this import statement
// const fs = require("fs");
// const path = require("path");
// const College = require("../../models/admin/collegemodel");
// const Upload = require("../../models/admin/documentModel");

// const router = express.Router();

// // Ensure uploads folder exists
// const uploadDir = path.join(__dirname, "../../public/uploads/documents/");
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// // Multer Storage Configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// // File Filter to Allow Only Documents
// const fileFilter = (req, file, cb) => {
//   const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"];

//   if (allowedTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error("Invalid file type. Only PDF, DOC, DOCX, and TXT are allowed."), false);
//   }
// };

// // Upload Middleware
// const upload = multer({ storage, fileFilter });

// // @desc Get all uploaded files
// // @route GET /api/uploads/documents
// // @access Public
// const getUploadFiles = async (req, res) => {
//   try {
//     // Get page and limit from query params, set defaults if not provided
//     const page = parseInt(req.query.page) || 1;      // current page number
//     const limit = parseInt(req.query.limit) || 10;   // number of items per page

//     const skip = (page - 1) * limit;

//     // Fetch total count of files (for client-side total pages calculation)
//     const total = await Upload.countDocuments();

//     // Fetch paginated data with college info populated
//     const files = await Upload.find()
//       .populate("college_id", "name")
//       .skip(skip)
//       .limit(limit);

//     res.status(200).json({
//       total,      // total number of files
//       page,       // current page
//       totalPages: Math.ceil(total / limit),
//       files,      // files for the current page
//     });
//   } catch (error) {
//     console.error("Error fetching uploaded files:", error);
//     res.status(500).json({ message: "Failed to fetch uploaded files" });
//   }
// };

// // @desc Get single uploaded file by ID
// // @route GET /api/uploads/documents/:id
// // @access Public

// const getUploadFileById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Check for valid ObjectId
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ message: "Invalid file ID" });
//     }

//     const file = await Upload.findById(id).lean();

//     if (!file) {
//       return res.status(404).json({ message: "File not found" });
//     }

//     return res.status(200).json({ success: true, data: file });

//   } catch (error) {
//     console.error("Error fetching file:", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };

// // @desc Upload a new file
// // @route POST /api/uploads/documents
// // @access Public
// const createUploadFile = async (req, res) => {
//   upload.single("file")(req, res, async (err) => {
//     if (err) {
//       return res.status(400).json({ message: err.message });
//     }

//     if (!req.file || !req.body.college_id) {
//       return res.status(400).json({ message: "File and College ID are required" });
//     }

//     try {
//       const { college_id } = req.body;

//       // Validate college existence
//       const college = await College.findById(college_id);
//       if (!college) return res.status(404).json({ message: "College not found" });

//       // Save file details in DB
//       const newUpload = new Upload({
//         fileName: req.file.filename,
//         filePath: `/uploads/documents/${req.file.filename}`,
//         college_id: college_id,
//       });

//       await newUpload.save();

//       res.status(201).json({
//         message: "File uploaded successfully",
//         upload: newUpload,
//       });
//     } catch (error) {
//       console.error("Error uploading file:", error);
//       res.status(500).json({ message: "File upload failed" });
//     }
//   });
// };

// // @desc Update file details (not the file itself)
// // @route PUT /api/uploads/documents/:id
// // @access Public
// const updateUploadFile = async (req, res) => {
//   try {
//     const { college_id } = req.body;

//     // Validate college existence if updating college_id
//     if (college_id) {
//       const college = await College.findById(college_id);
//       if (!college) return res.status(404).json({ message: "College not found" });
//     }

//     const updatedFile = await Upload.findByIdAndUpdate(req.params.id, req.body, { new: true });

//     if (!updatedFile) return res.status(404).json({ message: "File not found" });

//     res.status(200).json(updatedFile);
//   } catch (error) {
//     console.error("Error updating file:", error);
//     res.status(500).json({ message: "Failed to update file" });
//   }
// };

// // @desc Delete an uploaded file
// // @route DELETE /api/uploads/documents/:id
// // @access Public
// // @desc Delete an uploaded file
// // @route DELETE /api/uploads/:id
// // @access Public
// const deleteUploadFile = async (req, res) => {
//   try {
//     const file = await Upload.findById(req.params.id);
//     if (!file) {
//       return res.status(404).json({ message: "File not found" });
//     }

//     // Check if filePath is available
//     if (!file.filePath || typeof file.filePath !== "string") {
//       return res.status(400).json({ message: "File path is missing or invalid" });
//     }

//     const fullPath = path.join(__dirname, "..", file.filePath);

//     // Check if file exists before deleting
//     if (fs.existsSync(fullPath)) {
//       fs.unlinkSync(fullPath);
//       console.log(`Deleted file from disk: ${fullPath}`);
//     } else {
//       console.warn(`File not found on disk: ${fullPath}`);
//     }

//     // Remove from database
//     await Upload.findByIdAndDelete(req.params.id);

//     res.status(200).json({ message: "File deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting file:", error);
//     res.status(500).json({ message: "Failed to delete file" });
//   }
// };

// module.exports = {
//   getUploadFiles,
//   getUploadFileById,
//   createUploadFile,
//   updateUploadFile,
//   deleteUploadFile,
// };

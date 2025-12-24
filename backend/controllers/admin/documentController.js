// const express = require("express");
// const multer = require("multer");
// const mongoose = require('mongoose'); // Add this import statement
// const fs = require("fs");
// const path = require("path");
// const College = require("../../models/admin/collegemodel");
// const compressPdf = require("../../utils/compressPdf");
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
//       if (err.code === "LIMIT_FILE_SIZE")
//         return res.status(400).json({ message: "Max upload size is 10MB" });
//       return res.status(400).json({ message: err.message });
//     }

//     if (!req.file || !req.body.college_id)
//       return res.status(400).json({ message: "File and College ID are required" });

//     try {
//       const finalFolder = path.join(__dirname, "../../public/uploads/documents");
//       let finalFileName = req.file.filename;
//       let tempPath = req.file.path;

//       // Compress PDF if needed
//       if (req.file.mimetype === "application/pdf") {
//         const compressedPath = await compressPdf(tempPath);
//         fs.unlinkSync(tempPath); // delete original

//         finalFileName = path.basename(compressedPath);
//         tempPath = compressedPath;
//       }

//       const finalPath = path.join(finalFolder, finalFileName);

//       // Only rename if tempPath !== finalPath
//       if (tempPath !== finalPath) {
//         fs.renameSync(tempPath, finalPath);
//       }

//       // Save to DB
//       const uploadDoc = new Upload({
//         fileName: finalFileName,
//         filePath: `/uploads/documents/${finalFileName}`,
//         college_id: req.body.college_id,
//       });
//       await uploadDoc.save();

//       res.status(201).json({
//         message: "File uploaded & compressed successfully",
//         upload: uploadDoc,
//       });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: "Upload failed" });
//     }
//   });
// };



// // @desc Update file details (not the file itself)
// // @route PUT /api/uploads/documents/:id
// // @access Public

// const updateUploadFile = async (req, res) => {
//   console.log("🟡 UPDATE upload API hit");

//   upload.single("file")(req, res, async (err) => {
//     if (err) {
//       console.error("❌ Multer error:", err);

//       if (err.code === "LIMIT_FILE_SIZE") {
//         return res.status(400).json({ message: "Max file size exceeded" });
//       }
//       return res.status(400).json({ message: err.message });
//     }

//     try {
//       const { id } = req.params;
//       const { college_id } = req.body;

//       console.log("📌 File ID:", id);
//       console.log("📌 College ID:", college_id);
//       console.log("📌 New file received:", req.file ? req.file.filename : "NO");

//       // 🔍 Find existing file
//       const existingFile = await Upload.findById(id);
//       if (!existingFile) {
//         console.warn("⚠️ File not found in DB");
//         return res.status(404).json({ message: "File not found" });
//       }

//       console.log("✅ Existing file found:", existingFile.fileName);

//       // 🏫 Validate college if changed
//       if (college_id) {
//         console.log("🔍 Validating college...");
//         const college = await College.findById(college_id);
//         if (!college) {
//           console.warn("⚠️ College not found");
//           return res.status(404).json({ message: "College not found" });
//         }
//         existingFile.college_id = college_id;
//         console.log("✅ College updated");
//       }

//       // 📎 If new file uploaded
//       if (req.file) {
//         console.log("📎 Processing new file upload...");

//         // 🗑 Delete old file
//         if (existingFile.filePath) {
//           const oldPath = path.join(
//             __dirname,
//             "../../public",
//             existingFile.filePath
//           );

//           console.log("🗑 Deleting old file:", oldPath);

//           if (fs.existsSync(oldPath)) {
//             fs.unlinkSync(oldPath);
//             console.log("✅ Old file deleted");
//           } else {
//             console.warn("⚠️ Old file not found on disk");
//           }
//         }

//         let finalPath = req.file.path;
//         let finalName = req.file.filename;

//         // 📉 Compress PDF
//         if (req.file.mimetype === "application/pdf") {
//           console.log("📉 Compressing PDF...");
//           const compressedPath = await compressPdf(req.file.path);

//           fs.unlinkSync(req.file.path);
//           finalPath = compressedPath;
//           finalName = path.basename(compressedPath);

//           console.log("✅ PDF compressed:", finalName);
//         }

//         existingFile.fileName = finalName;
//         existingFile.filePath = `/uploads/documents/${finalName}`;
//       }

//       await existingFile.save();

//       console.log("🎉 File update successful");

//       res.status(200).json({
//         message: "File updated successfully",
//         upload: existingFile,
//       });
//     } catch (error) {
//       console.error("🔥 Update error:", error);
//       res.status(500).json({ message: "Failed to update file" });
//     }
//   });
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
    // Get page and limit from query params, set defaults if not provided
    const page = parseInt(req.query.page) || 1;      // current page number
    const limit = parseInt(req.query.limit) || 10;   // number of items per page

    const skip = (page - 1) * limit;

    // Fetch total count of files (for client-side total pages calculation)
    const total = await Upload.countDocuments();

    // Fetch paginated data with college info populated
    const files = await Upload.find()
      .populate("college_id", "name")
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      total,      // total number of files
      page,       // current page
      totalPages: Math.ceil(total / limit),
      files,      // files for the current page
    });
  } catch (error) {
    console.error("Error fetching uploaded files:", error);
    res.status(500).json({ message: "Failed to fetch uploaded files" });
  }
};


// @desc Get single uploaded file by ID
// @route GET /api/uploads/documents/:id
// @access Public


const getUploadFileById = async (req, res) => {
  try {
    const { id } = req.params;

    // Check for valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid file ID" });
    }

    const file = await Upload.findById(id).lean();

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    return res.status(200).json({ success: true, data: file });

  } catch (error) {
    console.error("Error fetching file:", error);
    return res.status(500).json({ message: "Internal server error" });
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

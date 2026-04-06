const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");

const { DeleteObjectCommand } = require("@aws-sdk/client-s3");
const s3 = require("../../utils/s3"); // ✅ centralized config
const multerS3 = require("multer-s3");

const College = require("../../models/admin/collegemodel");
const Upload = require("../../models/admin/documentModel");

const router = express.Router();

/* =====================================================
   🌍 ENV VARIABLES
===================================================== */
const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

if (!BUCKET_NAME) {
  console.error("❌ AWS_BUCKET_NAME is missing in .env");
}

/* =====================================================
   🚀 1️⃣ FILE FILTER
===================================================== */
const fileFilter = (req, file, cb) => {
  console.log("📄 Incoming file:", file.originalname);
  console.log("📄 File type:", file.mimetype);

  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    console.error("❌ Invalid file type:", file.mimetype);
    cb(new Error("Invalid file type"), false);
  }
};

/* =====================================================
   🚀 2️⃣ MULTER S3 CONFIG
===================================================== */
const upload = multer({
  storage: multerS3({
    s3,
    bucket: BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      console.log("📦 Generating S3 key...");
      console.log("📌 college_id:", req.body.college_id);

      if (!req.body.college_id) {
        return cb(new Error("college_id is required"), null);
      }

      const fileName = `colleges/${req.body.college_id}/${Date.now()}-${file.originalname}`;

      console.log("📦 S3 Key:", fileName);

      cb(null, fileName);
    },
  }),
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 },
});

/* =====================================================
   ✅ 3. GET ALL FILES (PAGINATED)
===================================================== */
const getUploadFiles = async (req, res) => {
  try {
    console.log("📥 Fetching uploaded files...");

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Upload.countDocuments();

    const files = await Upload.find()
      .populate("college_id", "name")
      .skip(skip)
      .limit(limit);

    console.log(`✅ Found ${files.length} files`);

    res.status(200).json({
      total,
      page,
      totalPages: Math.ceil(total / limit),
      files,
    });
  } catch (error) {
    console.error("❌ Fetch files error:", error);
    res.status(500).json({ message: "Failed to fetch uploaded files" });
  }
};

/* =====================================================
   ✅ 4. GET FILE BY ID
===================================================== */
const getUploadFileById = async (req, res) => {
  try {
    console.log("📥 Fetching file by ID:", req.params.id);

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.error("❌ Invalid ObjectId:", id);
      return res.status(400).json({ message: "Invalid file ID" });
    }

    const file = await Upload.findById(id).lean();

    if (!file) {
      console.error("❌ File not found");
      return res.status(404).json({ message: "File not found" });
    }

    res.status(200).json({ success: true, data: file });
  } catch (error) {
    console.error("❌ Get file error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* =====================================================
   🚀 5. CREATE FILE (UPLOAD TO S3)
===================================================== */
const createUploadFile = async (req, res) => {
  console.log("📥 Incoming upload request...");

  upload.single("file")(req, res, async (err) => {
    if (err) {
      console.error("❌ Multer Error:", err);

      return res.status(400).json({
        message:
          err.code === "LIMIT_FILE_SIZE"
            ? "Max upload size is 50MB"
            : err.message,
      });
    }

    console.log("📦 Uploaded File:", req.file);
    console.log("📌 Body:", req.body);

    if (!req.file || !req.body.college_id) {
      console.error("❌ Missing file or college_id");
      return res.status(400).json({
        message: "File and College ID are required",
      });
    }

    try {
      const uploadDoc = new Upload({
        fileName: req.file.originalname,
        filePath: req.file.location, // S3 URL
        s3Key: req.file.key,         // IMPORTANT
        college_id: req.body.college_id,
      });

      await uploadDoc.save();

      console.log("✅ File saved to DB:", uploadDoc);

      res.status(201).json({
        success: true,
        message: "File uploaded successfully",
        upload: uploadDoc,
      });
    } catch (error) {
      console.error("❌ Upload DB error:", error);
      res.status(500).json({ message: "Upload failed" });
    }
  });
};

/* =====================================================
   🚀 6. UPDATE FILE
===================================================== */
const updateUploadFile = async (req, res) => {
  console.log("📥 Update file request:", req.params.id);

  upload.single("file")(req, res, async (err) => {
    if (err) {
      console.error("❌ Multer update error:", err);
      return res.status(400).json({ message: err.message });
    }

    try {
      const { id } = req.params;

      const file = await Upload.findById(id);
      if (!file) {
        console.error("❌ File not found");
        return res.status(404).json({ message: "File not found" });
      }

      if (req.body.college_id) {
        const college = await College.findById(req.body.college_id);
        if (!college) {
          console.error("❌ College not found");
          return res.status(404).json({ message: "College not found" });
        }

        file.college_id = req.body.college_id;
      }

      if (req.file) {
        console.log("📦 Updating file in S3");

        file.fileName = req.file.originalname;
        file.filePath = req.file.location;
        file.s3Key = req.file.key;
      }

      await file.save();

      console.log("✅ File updated:", file);

      res.status(200).json({
        success: true,
        message: "File updated successfully",
        upload: file,
      });
    } catch (error) {
      console.error("❌ Update error:", error);
      res.status(500).json({ message: "Failed to update file" });
    }
  });
};

/* =====================================================
   🚀 7. DELETE FILE (FROM S3)
===================================================== */
const deleteUploadFile = async (req, res) => {
  try {
    console.log("📥 Delete request:", req.params.id);

    const file = await Upload.findById(req.params.id);

    if (!file) {
      console.error("❌ File not found");
      return res.status(404).json({ message: "File not found" });
    }

    console.log("🗑 Deleting from S3:", file.s3Key);

    await s3.send(
      new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: file.s3Key,
      })
    );

    await Upload.findByIdAndDelete(req.params.id);

    console.log("✅ File deleted successfully");

    res.status(200).json({
      success: true,
      message: "File deleted from S3 successfully",
    });
  } catch (error) {
    console.error("❌ Delete error:", error);
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

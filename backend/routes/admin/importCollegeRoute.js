const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { importCollegeFromExcel } = require("../../controllers/admin/importCollegeFromExcel");
const { importCoursesFromExcel } = require("../../controllers/admin/importCoursesFromExcel");
const router = express.Router();

const tempDir = "temp/";
const maxExcelFileSizeMb = 100;
const maxExcelFileSize = maxExcelFileSizeMb * 1024 * 1024;

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

const uploadExcel = multer({
  dest: tempDir, // Temporary location
  limits: { fileSize: maxExcelFileSize },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== ".xlsx" && ext !== ".xls") {
      return cb(new Error("Only Excel files are allowed"));
    }
    cb(null, true);
  },
});

const uploadExcelFile = (req, res, next) => {
  uploadExcel.single("file")(req, res, (err) => {
    if (!err) return next();

    if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        error: `Excel file is too large. Maximum allowed size is ${maxExcelFileSizeMb}MB.`,
      });
    }

    return res.status(400).json({
      error: err.message || "Excel upload failed.",
    });
  });
};

router.post("/colleges/import-excel", uploadExcelFile, importCollegeFromExcel);

router.post("/courses/import-excel", uploadExcelFile, importCoursesFromExcel);



module.exports = router;  // Make sure to export it

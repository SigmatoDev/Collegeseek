const express = require("express");
const multer = require("multer");
const path = require("path");
const { importCollegeFromExcel } = require("../../controllers/admin/importCollegeFromExcel");
const router = express.Router();

const uploadExcel = multer({
  dest: "temp/", // Temporary location
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== ".xlsx" && ext !== ".xls") {
      return cb(new Error("Only Excel files are allowed"));
    }
    cb(null, true);
  },
});

router.post("/colleges/import-excel", uploadExcel.single("file"), importCollegeFromExcel);

module.exports = router;  // Make sure to export it

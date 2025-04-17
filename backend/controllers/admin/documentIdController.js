const path = require("path");
const fs = require("fs");
const Upload = require("../../models/admin/documentModel");
const { ObjectId } = require("mongoose").Types;

const getUploadFileByCollegeId = async (req, res) => {
  try {
    const { collegeId } = req.params;

    if (!ObjectId.isValid(collegeId)) {
      return res.status(400).json({ message: "Invalid College ID" });
    }

    console.log("Received College ID:", collegeId);

    const file = await Upload.findOne({ college_id: new ObjectId(collegeId) });

    if (!file) {
      console.error("No file found for this collegeId");
      return res.status(404).json({ message: "Brochure not found for this college" });
    }

    // Construct correct file path
    let filePath = file.filePath.startsWith("/") 
      ? path.join(__dirname, "../../public", file.filePath)  // If relative, assume it's inside public
      : file.filePath; // If absolute, use it as is

    console.log("Serving file from:", filePath);

    // Check if file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        console.error("File not found:", err);
        return res.status(404).json({ message: "File not found on server" });
      }

      console.log("File exists, starting download...");
      res.download(filePath, file.fileName);
    });

  } catch (error) {
    console.error("Error fetching file:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getUploadFileByCollegeId };

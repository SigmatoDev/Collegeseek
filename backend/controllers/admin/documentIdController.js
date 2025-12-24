const path = require("path");
const fs = require("fs");
const Upload = require("../../models/admin/documentModel");
const { ObjectId } = require("mongoose").Types;

const getUploadFileByCollegeId = async (req, res) => {
  try {
    const { collegeId } = req.params;

    console.log("--------------------------------------------------");
    console.log("Download request received");
    console.log("College ID from params:", collegeId);

    if (!ObjectId.isValid(collegeId)) {
      console.error("❌ Invalid College ID");
      return res.status(400).json({ message: "Invalid College ID" });
    }

    const file = await Upload.findOne({ college_id: collegeId });

    console.log("📄 File record from DB:", file);

    if (!file) {
      console.error("❌ No document found for this college");
      return res
        .status(404)
        .json({ message: "Brochure not found for this college" });
    }

    console.log("📁 filePath from DB:", file.filePath);
    console.log("📎 fileName from DB:", file.fileName);

    const sanitizedPath = file.filePath.replace(/^\/+/, "");

    console.log("🧹 Sanitized filePath:", sanitizedPath);

    const filePath = path.resolve(
      __dirname,
      "../../public",
      sanitizedPath
    );

    console.log("📍 Absolute resolved path:", filePath);

    // Check parent directory
    const dirPath = path.dirname(filePath);
    console.log("📂 Directory being checked:", dirPath);

    if (!fs.existsSync(dirPath)) {
      console.error("❌ Directory does not exist:", dirPath);
    } else {
      console.log("✅ Directory exists");
      console.log(
        "📂 Files in directory:",
        fs.readdirSync(dirPath)
      );
    }

    if (!fs.existsSync(filePath)) {
      console.error("❌ File not found on disk:", filePath);
      return res.status(404).json({ message: "File not found on server" });
    }

    console.log("⬇️ File exists, starting download...");
    res.download(filePath, file.fileName);

  } catch (error) {
    console.error("🔥 Error fetching file:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getUploadFileByCollegeId };


// scripts/updateUploadFilePaths.js
const mongoose = require("mongoose");
const Upload = require("../models/admin/documentModel"); // Adjust path to your Upload model

const S3_BASE_URL = "https://collegeseek.s3.ap-south-1.amazonaws.com";

mongoose.connect("mongodb+srv://collegeseekers:517wQnSFKZQsYOdW@collegeseek.5d0wejd.mongodb.net/collegeseeker", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function updateUploads() {
  try {
    const uploads = await Upload.find({});
    console.log(`Found ${uploads.length} uploads`);

    for (const upload of uploads) {
      if (upload.filePath && upload.filePath.startsWith("/uploads/")) {
        upload.filePath = `${S3_BASE_URL}${upload.filePath}`;
        await upload.save();
        console.log(`Updated filePath for: ${upload.fileName}`);
      }
    }

    console.log("✅ All uploads updated successfully!");
    mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error updating uploads:", err);
    mongoose.disconnect();
  }
}

updateUploads();
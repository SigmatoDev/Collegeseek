const Upload = require("../../models/admin/documentModel");
const s3 = require("../../utils/s3");

const { GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const getUploadFileByCollegeId = async (req, res) => {
  try {
    const { collegeId } = req.params;

    console.log("📥 Download request for college:", collegeId);
    console.log("Request method:", req.method);

    const file = await Upload.findOne({ college_id: collegeId });

    if (!file) {
      return res.status(404).json({ message: "Brochure not found" });
    }

    console.log("📄 Found file:", file.fileName);

    /* =====================================================
       ✅ EXTRACT S3 KEY
    ===================================================== */
    let key = file.s3Key;

    if (!key && file.filePath?.startsWith("http")) {
      try {
        const url = new URL(file.filePath);
        // Remove leading slash and decode URI
        key = decodeURIComponent(url.pathname.replace(/^\/+/, ""));
      } catch (err) {
        console.error("❌ Invalid filePath URL:", file.filePath, err);
      }
    }

    if (!key) {
      console.error("❌ Missing S3 key and filePath for file:", file);
      return res.status(400).json({
        message: "File is not stored in S3 properly",
      });
    }

    console.log("🔑 Using S3 Key:", key);

    /* =====================================================
       🚀 GENERATE SIGNED URL
    ===================================================== */
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    });

    const signedUrl = await getSignedUrl(s3, command, {
      expiresIn: 60 * 5, // URL valid for 5 minutes
    });

    /* =====================================================
       ✅ HEAD request: no body
    ===================================================== */
    if (req.method === "HEAD") {
      return res.status(200).end();
    }

    /* =====================================================
       ✅ GET request: return signed URL
    ===================================================== */
    return res.status(200).json({
      success: true,
      url: signedUrl,
      fileName: file.fileName,
    });

  } catch (error) {
    console.error("❌ Download error:", error);
    return res.status(500).json({ message: "Failed to download file" });
  }
};

module.exports = {
  getUploadFileByCollegeId,
};
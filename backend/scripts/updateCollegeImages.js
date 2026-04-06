const mongoose = require("mongoose");
const College = require("../models/admin/collegemodel");

const S3_BASE_URL = "https://collegeseek.s3.ap-south-1.amazonaws.com";

mongoose.connect("mongodb+srv://collegeseekers:517wQnSFKZQsYOdW@collegeseek.5d0wejd.mongodb.net/collegeseeker", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function updateCollegeImages() {
  try {
    const colleges = await College.find({});
    console.log(`Found ${colleges.length} colleges`);

    for (const college of colleges) {
      let updated = false;

      // Update main image
      if (college.image && college.image.startsWith("/uploads/")) {
        college.image = `${S3_BASE_URL}${college.image}`;
        updated = true;
      }

      // Update gallery images
      if (college.imageGallery && college.imageGallery.length > 0) {
        college.imageGallery = college.imageGallery.map((url) =>
          url.startsWith("/uploads/") ? `${S3_BASE_URL}${url}` : url
        );
        updated = true;
      }

      if (updated) {
        await college.save();
        console.log(`Updated college: ${college.name}`);
      }
    }

    console.log("✅ All colleges updated successfully!");
    mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error updating colleges:", err);
    mongoose.disconnect();
  }
}

updateCollegeImages();
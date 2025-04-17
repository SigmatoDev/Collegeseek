const mongoose = require("mongoose");
const College = require("../../models/admin/collegemodel");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const slugify = require("slugify");


// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
}).fields([
  { name: "image", maxCount: 1 },
  { name: "imageGallery", maxCount: 5 },
]);

// Multer Middleware
const uploadMiddleware = (req, res, next) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: `Multer error: ${err.message}` });
    } else if (err) {
      return res.status(500).json({ error: `Server error: ${err.message}` });
    }
    next();
  });
};

// Function to generate a unique slug
const generateUniqueSlug = async (name) => {
  let slug = slugify(name, { lower: true, strict: true });
  let exists = await College.findOne({ slug });

  let count = 1;
  while (exists) {
    slug = `${slug}-${count}`;
    exists = await College.findOne({ slug });
    count++;
  }

  return slug;
};

const createCollege = async (req, res) => {
  try {
    const {
      name,
      description,
      address,
      location,
      website,
      contact,
      contactEmail,
      state,
      city,
      rank,
      fees,
      avgPackage,
      tabs,
      about,
      courses,
    } = req.body;

    if (!name || !description || !address || !location || !contact || !contactEmail || !state || !city) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // ✅ Generate Unique Slug
    const slug = await generateUniqueSlug(name);

    const parsedRank = rank ? parseFloat(rank) : null;
    const parsedFees = fees ? parseFloat(fees) : null;
    const parsedAvgPackage = avgPackage ? parseFloat(avgPackage) : null;

    let parsedTabs = [];
    if (tabs) {
      try {
        parsedTabs = typeof tabs === "string" ? JSON.parse(tabs) : tabs;
        if (!Array.isArray(parsedTabs)) throw new Error("Tabs must be an array.");
      } catch (err) {
        return res.status(400).json({ error: "Invalid tabs format.", details: err.message });
      }
    }

    let parsedCourses = [];
    if (courses) {
      try {
        parsedCourses = typeof courses === "string" ? JSON.parse(courses) : courses;
        if (!Array.isArray(parsedCourses)) throw new Error("Courses must be an array.");
      } catch (err) {
        return res.status(400).json({ error: "Invalid courses format.", details: err.message });
      }
    }

    const image = req.files?.["image"]?.[0]?.filename ? `/uploads/${req.files["image"][0].filename}` : "";
    const imageGallery = req.files?.["imageGallery"]
      ? req.files["imageGallery"].map((file) => `/uploads/${file.filename}`)
      : [];

    const newCollege = new College({
      name,
      slug, // ✅ Assign generated unique slug
      description,
      state,
      city,
      address,
      location,
      rank: parsedRank,
      fees: parsedFees,
      avgPackage: parsedAvgPackage,
      tabs: parsedTabs,
      about,
      website,
      contact,
      contactEmail,
      coursesList: parsedCourses,
      image,
      imageGallery,
    });

    await newCollege.save();
    res.status(201).json({ message: "College created successfully", college: newCollege });
  } catch (error) {
    console.error("Error creating college:", error);
    res.status(500).json({ error: "Failed to create college", details: error.message });
  }
};



// ✅ Get All Colleges
const getColleges = async (req, res) => {
  try {
    const colleges = await College.find();
    res.status(200).json({ success: true, data: colleges });
  } catch (error) {
    console.error("Error fetching colleges:", error);
    res.status(500).json({ success: false, error: "Failed to fetch colleges" });
  }
};

// ✅ Get College by ID
const getCollegeById = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid college ID" });
    }

    const college = await College.findById(id);
    if (!college) {
      return res.status(404).json({ success: false, message: "College not found" });
    }

    res.status(200).json({ success: true, data: college });
  } catch (error) {
    console.error("Error fetching college:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch college", 
      error: error.message 
    });
  }
};

const getCollegeBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const college = await College.findOne({ slug }).lean(); // use .lean() if you don't need mongoose document methods

    if (!college) {
      return res.status(404).json({ success: false, message: "College not found" });
    }

    res.status(200).json({
      success: true,
      message: "College fetched successfully",
      data: college,
    });
  } catch (error) {
    console.error("Error fetching college by slug:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch college",
      error: error.message,
    });
  }
};



// ✅ Update College
const updateCollege = async (req, res) => {
  try {
    const {
      name,
      description,
      address,
      location,
      website,
      contact,
      contactEmail,
      accreditation,
      university_type,
      slug,
      about,
      state,
      city,
      rank,
      fees,
      avgPackage,
      tabs,
      courses,
    } = req.body;

    // Parse numeric values
    const parsedRank = rank ? parseFloat(rank) : undefined;
    const parsedFees = fees ? parseFloat(fees) : undefined;
    const parsedAvgPackage = avgPackage ? parseFloat(avgPackage) : undefined;

    // Parse JSON fields (tabs and coursesList)
    let parsedTabs;
    if (tabs) {
      try {
        parsedTabs = typeof tabs === "string" ? JSON.parse(tabs) : tabs;
        if (!Array.isArray(parsedTabs)) throw new Error("Tabs must be an array.");
      } catch (err) {
        return res.status(400).json({ error: "Invalid tabs format.", details: err.message });
      }
    }

    let parsedCourses;
    if (courses) {
      try {
        parsedCourses = typeof courses === "string" ? JSON.parse(courses) : courses;
        if (!Array.isArray(parsedCourses)) throw new Error("Courses must be an array.");
      } catch (err) {
        return res.status(400).json({ error: "Invalid courses format.", details: err.message });
      }
    }

    // Handle uploaded files
    const image = req.files?.["image"]?.[0]?.filename
      ? `/uploads/${req.files["image"][0].filename}`
      : undefined;

    const imageGallery = req.files?.["imageGallery"]
      ? req.files["imageGallery"].map((file) => `/uploads/${file.filename}`)
      : undefined;

    // Build update object with only the provided fields
    const updateData = {
      ...(name && { name }),
      ...(description && { description }),
      ...(address && { address }),
      ...(location && { location }),
      ...(website && { website }),
      ...(contact && { contact }),
      ...(contactEmail && { contactEmail }),
      ...(accreditation && { accreditation }),
      ...(university_type && { university_type }),
      ...(slug && { slug }),
      ...(about && { about }),
      ...(state && { state }),
      ...(city && { city }),
      ...(parsedRank !== undefined && { rank: parsedRank }),
      ...(parsedFees !== undefined && { fees: parsedFees }),
      ...(parsedAvgPackage !== undefined && { avgPackage: parsedAvgPackage }),
      ...(parsedTabs && { tabs: parsedTabs }),
      ...(parsedCourses && { coursesList: parsedCourses }),
      ...(image && { image }),
      ...(imageGallery && { imageGallery }),
    };

    const updatedCollege = await College.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedCollege) {
      return res.status(404).json({ success: false, error: "College not found" });
    }

    res.status(200).json({
      success: true,
      message: "College updated successfully",
      data: updatedCollege,
    });
  } catch (error) {
    console.error("❌ Error updating college:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update college",
      details: error.message,
    });
  }
};




// ✅ Delete College
const deleteCollege = async (req, res) => {
  try {
    const college = await College.findByIdAndDelete(req.params.id);
    if (!college) return res.status(404).json({ success: false, error: "College not found" });

    res.status(200).json({ success: true, message: "College deleted successfully" });
  } catch (error) {
    console.error("Error deleting college:", error);
    res.status(500).json({ success: false, error: "Failed to delete college" });
  }
};

// Export functions (CommonJS)
module.exports = {
  createCollege,
  getColleges,
  getCollegeById,
  updateCollege,
  deleteCollege,
  getCollegeBySlug,
};

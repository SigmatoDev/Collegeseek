const mongoose = require("mongoose");
const College = require("../../models/admin/collegemodel");
const AffiliatedBy = require("../../models/admin/affiliatedBy");

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
  console.log("Received body:", req.body);

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
      stream,
      approvel,
      affiliatedby,
      examExpected,
      ownership,
      featured, // ✅ Added here
    } = req.body;

    console.log("Files:", req.files);
    console.log("Original stream:", stream);
    console.log("Original approvel:", approvel);
    console.log("Original examExpected:", examExpected);

    if (
      !name ||
      !description ||
      !address ||
      !location ||
      !contact ||
      !contactEmail ||
      !state ||
      !city ||
      !stream ||
      !approvel ||
      !affiliatedby ||
      !ownership
    ) {
      console.error("Missing required fields");
      return res.status(400).json({ error: "Missing required fields" });
    }

    const slug = await generateUniqueSlug(name);
    console.log("Generated slug:", slug);

    const parsedRank = rank ? parseFloat(rank) : null;
    const parsedFees = fees ? parseFloat(fees) : null;
    const parsedAvgPackage = avgPackage ? parseFloat(avgPackage) : null;

    let parsedTabs = [];
    if (tabs) {
      try {
        parsedTabs = typeof tabs === "string" ? JSON.parse(tabs) : tabs;
        if (!Array.isArray(parsedTabs))
          throw new Error("Tabs must be an array.");
      } catch (err) {
        console.error("Tabs parsing error:", err.message);
        return res
          .status(400)
          .json({ error: "Invalid tabs format.", details: err.message });
      }
    }

    let parsedCourses = [];
    if (courses) {
      try {
        parsedCourses =
          typeof courses === "string" ? JSON.parse(courses) : courses;
        if (!Array.isArray(parsedCourses))
          throw new Error("Courses must be an array.");
      } catch (err) {
        console.error("Courses parsing error:", err.message);
        return res
          .status(400)
          .json({ error: "Invalid courses format.", details: err.message });
      }
    }

    const parsedStream = stream
      .map((id) => {
        if (mongoose.Types.ObjectId.isValid(id)) {
          return new mongoose.Types.ObjectId(id);
        } else {
          console.error(`Invalid ObjectId: ${id}`);
          return null;
        }
      })
      .filter((id) => id !== null);

    const parsedApprovel = approvel
      .map((id) => {
        if (mongoose.Types.ObjectId.isValid(id)) {
          return new mongoose.Types.ObjectId(id);
        } else {
          console.error(`Invalid Approvel ObjectId: ${id}`);
          return null;
        }
      })
      .filter((id) => id !== null);

    const parsedExamExpected = examExpected
      .map((id) => {
        if (mongoose.Types.ObjectId.isValid(id)) {
          return new mongoose.Types.ObjectId(id);
        } else {
          console.error(`Invalid ExamExpected ObjectId: ${id}`);
          return null;
        }
      })
      .filter((id) => id !== null);

    const image = req.files?.["image"]?.[0]?.filename
      ? `/uploads/${req.files["image"][0].filename}`
      : "";
    const imageGallery = req.files?.["imageGallery"]
      ? req.files["imageGallery"].map((file) => `/uploads/${file.filename}`)
      : [];

    console.log("Parsed image:", image);
    console.log("Parsed gallery:", imageGallery);
    console.log("Parsed stream:", parsedStream);

    const newCollege = new College({
      name,
      slug,
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
      stream: parsedStream,
      approvel: parsedApprovel,
      affiliatedby,
      examExpected: parsedExamExpected,
      ownership,
      featured: featured === 'true' || featured === true, // ✅ Safely parsed boolean
    });

    console.log("Saving new college:", newCollege);

    await newCollege.save();
    console.log("College saved successfully");

    res
      .status(201)
      .json({ message: "College created successfully", college: newCollege });
  } catch (error) {
    console.error("Error creating college:", error);
    res
      .status(500)
      .json({ error: "Failed to create college", details: error.message });
  }
};


// ✅ Get All Colleges
const getallColleges = async (req, res) => {
  try {
    const colleges = await College.find();
    res.status(200).json({ success: true, data: colleges });
  } catch (error) {
    console.error("Error fetching colleges:", error);
    res.status(500).json({ success: false, error: "Failed to fetch colleges" });
  }
};
// const getCollege = async (req, res) => {
//   try {
//     const colleges = await College.find()
//       .populate("stream")
//       .populate("examExpected")
//       .populate("approvel")
//       .populate("affiliatedby")
//       .populate("ownership");

//     res.status(200).json({ success: true, data: colleges });
//   } catch (error) {
//     console.error("Error fetching colleges:", error);
//     res.status(500).json({ success: false, error: "Failed to fetch colleges" });
//   }
// };

// controllers/collegeController.ts
const getCollege = async (req, res) => {
  try {
    const colleges = await College.find({})
      .select(
        "state city rank ownership affiliatedby approvel examExpected stream"
      )
      .populate("ownership", "name") // _id included by default
      .populate("affiliatedby", "code name")
      .populate("approvel", "code")
      .populate("examExpected", "code")
      .populate("stream", "name");

    const stateSet = new Set();
    const citySet = new Set();
    const rankSet = new Set();
    const ownershipMap = new Map();
    const affiliationMap = new Map();
    const approvalMap = new Map();
    const examMap = new Map();
    const streamMap = new Map();

    colleges.forEach((college) => {
      if (college.state) stateSet.add(college.state);
      if (college.city) citySet.add(college.city);
      if (college.rank) rankSet.add(college.rank);

      if (college.ownership?._id && college.ownership?.name) {
        ownershipMap.set(college.ownership._id.toString(), {
          _id: college.ownership._id,
          name: college.ownership.name,
        });
      }

      if (college.affiliatedby?._id && college.affiliatedby?.code) {
        affiliationMap.set(college.affiliatedby._id.toString(), {
          _id: college.affiliatedby._id,
          code: college.affiliatedby.code,
          name: college.affiliatedby.name,
        });
      }

      if (college.approvel?.length) {
        college.approvel.forEach((ap) => {
          if (ap?._id && ap?.code) {
            approvalMap.set(ap._id.toString(), {
              _id: ap._id,
              code: ap.code,
            });
          }
        });
      }

      if (college.examExpected?.length) {
        college.examExpected.forEach((exam) => {
          if (exam?._id && exam?.code) {
            examMap.set(exam._id.toString(), {
              _id: exam._id,
              code: exam.code,
            });
          }
        });
      }

      if (college.stream?.length) {
        college.stream.forEach((stream) => {
          if (stream?._id && stream?.name) {
            streamMap.set(stream._id.toString(), {
              _id: stream._id,
              name: stream.name,
            });
          }
        });
      }
    });

    res.json({
      states: Array.from(stateSet),
      cities: Array.from(citySet),
      ranks: Array.from(rankSet).sort((a, b) => a - b),
      ownerships: Array.from(ownershipMap.values()),
      affiliations: Array.from(affiliationMap.values()),
      approvals: Array.from(approvalMap.values()),
      exams: Array.from(examMap.values()),
      streams: Array.from(streamMap.values()),
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch college filters", error });
  }
};

const getColleges = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
    const skip = (page - 1) * limit;

    const total = await College.countDocuments(); // Total number of colleges
    const colleges = await College.find().skip(skip).limit(limit); // Apply pagination
    res.status(200).json({
      success: true,
      data: colleges,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
    });
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
      return res
        .status(400)
        .json({ success: false, message: "Invalid college ID" });
    }

    // ✅ Populate stream, approvel, and examExpected
    const college = await College.findById(id)
      .populate("stream")
      .populate("approvel")
      .populate("examExpected");

    if (!college) {
      return res
        .status(404)
        .json({ success: false, message: "College not found" });
    }

    res.status(200).json({ success: true, data: college });
  } catch (error) {
    console.error("Error fetching college:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch college",
      error: error.message,
    });
  }
};

const getCollegeBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const college = await College.findOne({ slug }).lean(); // use .lean() if you don't need mongoose document methods

    if (!college) {
      return res
        .status(404)
        .json({ success: false, message: "College not found" });
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
  console.log("Received body:", req.body); // Log entire body

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
      stream,
      approvel,
      affiliatedby,
      examExpected,
      ownership,
    } = req.body;

    console.log("Files:", req.files); // Log uploaded files if any
    const featured = req.body.featured === "true";

    // Validate required fields
    if (
      !name ||
      !description ||
      !address ||
      !location ||
      !contact ||
      !contactEmail ||
      !state ||
      !city ||
      !stream ||
      !approvel ||
      !affiliatedby ||
      !ownership
    ) {
      console.error("Missing required fields");
      return res.status(400).json({ error: "Missing required fields" });
    }

    const parsedRank = rank ? parseFloat(rank) : null;
    const parsedFees = fees ? parseFloat(fees) : null;
    const parsedAvgPackage = avgPackage ? parseFloat(avgPackage) : null;

    let parsedTabs = [];
    if (tabs) {
      try {
        parsedTabs = typeof tabs === "string" ? JSON.parse(tabs) : tabs;
        if (!Array.isArray(parsedTabs))
          throw new Error("Tabs must be an array.");
      } catch (err) {
        console.error("Tabs parsing error:", err.message);
        return res
          .status(400)
          .json({ error: "Invalid tabs format.", details: err.message });
      }
    }

    let parsedCourses = [];
    if (courses) {
      try {
        parsedCourses =
          typeof courses === "string" ? JSON.parse(courses) : courses;
        if (!Array.isArray(parsedCourses))
          throw new Error("Courses must be an array.");
      } catch (err) {
        console.error("Courses parsing error:", err.message);
        return res
          .status(400)
          .json({ error: "Invalid courses format.", details: err.message });
      }
    }

    // Validate and convert stream IDs to ObjectIds
    const parsedStream = stream
      .map((id) => {
        if (mongoose.Types.ObjectId.isValid(id)) {
          return new mongoose.Types.ObjectId(id); // Convert valid string IDs to ObjectId
        } else {
          console.error(`Invalid ObjectId: ${id}`);
          return null; // or handle it accordingly
        }
      })
      .filter((id) => id !== null); // Remove any null (invalid) ObjectIds

    const parsedApprovel = approvel
      .map((id) => {
        if (mongoose.Types.ObjectId.isValid(id)) {
          return new mongoose.Types.ObjectId(id);
        } else {
          console.error(`Invalid Approvel ObjectId: ${id}`);
          return null;
        }
      })
      .filter((id) => id !== null);

    // Parse examExpected
    const parsedExamExpected = examExpected
      .map((id) => {
        if (mongoose.Types.ObjectId.isValid(id)) {
          return new mongoose.Types.ObjectId(id);
        } else {
          console.error(`Invalid ExamExpected ObjectId: ${id}`);
          return null;
        }
      })
      .filter((id) => id !== null);

    const image = req.files?.["image"]?.[0]?.filename
      ? `/uploads/${req.files["image"][0].filename}`
      : undefined;

    const imageGallery = req.files?.["imageGallery"]
      ? req.files["imageGallery"].map((file) => `/uploads/${file.filename}`)
      : undefined;

    console.log("Parsed image:", image);
    console.log("Parsed gallery:", imageGallery);
    console.log("Parsed stream:", parsedStream);

    // Build the update data
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
      ...(parsedTabs.length && { tabs: parsedTabs }),
      ...(parsedCourses.length && { coursesList: parsedCourses }),
      ...(image && { image }),
      ...(imageGallery && { imageGallery }),
      ...(parsedStream.length && { stream: parsedStream }),
      ...(parsedApprovel.length && { approvel: parsedApprovel }),
      ...(affiliatedby && { affiliatedby }),
      ...(parsedExamExpected.length && { examExpected: parsedExamExpected }),
      ...(ownership && { ownership }),
      ...(featured !== undefined && { featured }), // Include featured field here
    };

    // Update the college document
    const updatedCollege = await College.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedCollege) {
      return res
        .status(404)
        .json({ success: false, error: "College not found" });
    }

    console.log("College updated successfully:", updatedCollege);
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
    if (!college)
      return res
        .status(404)
        .json({ success: false, error: "College not found" });

    res
      .status(200)
      .json({ success: true, message: "College deleted successfully" });
  } catch (error) {
    console.error("Error deleting college:", error);
    res.status(500).json({ success: false, error: "Failed to delete college" });
  }
};

const getFeaturedColleges = async (req, res) => {
  console.log("API hit: getFeaturedColleges");

  try {
    // Query colleges where featured is true
    const featuredColleges = await College.find({ featured: true });

    console.log(`Found ${featuredColleges.length} featured colleges.`);

    // Return the featured colleges as a response
    res.status(200).json({ success: true, colleges: featuredColleges });
  } catch (error) {
    console.error("Error fetching featured colleges:", error);
    res.status(500).json({ success: false, error: "Failed to fetch featured colleges" });
  }
};






// Export functions (CommonJS)
module.exports = {
  createCollege,
  getallColleges,
  getColleges,
  getCollegeById,
  getCollege,
  updateCollege,
  deleteCollege,
  getCollegeBySlug,
  getFeaturedColleges,
};

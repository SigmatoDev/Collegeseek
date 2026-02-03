const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const Application = require("../../models/users/ApplicationModel");

const uploadDir = path.join(__dirname, "../../uploads/applications");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const IMAGE_MIMES = new Set(["image/jpeg", "image/png", "image/webp"]);
const DOC_MIMES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const IMAGE_MAX = 5 * 1024 * 1024; // 5MB (post-compression target)
const DOC_MAX = 10 * 1024 * 1024; // 10MB

const getNested = (obj, pathStr) =>
  pathStr.split(".").reduce((acc, key) => (acc ? acc[key] : undefined), obj);

const validatePayload = (payload) => {
  const errors = [];
  const requiredFields = [
    ["applicant.firstName", "First name is required"],
    ["applicant.lastName", "Last name is required"],
    ["applicant.email", "Email is required"],
    ["applicant.mobile", "Mobile number is required"],
    ["applicant.gender", "Gender is required"],
    ["applicant.dateOfBirth", "Date of birth is required"],
    ["registration.admissionIntake", "Admission intake is required"],
    ["addresses.communication.addressLine1", "Address line 1 is required"],
    ["addresses.communication.city", "City is required"],
    ["addresses.communication.state", "State is required"],
    ["addresses.communication.pincode", "Pincode is required"],
    ["addresses.communication.country", "Country is required"],
    ["education.tenth.instituteName", "10th institute name is required"],
    ["education.tenth.board", "10th board is required"],
    ["education.tenth.yearOfPassing", "10th year of passing is required"],
    ["education.tenth.percentage", "10th percentage is required"],
    ["declaration.applicantName", "Applicant name is required"],
    ["declaration.parentName", "Parent name is required"],
    ["declaration.date", "Declaration date is required"],
  ];

  requiredFields.forEach(([pathStr, message]) => {
    const value = getNested(payload, pathStr);
    if (value === undefined || value === null || value === "") {
      errors.push({ field: pathStr, message });
    }
  });

  const course = getNested(payload, "registration.course");
  const program = getNested(payload, "registration.program");
  if (!course && !program) {
    errors.push({
      field: "registration.course",
      message: "Course or program is required",
    });
  }

  const email = getNested(payload, "applicant.email");
  if (email && !/^\S+@\S+\.\S+$/.test(email)) {
    errors.push({ field: "applicant.email", message: "Invalid email" });
  }

  return errors;
};

const saveFile = async (file, fieldName) => {
  if (!file) return null;

  const isImage = IMAGE_MIMES.has(file.mimetype);
  const isDoc = DOC_MIMES.has(file.mimetype);

  if (!isImage && !isDoc) {
    throw new Error(
      `Unsupported file type for ${fieldName}. Allowed: images, PDF, DOC, DOCX.`
    );
  }

  if (isDoc && file.size > DOC_MAX) {
    throw new Error(`Document too large for ${fieldName}. Max 10MB.`);
  }

  const timestamp = Date.now();
  if (isImage) {
    const filename = `${timestamp}-${fieldName}.jpg`;
    const destPath = path.join(uploadDir, filename);

    let image = sharp(file.buffer).rotate();
    const metadata = await image.metadata();
    if (metadata.width && metadata.width > 1600) {
      image = image.resize({ width: 1600, withoutEnlargement: true });
    }

    await image.jpeg({ quality: 80 }).toFile(destPath);

    const finalSize = fs.statSync(destPath).size;
    if (finalSize > IMAGE_MAX) {
      fs.unlinkSync(destPath);
      throw new Error(`Image too large for ${fieldName} after compression. Max 5MB.`);
    }

    return {
      path: `/uploads/applications/${filename}`,
      originalName: file.originalname,
      mimeType: "image/jpeg",
      size: finalSize,
    };
  }

  const ext = path.extname(file.originalname) || ".bin";
  const filename = `${timestamp}-${fieldName}${ext}`;
  const destPath = path.join(uploadDir, filename);
  await fs.promises.writeFile(destPath, file.buffer);

  return {
    path: `/uploads/applications/${filename}`,
    originalName: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
  };
};

const submitApplication = async (req, res) => {
  try {
    const payload = req.body?.data ? JSON.parse(req.body.data) : {};
    const errors = validatePayload(payload);
    if (errors.length) {
      return res.status(400).json({
        message: "Validation failed",
        errors,
      });
    }

    const files = req.files || {};
    const uploads = {
      photo: await saveFile(files.photo?.[0], "photo"),
      signature: await saveFile(files.signature?.[0], "signature"),
      diplomaCertificate: await saveFile(
        files.diplomaCertificate?.[0],
        "diplomaCertificate"
      ),
      bachelorCertificate: await saveFile(
        files.bachelorCertificate?.[0],
        "bachelorCertificate"
      ),
      masterCertificate: await saveFile(
        files.masterCertificate?.[0],
        "masterCertificate"
      ),
      otherQualificationCertificate: await saveFile(
        files.otherQualificationCertificate?.[0],
        "otherQualificationCertificate"
      ),
    };

    const application = new Application({
      ...payload,
      uploads,
    });

    await application.save();
    return res
      .status(201)
      .json({ message: "Application submitted successfully", data: application });
  } catch (error) {
    console.error("Error submitting application:", error);
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

const listApplications = async (req, res) => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const search = (req.query.search || "").toString().trim();
    const status = (req.query.status || "").toString().trim();

    const query = {};
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { "applicant.firstName": { $regex: search, $options: "i" } },
        { "applicant.lastName": { $regex: search, $options: "i" } },
        { "applicant.email": { $regex: search, $options: "i" } },
        { "applicant.mobile": { $regex: search, $options: "i" } },
        { "registration.applicationNo": { $regex: search, $options: "i" } },
      ];
    }

    const total = await Application.countDocuments(query);
    const applications = await Application.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return res.json({
      data: applications,
      pagination: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
        limit,
      },
    });
  } catch (error) {
    console.error("Error listing applications:", error);
    return res.status(500).json({ message: "Failed to fetch applications" });
  }
};

const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    return res.json({ data: application });
  } catch (error) {
    console.error("Error fetching application:", error);
    return res.status(500).json({ message: "Failed to fetch application" });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: "Application not found" });
    }
    return res.json({ message: "Application updated", data: updated });
  } catch (error) {
    console.error("Error updating application:", error);
    return res.status(500).json({ message: "Failed to update application" });
  }
};

module.exports = {
  submitApplication,
  listApplications,
  getApplicationById,
  updateApplicationStatus,
};

const path = require("path");
const { randomUUID } = require("crypto");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const Career = require("../../models/admin/careerModel");
const CareerApplication = require("../../models/users/CareerApplicationModel");
const s3 = require("../../utils/s3");

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;
const ALLOWED_RESUME_MIMES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);
const STATUS_VALUES = ["pending", "reviewing", "shortlisted", "rejected", "hired"];

const isHttpUrl = (value) => {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

const uploadResume = async (file) => {
  const extension = path.extname(file.originalname).toLowerCase();
  const key = `career-applications/${Date.now()}-${randomUUID()}-resume${extension}`;
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    })
  );
  return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
};

const submitCareerApplication = async (req, res) => {
  try {
    const {
      careerId,
      fullName,
      email,
      phone,
      currentLocation,
      yearsOfExperience,
      coverLetter = "",
      linkedinProfile = "",
      portfolioGithub = "",
      additionalComments = "",
    } = req.body;
    const required = { careerId, fullName, email, phone, currentLocation, yearsOfExperience };
    const missing = Object.entries(required)
      .filter(([, value]) => !String(value || "").trim())
      .map(([field]) => field);
    if (missing.length) return res.status(400).json({ message: `Missing required fields: ${missing.join(", ")}` });
    if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ message: "Please provide a valid email address." });
    if (!isHttpUrl(linkedinProfile) || !isHttpUrl(portfolioGithub)) return res.status(400).json({ message: "Profile links must be valid http(s) URLs." });

    const resume = req.file;
    if (!resume) return res.status(400).json({ message: "Resume is required." });
    if (!ALLOWED_RESUME_MIMES.has(resume.mimetype)) return res.status(400).json({ message: "Resume must be a PDF, DOC, or DOCX file." });

    const career = await Career.findOne({ _id: careerId, isPublished: true, applicationDeadline: { $gte: new Date() } });
    if (!career) return res.status(404).json({ message: "This job is unavailable or no longer accepting applications." });

    const existing = await CareerApplication.findOne({ career: career._id, user: req.user._id });
    if (existing) return res.status(409).json({ message: "You have already applied for this position." });

    const resumePath = await uploadResume(resume);
    const application = await CareerApplication.create({
      career: career._id,
      user: req.user._id,
      fullName,
      email,
      phone,
      currentLocation,
      positionApplyingFor: career.title,
      jobLocation: career.location,
      employmentType: career.employmentType,
      yearsOfExperience,
      resume: { path: resumePath, originalName: resume.originalname, mimeType: resume.mimetype, size: resume.size },
      coverLetter,
      linkedinProfile,
      portfolioGithub,
      additionalComments,
    });
    return res.status(201).json({ message: "Career application submitted successfully.", data: application });
  } catch (error) {
    if (error && error.code === 11000) return res.status(409).json({ message: "You have already applied for this position." });
    console.error("Submit Career Application Error:", error);
    return res.status(500).json({ message: "Unable to submit career application." });
  }
};

const listCareerApplications = async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);
    const { search = "", status = "" } = req.query;
    const filter = {};
    if (status && STATUS_VALUES.includes(status)) filter.status = status;
    if (search.trim()) {
      const expression = new RegExp(search.trim(), "i");
      filter.$or = [{ fullName: expression }, { email: expression }, { phone: expression }, { positionApplyingFor: expression }, { jobLocation: expression }];
    }
    const [data, total] = await Promise.all([
      CareerApplication.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).populate("career", "title slug location employmentType").lean(),
      CareerApplication.countDocuments(filter),
    ]);
    return res.json({ data, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } });
  } catch (error) {
    console.error("List Career Applications Error:", error);
    return res.status(500).json({ message: "Unable to load career applications." });
  }
};

const getCareerApplicationById = async (req, res) => {
  try {
    const application = await CareerApplication.findById(req.params.id).populate("career", "title slug location employmentType").populate("user", "name email phone").lean();
    if (!application) return res.status(404).json({ message: "Career application not found." });
    return res.json({ data: application });
  } catch (error) {
    console.error("Get Career Application Error:", error);
    return res.status(400).json({ message: "Invalid career application id." });
  }
};

const updateCareerApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!STATUS_VALUES.includes(status)) return res.status(400).json({ message: "Invalid application status." });
    const application = await CareerApplication.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!application) return res.status(404).json({ message: "Career application not found." });
    return res.json({ message: "Application status updated.", data: application });
  } catch (error) {
    console.error("Update Career Application Status Error:", error);
    return res.status(400).json({ message: "Unable to update application status." });
  }
};

module.exports = { submitCareerApplication, listCareerApplications, getCareerApplicationById, updateCareerApplicationStatus };

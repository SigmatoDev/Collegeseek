const mongoose = require("mongoose");
const slugify = require("slugify");
const Career = require("../../models/admin/careerModel");

const EMPLOYMENT_TYPES = ["full-time", "part-time", "contract"];
const REQUIRED_FIELDS = [
  "title",
  "location",
  "employmentType",
  "experienceRequired",
  "description",
  "responsibilities",
  "skillsAndQualifications",
  "benefits",
  "applicationDeadline",
];

const cleanText = (value) => (typeof value === "string" ? value.trim() : value);
const normalizeDeadline = (value) => {
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return new Date(`${value}T23:59:59.999Z`);
  }
  return value;
};

const normalizePayload = (body = {}) => {
  const payload = {};
  [
    "title",
    "location",
    "employmentType",
    "experienceRequired",
    "salary",
    "description",
    "responsibilities",
    "skillsAndQualifications",
    "benefits",
    "metaTitle",
    "metaDescription",
  ].forEach((field) => {
    if (body[field] !== undefined) payload[field] = cleanText(body[field]);
  });

  if (body.applicationDeadline !== undefined) {
    payload.applicationDeadline = normalizeDeadline(body.applicationDeadline);
  }
  if (typeof body.isPublished === "boolean") payload.isPublished = body.isPublished;

  return payload;
};

const validateCareer = (payload, isUpdate = false) => {
  const errors = {};
  REQUIRED_FIELDS.forEach((field) => {
    if (!isUpdate || payload[field] !== undefined) {
      if (!payload[field]) errors[field] = "This field is required.";
    }
  });

  if (
    payload.employmentType !== undefined &&
    !EMPLOYMENT_TYPES.includes(payload.employmentType)
  ) {
    errors.employmentType = "Employment type must be full-time, part-time, or contract.";
  }

  if (
    payload.applicationDeadline !== undefined &&
    Number.isNaN(new Date(payload.applicationDeadline).getTime())
  ) {
    errors.applicationDeadline = "Application deadline must be a valid date.";
  }

  return errors;
};

const ensureUniqueSlug = async (title, ignoreId) => {
  const baseSlug = slugify(title, { lower: true, strict: true }) || "job";
  let slug = baseSlug;
  let counter = 2;

  while (
    await Career.exists({
      slug,
      ...(ignoreId ? { _id: { $ne: ignoreId } } : {}),
    })
  ) {
    slug = `${baseSlug}-${counter++}`;
  }

  return slug;
};

exports.listAdminCareers = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
    const search = cleanText(req.query.search || "");
    const status = req.query.status;
    const query = {};

    if (status === "published") query.isPublished = true;
    if (status === "draft") query.isPublished = false;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { employmentType: { $regex: search, $options: "i" } },
      ];
    }

    const [careers, total] = await Promise.all([
      Career.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      Career.countDocuments(query),
    ]);

    return res.json({
      data: careers,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Error listing careers:", error);
    return res.status(500).json({ message: "Failed to fetch careers." });
  }
};

exports.getAdminCareerById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid career ID." });
    }
    const career = await Career.findById(req.params.id);
    if (!career) return res.status(404).json({ message: "Career not found." });
    return res.json({ data: career });
  } catch (error) {
    console.error("Error fetching career:", error);
    return res.status(500).json({ message: "Failed to fetch career." });
  }
};

exports.createCareer = async (req, res) => {
  try {
    const payload = normalizePayload(req.body);
    const errors = validateCareer(payload);
    if (Object.keys(errors).length) {
      return res.status(400).json({ message: "Validation failed.", errors });
    }

    payload.slug = await ensureUniqueSlug(payload.title);
    const career = await Career.create(payload);
    return res.status(201).json({ message: "Career created successfully.", data: career });
  } catch (error) {
    console.error("Error creating career:", error);
    return res.status(500).json({ message: "Failed to create career." });
  }
};

exports.updateCareer = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid career ID." });
    }
    const payload = normalizePayload(req.body);
    const errors = validateCareer(payload, true);
    if (Object.keys(errors).length) {
      return res.status(400).json({ message: "Validation failed.", errors });
    }
    if (payload.title) payload.slug = await ensureUniqueSlug(payload.title, req.params.id);

    const career = await Career.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });
    if (!career) return res.status(404).json({ message: "Career not found." });
    return res.json({ message: "Career updated successfully.", data: career });
  } catch (error) {
    console.error("Error updating career:", error);
    return res.status(500).json({ message: "Failed to update career." });
  }
};

exports.toggleCareerPublishStatus = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid career ID." });
    }
    if (typeof req.body.isPublished !== "boolean") {
      return res.status(400).json({ message: "isPublished must be a boolean." });
    }
    const career = await Career.findByIdAndUpdate(
      req.params.id,
      { isPublished: req.body.isPublished },
      { new: true, runValidators: true }
    );
    if (!career) return res.status(404).json({ message: "Career not found." });
    return res.json({ message: "Career status updated successfully.", data: career });
  } catch (error) {
    console.error("Error updating career status:", error);
    return res.status(500).json({ message: "Failed to update career status." });
  }
};

exports.deleteCareer = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid career ID." });
    }
    const career = await Career.findByIdAndDelete(req.params.id);
    if (!career) return res.status(404).json({ message: "Career not found." });
    return res.json({ message: "Career deleted successfully." });
  } catch (error) {
    console.error("Error deleting career:", error);
    return res.status(500).json({ message: "Failed to delete career." });
  }
};

exports.listPublishedCareers = async (req, res) => {
  try {
    const careers = await Career.find({
      isPublished: true,
      applicationDeadline: { $gte: new Date() },
    })
      .sort({ createdAt: -1 })
      .select("title slug location employmentType experienceRequired salary applicationDeadline createdAt");
    return res.json({ data: careers });
  } catch (error) {
    console.error("Error listing public careers:", error);
    return res.status(500).json({ message: "Failed to fetch careers." });
  }
};

exports.getPublishedCareerBySlug = async (req, res) => {
  try {
    const slug = cleanText(req.query.slug || "");
    if (!slug) return res.status(400).json({ message: "Career slug is required." });
    const career = await Career.findOne({
      slug,
      isPublished: true,
      applicationDeadline: { $gte: new Date() },
    });
    if (!career) return res.status(404).json({ message: "Career not found." });
    return res.json({ data: career });
  } catch (error) {
    console.error("Error fetching public career:", error);
    return res.status(500).json({ message: "Failed to fetch career." });
  }
};

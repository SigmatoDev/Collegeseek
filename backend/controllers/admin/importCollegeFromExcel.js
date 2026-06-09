
const ExcelJS = require("exceljs");
const fs = require("fs");
const slugify = require("slugify");
const { v4: uuidv4 } = require("uuid");
const axios = require("axios");

const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const College = require("../../models/admin/collegemodel");
const AffiliatedBy = require("../../models/admin/affiliatedBy");
const Ownership = require("../../models/admin/ownerShip");
const Stream = require("../../models/admin/streams");
const Approval = require("../../models/admin/approvels");
const ExamsAccepted = require("../../models/admin/examExpected");

// ------------------- S3 CONFIG -------------------
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const uploadToS3 = async (buffer, fileName, mimeType) => {
  const key = `uploads/${fileName}`;

  console.log("☁️ Uploading:", key);

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: mimeType,
  });

  await s3.send(command);

  const url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

  console.log("✅ Uploaded:", url);

  return url;
};

// ------------------- HELPERS -------------------

const generateUniqueSlug = async (name) => {
  let baseSlug = slugify(name, { lower: true, strict: true });
  let slug = baseSlug;
  let count = 1;

  while (await College.findOne({ slug })) {
    slug = `${baseSlug}-${count++}`;
  }

  return slug;
};

const extractText = (val) => {
  if (val === null || val === undefined) return "";
  if (typeof val === "string") return val.trim();
  if (typeof val === "number" || typeof val === "boolean") return String(val);
  if (val instanceof Date) return val.toISOString();
  if (Array.isArray(val)) return val.map(extractText).filter(Boolean).join("|");
  if (typeof val === "object") {
    if (Array.isArray(val.richText)) {
      return val.richText.map((item) => extractText(item.text)).join("").trim();
    }

    return extractText(
      val.text ??
      val.result ??
      val.hyperlink ??
      val.formula ??
      val.sharedFormula
    );
  }
  return "";
};

const normalizeCell = (value) => extractText(value).trim();

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const splitCellValues = (values) => {
  if (!values) return [];
  if (Array.isArray(values)) return values.map(normalizeCell).filter(Boolean);

  const cleaned = normalizeCell(values)
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'");

  if (!cleaned) return [];

  try {
    if (cleaned.startsWith("[")) {
      const parsed = JSON.parse(cleaned);
      return splitCellValues(parsed);
    }
  } catch (err) {
    console.log("⚠️ JSON parse failed, using fallback split");
  }

  return cleaned
    .replace(/^\[|\]$/g, "")
    .split("|")
    .map((value) => value.replace(/^['"]|['"]$/g, "").trim())
    .filter(Boolean);
};

const uploadGalleryImages = async (imagesStr) => {
  const urls = splitCellValues(imagesStr);
  const uploaded = [];

  for (const url of urls) {
    try {
      const response = await axios.get(url, {
        responseType: "arraybuffer",
      });

      const buffer = Buffer.from(response.data);
      const filename = `${uuidv4()}.jpg`;

      const s3Url = await uploadToS3(buffer, filename, "image/jpeg");

      uploaded.push(s3Url);
    } catch (err) {
      console.warn("❌ Gallery image failed:", url);
    }
  }

  return uploaded;
};

const resolveFieldId = async (Model, name, createIfNotFound = true) => {
  const normalized = normalizeCell(name);

  if (!normalized) return null;

  let doc = await Model.findOne({
    name: new RegExp(`^${escapeRegExp(normalized)}$`, "i"),
  });

  if (!doc && createIfNotFound) {
    doc = new Model({
      name: normalized,
      code: slugify(normalized, { lower: true, strict: true }),
    });
    await doc.save();
  }

  return doc?._id || null;
};

const resolveMultipleFieldIds = async (Model, values, createIfNotFound = true) => {
  const ids = [];

  for (const name of splitCellValues(values)) {
    const id = await resolveFieldId(Model, name, createIfNotFound);
    if (id) ids.push(id);
  }

  console.log("✅ Final resolved IDs:", ids);

  return ids;
};

const stripHtml = (html) => {
  return normalizeCell(html).replace(/<[^>]*>/g, "").trim();
};

const toNumber = (value) => {
  const parsed = Number(normalizeCell(value).replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
};

// ------------------- CONTACT PARSER -------------------

const parseContactNumbers = (val) => {
  const entries = splitCellValues(val);
  if (!entries.length) return [];

  const normalizeContactType = (type) =>
    type.toLowerCase().includes("land") ? "Landline" : "Mobile";
  const normalizeNumber = (number) => number.replace(/[^\d+-]/g, "");

  return entries
    .map((entry) => {
      if (entry.includes(":")) {
        const [type, ...numberParts] = entry.split(":").map((v) => v.trim());
        return {
          type: normalizeContactType(type),
          number: normalizeNumber(numberParts.join(":")),
        };
      }

      return {
        type: "Mobile",
        number: normalizeNumber(entry),
      };
    })
    .filter((contact) => contact.number);
};

const extractEmail = (val) => {
  const text = extractText(val);
  const match = text.match(/[^\s@]+@[^\s@]+\.[^\s@]+/);
  return match ? match[0] : "";
};

// ------------------- CONTROLLER -------------------

const importCollegeFromExcel = async (req, res) => {
  console.log("▶️ HIT importCollegeFromExcel API");
  const uploadedFilePath = req.file?.path;

  try {
    if (!req.file) {
      return res.status(400).json({ error: "No Excel file uploaded." });
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(req.file.path);

    const sheet = workbook.worksheets[0];

    console.log("📑 Sheet:", sheet.name);
    console.log("📊 Rows:", sheet.rowCount);

    const headerRow = sheet.getRow(1);

    const imageMap = new Map();

    const images = sheet.getImages();

    for (const img of images) {
      const image = workbook.getImage(img.imageId) || workbook.model.media.find(
        (m) => m.index === img.imageId
      );

      if (image && image.buffer) {
        const ext = image.type?.split("/")[1] || "jpg";
        const filename = `${uuidv4()}.${ext}`;

        const s3Url = await uploadToS3(
          image.buffer,
          filename,
          image.type
        );

        const rowNumber = img.range.tl.nativeRow + 1;
        imageMap.set(rowNumber, s3Url);
      }
    }

    const rows = [];

    sheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;

      const data = {};

      headerRow.eachCell((cell, colNumber) => {
        const header = normalizeCell(cell.value || cell.text);
        const value = row.getCell(colNumber).value;
        if (header) data[header] = value;
      });

      if (normalizeCell(data["Name"])) {
        rows.push({ ...data, rowNumber });
      }
    });

    console.log("✅ Rows found:", rows.length);

    const imported = [];
    const failed = [];

    for (const row of rows) {
      try {
        const name = normalizeCell(row["Name"]);
        const affiliatedById = await resolveFieldId(AffiliatedBy, row["Affiliated By"]);
        const ownershipId = await resolveFieldId(Ownership, row["Ownership"]);

        const streamIds = await resolveMultipleFieldIds(Stream, row["Streams"], false);
        const approvalIds = await resolveMultipleFieldIds(Approval, row["Approvals"], false);
        const examIds = await resolveMultipleFieldIds(ExamsAccepted, row["Exam Expected"], false);

        if (!affiliatedById || !ownershipId) {
          failed.push({
            college: name,
            error: "Missing required references",
          });
          continue;
        }

        const imagePath = imageMap.get(row.rowNumber) || extractText(row["Image"]);

        const collegeData = {
          collegeId: undefined,

          name,
          slug: await generateUniqueSlug(name),

          description: stripHtml(row["Description"] || ""),
          about: stripHtml(row["About"] || ""),

          state: normalizeCell(row["State"]),
          city: normalizeCell(row["City"]),

          stream: streamIds,
          approvel: approvalIds,
          examExpected: examIds,
          affiliatedby: affiliatedById,
          ownership: ownershipId,

          address: normalizeCell(row["Address"]),
          location: normalizeCell(row["Location"]),

          rank: toNumber(row["Rank"]),
          fees: toNumber(row["Fees"]),
          avgPackage: toNumber(row["Avg Package"]),

          website: extractText(row["Website"]),

          contactNumbers: parseContactNumbers(row["Contact Numbers"]),
          contactEmail: extractEmail(row["Contact Email"]),

          featured: ["yes", "true", "1"].includes(normalizeCell(row["Featured"]).toLowerCase()),

          image: imagePath,
          imageGallery: await uploadGalleryImages(row["Image Gallery"]),
        };

        const newCollege = new College(collegeData);
        await newCollege.save();

        imported.push(newCollege);
        console.log("✅ CREATED:", newCollege.name);

      } catch (err) {
        console.log("❌ ERROR:", normalizeCell(row["Name"]), err.message);

        failed.push({
          college: normalizeCell(row["Name"]),
          error: err.message,
        });
      }
    }

    return res.status(201).json({
      message: "Import completed",
      successCount: imported.length,
      failedCount: failed.length,
      failedColleges: failed,
      failed,
    });

  } catch (err) {
    console.error("❌ IMPORT FAILED:", err);

    return res.status(500).json({
      error: "Failed to import colleges",
      details: err.message,
    });
  } finally {
    if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
      fs.unlinkSync(uploadedFilePath);
    }
  }
};

module.exports = { importCollegeFromExcel };

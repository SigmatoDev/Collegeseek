// const ExcelJS = require("exceljs");
// const fs = require("fs");
// const path = require("path");
// const slugify = require("slugify");
// const { v4: uuidv4 } = require("uuid");
// const mongoose = require("mongoose");

// const College = require("../../models/admin/collegemodel");
// const AffiliatedBy = require("../../models/admin/affiliatedBy");
// const Ownership = require("../../models/admin/ownerShip");
// const Stream = require("../../models/admin/streams");
// const Approval = require("../../models/admin/approvels");
// const ExamsAccepted = require("../../models/admin/examExpected");

// const generateUniqueSlug = async (name) => {
//   let baseSlug = slugify(name, { lower: true, strict: true });
//   let slug = baseSlug;
//   let count = 1;
//   while (await College.findOne({ slug })) {
//     slug = `${baseSlug}-${count++}`;
//   }
//   return slug;
// };

// const formatImages = (imagesStr) => {
//   if (!imagesStr) return [];
//   return imagesStr.split("|").map((img) => img.trim());
// };

// const resolveFieldId = async (Model, name, createIfNotFound = true) => {
//   if (!name || typeof name !== "string") return null;
//   const normalized = name.trim();
//   let doc = await Model.findOne({ name: new RegExp(`^${normalized}$`, "i") });

//   if (!doc && createIfNotFound) {
//     doc = new Model({
//       name: normalized,
//       code: slugify(normalized, { lower: true, strict: true }),
//     });
//     await doc.save();
//   }

//   return doc?._id || null;
// };

// const resolveMultipleFieldIds = async (Model, values, createIfNotFound = true) => {
//   if (!values) return [];
//   let parts = [];
//   try {
//     if (typeof values === "string" && values.trim().startsWith("[")) {
//       parts = JSON.parse(values);
//     } else if (typeof values === "string") {
//       parts = values.split("|");
//     } else if (Array.isArray(values)) {
//       parts = values;
//     }
//   } catch (e) {
//     parts = values.split("|");
//   }

//   const ids = [];
//   for (const name of parts.map((v) => v.trim()).filter(Boolean)) {
//     const id = await resolveFieldId(Model, name, createIfNotFound);
//     if (id) ids.push(id);
//   }
//   return ids;
// };

// const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// const extractEmail = (val) => {
//   if (!val) return "";
//   if (typeof val === "string") return val.trim();
//   if (typeof val === "object") {
//     if (val.text) return val.text.trim();
//     if (val.richText && Array.isArray(val.richText)) {
//       return val.richText.map((t) => t.text).join("").trim();
//     }
//     if (val.result) return val.result.trim();
//   }
//   return "";
// };

// exports.importCollegeFromExcel = async (req, res) => {
//   console.log("▶️ Hit importCollegeFromExcel");

//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: "No Excel file uploaded." });
//     }

//     const workbook = new ExcelJS.Workbook();
//     await workbook.xlsx.readFile(req.file.path);
//     const sheet = workbook.worksheets[0];

//     // console.log(`📄 Sheet loaded: ${sheet.name}`);

//     const imageMap = new Map();
//     const folderPath = path.join(__dirname, "../../uploads");
//     if (!fs.existsSync(folderPath)) {
//       fs.mkdirSync(folderPath, { recursive: true });
//     }

//     sheet.getImages().forEach((img) => {
//       const image = workbook.model.media.find((media) => media.index === img.imageId);
//       if (image && image.buffer) {
//         const extension = image.type?.split("/")[1] || "webp";
//         const filename = `${uuidv4()}.${extension}`;
//         const filePath = path.join(folderPath, filename);
//         fs.writeFileSync(filePath, image.buffer);
//         const rowNumber = img.range.tl.nativeRow + 1;
//         imageMap.set(rowNumber, `/uploads/${filename}`);
//         // console.log(`🖼️ Image saved for row ${rowNumber}: ${filename}`);
//       }
//     });

//     const imported = [];
//     const failed = [];

//     const headerRow = sheet.getRow(1);
//     const rows = [];

//     sheet.eachRow((row, rowNumber) => {
//       if (rowNumber === 1) return;

//       const data = {};
//       headerRow.eachCell((cell, colNumber) => {
//         const header = cell.text.trim();
//         const value = row.getCell(colNumber).value;
//         data[header] = value;
//       });

//       if (data["name"] && String(data["name"]).trim() !== "") {
//         rows.push({ ...data, rowNumber });
//       }
//     });

//     // console.log(`🧾 Total data rows to process: ${rows.length}`);

//     for (const row of rows) {
//       try {
//         // console.log(`➡️ Processing row ${row.rowNumber}: ${row.name}`);

//         const safe = (val, fallback = "-") => {
//           if (typeof val === "string" && val.trim()) return val.trim();
//           if (typeof val === "number" && !isNaN(val)) return val;
//           return fallback;
//         };

//         let inputId = row.Mongo_id;
//         let normalizedId = null;

//         if (typeof inputId === "string") {
//           try {
//             const parsed = JSON.parse(inputId);
//             if (parsed && parsed.$oid && isValidObjectId(parsed.$oid)) {
//               normalizedId = parsed.$oid;
//             } else if (isValidObjectId(inputId)) {
//               normalizedId = inputId;
//             }
//           } catch {
//             if (isValidObjectId(inputId)) {
//               normalizedId = inputId;
//             }
//           }
//         }

//         const affiliatedById = await resolveFieldId(AffiliatedBy, row.affiliatedby);
//         const ownershipId = await resolveFieldId(Ownership, row.ownership);
//         const streamIds = await resolveMultipleFieldIds(Stream, row.stream, true);
//         const approvalIds = await resolveMultipleFieldIds(Approval, row.approvel, false);
//         const examIds = await resolveMultipleFieldIds(ExamsAccepted, row.examExpected, true);

//         if (!affiliatedById || !ownershipId) {
//           failed.push({
//             college: row.name,
//             error: `${!affiliatedById ? "affiliatedby" : "ownership"} not found.`,
//           });
//           continue;
//         }

//         const imagePath = imageMap.get(row.rowNumber) || safe(row.image, "");

//         const email = extractEmail(row.contactEmail);

//         const collegeData = {
//           name: safe(row.name),
//           description: safe(row.description),
//           about: safe(row.about),
//           state: safe(row.state),
//           city: safe(row.city),
//           address: safe(row.address),
//           location: safe(row.location),
//           rank: Number(row.rank) || 0,
//           fees: Number(row.fees) || 0,
//           avgPackage: Number(row.avgPackage) || 0,
//           image: imagePath,
//           imageGallery: formatImages(row.imageGallery),
//           website: safe(row.website),
//           contact: safe(row.contact),
//           contactEmail: /^\S+@\S+\.\S+$/.test(email) ? email : undefined,
//           affiliatedby: affiliatedById,
//           ownership: ownershipId,
//           stream: streamIds,
//           approvel: approvalIds,
//           examExpected: examIds,
//           featured: ["true", "1", "yes"].includes(String(row.featured).toLowerCase()),
//         };

//         if (normalizedId) {
//           const existing = await College.findById(normalizedId);
//           if (existing) {
//             collegeData.slug = existing.slug;
//             const updated = await College.findByIdAndUpdate(normalizedId, collegeData, { new: true });
//             imported.push(updated);
//             // console.log(`✅ Updated existing college: ${updated.name} (${updated._id})`);
//             continue;
//           } else {
//             failed.push({
//               college: normalizedId,
//               error: "No college found with provided _id.",
//             });
//             continue;
//           }
//         }

//         collegeData.slug = await generateUniqueSlug(row.name);
//         const newCollege = new College(collegeData);
//         await newCollege.save();
//         imported.push(newCollege);
//         console.log(`✅ Created new college: ${newCollege.name} (${newCollege._id})`);
//       } catch (err) {
//         console.error(`❌ Failed to import college: ${row.name}`, err);
//         failed.push({
//           college: row.name || row._id || `Row ${row.rowNumber}`,
//           error: err.message,
//         });
//       }
//     }

//     fs.unlinkSync(req.file.path);
//     // console.log("🧹 Temp Excel file deleted.");

//     // console.log(`📦 Import Summary — Success: ${imported.length}, Failed: ${failed.length}`);

//     res.status(201).json({
//       message: "Import completed.",
//       successCount: imported.length,
//       failedCount: failed.length,
//       failedColleges: failed,
//     });
//   } catch (err) {
//     console.error("❌ Excel import error:", err);
//     res.status(500).json({ error: "Failed to import colleges", details: err.message });
//   }
// };

const ExcelJS = require("exceljs");
const fs = require("fs");
const path = require("path");
const slugify = require("slugify");
const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");

const College = require("../../models/admin/collegemodel");
const AffiliatedBy = require("../../models/admin/affiliatedBy");
const Ownership = require("../../models/admin/ownerShip");
const Stream = require("../../models/admin/streams");
const Approval = require("../../models/admin/approvels");
const ExamsAccepted = require("../../models/admin/examExpected");

// Generate unique slug
const generateUniqueSlug = async (name) => {
  let baseSlug = slugify(name, { lower: true, strict: true });
  let slug = baseSlug;
  let count = 1;
  while (await College.findOne({ slug })) {
    slug = `${baseSlug}-${count++}`;
  }
  return slug;
};

// Format image gallery string to array
const formatImages = (imagesStr) => {
  if (!imagesStr) return [];
  return imagesStr.split("|").map((img) => img.trim());
};

// Resolve single reference field
const resolveFieldId = async (Model, name, createIfNotFound = true) => {
  if (!name || typeof name !== "string") return null;
  const normalized = name.trim();
  let doc = await Model.findOne({ name: new RegExp(`^${normalized}$`, "i") });

  if (!doc && createIfNotFound) {
    doc = new Model({
      name: normalized,
      code: slugify(normalized, { lower: true, strict: true }),
    });
    await doc.save();
  }
  return doc?._id || null;
};

// Resolve multiple reference fields
const resolveMultipleFieldIds = async (Model, values, createIfNotFound = true) => {
  if (!values) return [];
  let parts = [];

  try {
    if (typeof values === "string" && values.trim().startsWith("[")) {
      parts = JSON.parse(values);
    } else if (typeof values === "string") {
      parts = values.split("|");
    } else if (Array.isArray(values)) {
      parts = values;
    }
  } catch {
    parts = values.split("|");
  }

  const ids = [];
  for (const name of parts.map((v) => v.trim()).filter(Boolean)) {
    const id = await resolveFieldId(Model, name, createIfNotFound);
    if (id) ids.push(id);
  }
  return ids;
};

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Extract email
const extractEmail = (val) => {
  if (!val) return "";
  if (typeof val === "string") return val.trim();
  if (typeof val === "object") {
    if (val.text) return val.text.trim();
    if (val.richText && Array.isArray(val.richText)) {
      return val.richText.map((t) => t.text).join("").trim();
    }
    if (val.result) return val.result.trim();
  }
  return "";
};

// Parse contact numbers with validation
const parseContactNumbers = (contactStr) => {
  if (!contactStr) return [];

  // Split by '|' or ','
  return contactStr
    .split(/\||,/)
    .map((item) => {
      const [typeRaw, numberRaw] = item.split(":").map((v) => v.trim());
      if (!typeRaw || !numberRaw) return null;

      const type = ["Mobile", "Landline"].includes(typeRaw) ? typeRaw : "Mobile";
      const number = numberRaw;

      // Validate numbers
      const mobileRegex = /^(\+?\d{10,15})$/;
      const landlineRegex = /^(\d{2,5}[- ]?\d{6,8})$/;

      if ((type === "Mobile" && !mobileRegex.test(number)) ||
          (type === "Landline" && !landlineRegex.test(number))) {
        console.warn(`Invalid ${type} number skipped: ${number}`);
        return null;
      }

      return { type, number };
    })
    .filter(Boolean);
};


// Strip HTML tags
const stripHtml = (html) => {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").trim();
};

// Controller
const importCollegeFromExcel = async (req, res) => {
  console.log("▶️ Hit importCollegeFromExcel API");

  try {
    if (!req.file) return res.status(400).json({ error: "No Excel file uploaded." });

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(req.file.path);
    const sheet = workbook.worksheets[0];
    console.log(`📘 Loaded sheet: ${sheet.name}`);

    const imageMap = new Map();
    const folderPath = path.join(__dirname, "../../uploads");
    if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });

    // Extract images
    sheet.getImages().forEach((img) => {
      const image = workbook.model.media.find((media) => media.index === img.imageId);
      if (image && image.buffer) {
        const extension = image.type?.split("/")[1] || "webp";
        const filename = `${uuidv4()}.${extension}`;
        const filePath = path.join(folderPath, filename);
        fs.writeFileSync(filePath, image.buffer);
        const rowNumber = img.range.tl.nativeRow + 1;
        imageMap.set(rowNumber, `/uploads/${filename}`);
      }
    });

    const headerRow = sheet.getRow(1);
    const rows = [];

    sheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;
      const data = {};
      headerRow.eachCell((cell, colNumber) => {
        const header = cell.text.trim();
        const value = row.getCell(colNumber).value;
        data[header] = value;
      });
      if (data["Name"] && String(data["Name"]).trim() !== "") rows.push({ ...data, rowNumber });
    });

    console.log(`🧾 Found ${rows.length} data rows in Excel`);

    const imported = [];
    const failed = [];

    for (const row of rows) {
      try {
        const safe = (val, fallback = "-") => {
          if (typeof val === "string" && val.trim()) return val.trim();
          if (typeof val === "number" && !isNaN(val)) return val;
          return fallback;
        };

        let inputId = row["Mongo ID"];
        let normalizedId = null;

        if (typeof inputId === "string") {
          try {
            const parsed = JSON.parse(inputId);
            if (parsed && parsed.$oid && isValidObjectId(parsed.$oid)) normalizedId = parsed.$oid;
            else if (isValidObjectId(inputId)) normalizedId = inputId;
          } catch {
            if (isValidObjectId(inputId)) normalizedId = inputId;
          }
        }

        const affiliatedById = await resolveFieldId(AffiliatedBy, row["Affiliated By"]);
        const ownershipId = await resolveFieldId(Ownership, row["Ownership"]);
        const streamIds = await resolveMultipleFieldIds(Stream, row["Streams"], true);
        const approvalIds = await resolveMultipleFieldIds(Approval, row["Approvals"], false);
        const examIds = await resolveMultipleFieldIds(ExamsAccepted, row["Exam Expected"], false);

        if (!affiliatedById || !ownershipId) {
          failed.push({ college: row["Name"], error: `${!affiliatedById ? "Affiliated By" : "Ownership"} not found.` });
          continue;
        }

        const imagePath = imageMap.get(row.rowNumber) || safe(row["Image"], "");
        const email = extractEmail(row["Contact Email"]);

        // Parse contact numbers and log
        const contactNumbers = parseContactNumbers(row["Contact Numbers"]);
        console.log(`Contact numbers for college "${row["Name"]}":`, contactNumbers);

        const collegeData = {
          name: safe(row["Name"]),
          description: stripHtml(safe(row["Description"], "")),
          about: stripHtml(safe(row["About"], "")),
          state: safe(row["State"]),
          city: safe(row["City"]),
          address: safe(row["Address"]),
          location: safe(row["Location"]),
          rank: Number(row["Rank"]) || 0,
          fees: Number(row["Fees"]) || 0,
          avgPackage: Number(row["Avg Package"]) || 0,
          image: imagePath,
          imageGallery: formatImages(row["Image Gallery"]),
          website: safe(row["Website"]),
          contactNumbers, // ✅ include parsed & validated array
          contactEmail: /^\S+@\S+\.\S+$/.test(email) ? email : undefined,
          affiliatedby: affiliatedById,
          ownership: ownershipId,
          stream: streamIds,
          approvel: approvalIds,
          examExpected: examIds,
          featured: ["true", "1", "yes"].includes(String(row["Featured"]).toLowerCase()),
        };

        if (normalizedId) {
          const existing = await College.findById(normalizedId);
          if (existing) {
            collegeData.slug = existing.slug;
            const updated = await College.findByIdAndUpdate(normalizedId, collegeData, { new: true });
            imported.push(updated);
            console.log(`🔄 Updated existing college: ${updated.name}`);
            continue;
          } else {
            failed.push({ college: normalizedId, error: "No college found with provided _id." });
            continue;
          }
        }

        collegeData.slug = await generateUniqueSlug(row["Name"]);
        const newCollege = new College(collegeData);
        await newCollege.save();
        imported.push(newCollege);
        console.log(`✅ Created new college: ${newCollege.name}`);
      } catch (err) {
        failed.push({ college: row["Name"] || `Row ${row.rowNumber}`, error: err.message });
      }
    }

    fs.unlinkSync(req.file.path);
    console.log("🧹 Temporary file deleted after import.");

    console.log(`✅ Import finished! Created: ${imported.length}, Updated: ${imported.filter(c => c._id).length}, Failed: ${failed.length}`);

    res.status(201).json({
      message: "Import completed.",
      successCount: imported.length,
      failedCount: failed.length,
      failedColleges: failed,
    });
  } catch (err) {
    console.error("❌ Excel import error:", err);
    res.status(500).json({ error: "Failed to import colleges", details: err.message });
  }
};

// Export default for route
module.exports = { importCollegeFromExcel };


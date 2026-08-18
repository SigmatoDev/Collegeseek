const ExcelJS = require("exceljs");
const fs = require("fs");
const slugify = require("slugify");
const { v4: uuidv4 } = require("uuid");
const axios = require("axios");
const mongoose = require("mongoose");

const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const College = require("../../models/admin/collegemodel");
const AffiliatedBy = require("../../models/admin/affiliatedBy");
const Ownership = require("../../models/admin/ownerShip");
const Stream = require("../../models/admin/streams");
const Approval = require("../../models/admin/approvels");
const ExamsAccepted = require("../../models/admin/examExpected");

// ============================================================
// S3 CONFIG
// ============================================================

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

// ============================================================
// HELPERS
// ============================================================

const generateUniqueSlug = async (name) => {
  const baseSlug = slugify(name, {
    lower: true,
    strict: true,
  });

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

  if (typeof val === "number" || typeof val === "boolean") {
    return String(val);
  }

  if (val instanceof Date) {
    return val.toISOString();
  }

  if (Array.isArray(val)) {
    return val
      .map(extractText)
      .filter(Boolean)
      .join("|");
  }

  if (typeof val === "object") {
    if (Array.isArray(val.richText)) {
      return val.richText
        .map((item) => extractText(item.text))
        .join("")
        .trim();
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

const normalizeReferenceName = (value) =>
  normalizeCell(value)
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/\s+/g, " ")
    .trim();

const escapeRegExp = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildReferenceNameRegex = (value) =>
  new RegExp(
    `^${escapeRegExp(value).replace(/\s+/g, "\\s+")}$`,
    "i"
  );

// ============================================================
// SPLIT EXCEL VALUES
// ============================================================

const splitCellValues = (values) => {
  if (!values) return [];

  if (Array.isArray(values)) {
    return values
      .map(normalizeCell)
      .filter(Boolean);
  }

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
    console.log(
      "⚠️ JSON parse failed, using fallback split"
    );
  }

  return cleaned
    .replace(/^\[|\]$/g, "")
    .split("|")
    .map((value) =>
      value
        .replace(/^['"]|['"]$/g, "")
        .trim()
    )
    .filter(Boolean);
};

// ============================================================
// GALLERY IMAGE UPLOAD
// ============================================================

const uploadGalleryImages = async (imagesStr) => {
  const urls = splitCellValues(imagesStr);

  if (!urls.length) {
    return [];
  }

  const shouldReupload =
    process.env.REUPLOAD_IMPORT_GALLERY_IMAGES === "true";

  if (!shouldReupload) {
    return urls;
  }

  const uploaded = [];

  for (const url of urls) {
    try {
      const response = await axios.get(url, {
        responseType: "arraybuffer",
        timeout: 10000,
      });

      const buffer = Buffer.from(response.data);
      const filename = `${uuidv4()}.jpg`;

      const s3Url = await uploadToS3(
        buffer,
        filename,
        "image/jpeg"
      );

      uploaded.push(s3Url);
    } catch (err) {
      console.warn(
        "⚠️ Gallery image failed, keeping original URL:",
        url
      );

      uploaded.push(url);
    }
  }

  return uploaded;
};

// ============================================================
// REFERENCE RESOLVER
// ============================================================

const resolveFieldId = async (
  Model,
  name,
  createIfNotFound = true,
  cache = null
) => {
  const normalized = normalizeReferenceName(name);

  if (!normalized) {
    return null;
  }

  const code = slugify(normalized, {
    lower: true,
    strict: true,
  });

  const hasCodeField = Boolean(
    Model.schema?.path("code")
  );

  const cacheKey =
    `${Model.modelName}:` +
    `${code || normalized.toLowerCase()}`;

  if (cache?.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  let doc = null;

  if (hasCodeField && code) {
    doc = await Model.findOne({ code });
  }

  if (!doc) {
    doc = await Model.findOne({
      name: buildReferenceNameRegex(normalized),
    });
  }

  if (!doc && hasCodeField && code) {
    const existingDocs = await Model.find(
      {},
      "name code"
    );

    doc = existingDocs.find((item) => {
      const itemCode =
        normalizeReferenceName(item.code).toLowerCase();

      const itemNameCode = slugify(
        normalizeReferenceName(item.name),
        {
          lower: true,
          strict: true,
        }
      );

      return (
        itemCode === code ||
        itemNameCode === code
      );
    });
  }

  if (!doc && createIfNotFound) {
    if (hasCodeField && code) {
      doc = await Model.findOneAndUpdate(
        { code },
        {
          $setOnInsert: {
            name: normalized,
            code,
          },
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        }
      );
    } else {
      doc = new Model({
        name: normalized,
      });

      await doc.save();
    }
  }

  const id = doc?._id || null;

  if (cache && id) {
    cache.set(cacheKey, id);
  }

  return id;
};

const resolveMultipleFieldIds = async (
  Model,
  values,
  createIfNotFound = true,
  cache = null
) => {
  const ids = [];

  for (const name of splitCellValues(values)) {
    const id = await resolveFieldId(
      Model,
      name,
      createIfNotFound,
      cache
    );

    if (id) {
      ids.push(id);
    }
  }

  console.log(
    "✅ Final resolved IDs:",
    ids
  );

  return ids;
};

// ============================================================
// GENERAL HELPERS
// ============================================================

const stripHtml = (html) => {
  return normalizeCell(html)
    .replace(/<[^>]*>/g, "")
    .trim();
};

const toNumber = (value) => {
  const text = normalizeCell(value);

  if (!text) {
    return 0;
  }

  const parsed = Number(
    text.replace(/,/g, "")
  );

  return Number.isFinite(parsed)
    ? parsed
    : 0;
};

const normalizeWebsite = (value) => {
  const website = extractText(value).trim();

  if (!website) {
    return undefined;
  }

  if (
    /^(https?:\/\/|www\.)[\w.-]+(\.[a-z]{2,})(\/[\w./-]*)?$/i.test(
      website
    )
  ) {
    return website;
  }

  const withProtocol = `https://${website}`;

  if (
    /^https?:\/\/[\w.-]+(\.[a-z]{2,})(\/[\w./-]*)?$/i.test(
      withProtocol
    )
  ) {
    return withProtocol;
  }

  return undefined;
};

const getMissingFields = (row, fields) =>
  fields.filter(
    (field) => !normalizeCell(row[field])
  );

const formatImportError = (err) => {
  if (err?.code === 11000) {
    const fields = Object.keys(
      err.keyPattern ||
        err.keyValue ||
        {}
    );

    const fieldText = fields.length
      ? fields.join(", ")
      : "unique field";

    return `Duplicate ${fieldText}. This value already exists.`;
  }

  if (err?.name === "ValidationError") {
    return Object.values(
      err.errors || {}
    )
      .map((error) => error.message)
      .join("; ");
  }

  return (
    err?.message ||
    "Unknown import error"
  );
};

// ============================================================
// CONTACT PARSER
// ============================================================

const parseContactNumbers = (val) => {
  const entries = splitCellValues(val);

  if (!entries.length) {
    return [];
  }

  const normalizeContactType = (type) =>
    type.toLowerCase().includes("land")
      ? "Landline"
      : "Mobile";

  const normalizeNumber = (number) =>
    number.replace(/[^\d+-]/g, "");

  const isValidNumber = (number) =>
    /^(\+?\d{10,15})$/.test(number) ||
    /^(\d{2,5}[- ]?\d{6,8})$/.test(number);

  return entries
    .map((entry) => {
      if (entry.includes(":")) {
        const [
          type,
          ...numberParts
        ] = entry
          .split(":")
          .map((v) => v.trim());

        return {
          type: normalizeContactType(type),
          number: normalizeNumber(
            numberParts.join(":")
          ),
        };
      }

      return {
        type: "Mobile",
        number: normalizeNumber(entry),
      };
    })
    .filter(
      (contact) =>
        contact.number &&
        isValidNumber(contact.number)
    );
};

// ============================================================
// EMAIL
// ============================================================

const extractEmail = (val) => {
  const text = extractText(val);

  const match = text.match(
    /[^\s@]+@[^\s@]+\.[^\s@]+/
  );

  return match ? match[0] : "";
};

// ============================================================
// EXCEL MONGODB ID
// ============================================================

const getExcelMongoId = (row) => {
  return normalizeCell(
    row["MongoDB ID"] ||
      row["MongoDB _id"] ||
      row["Mongo ID"] ||
      row["_id"] ||
      row["College MongoDB ID"]
  );
};

// ============================================================
// EXCEL SLUG
// ============================================================

const getExcelSlug = (row) => {
  return normalizeCell(
    row["Slug"] ||
      row["slug"]
  );
};

// ============================================================
// FIND COLLEGE BY ID + SLUG
// ============================================================

const findCollegeForUpdate = async (row) => {
  const mongoId = getExcelMongoId(row);
  const excelSlug = getExcelSlug(row);

  console.log(
    "🔍 Checking update:",
    {
      mongoId,
      excelSlug,
    }
  );

  if (!mongoId && !excelSlug) {
    return {
      college: null,
      status: "NO_IDENTIFIER",
    };
  }

  if (!mongoId || !excelSlug) {
    return {
      college: null,
      status: "INCOMPLETE_IDENTIFIER",
      reason:
        "Both MongoDB ID and Slug are required for update.",
    };
  }

  if (!mongoose.Types.ObjectId.isValid(mongoId)) {
    return {
      college: null,
      status: "INVALID_ID",
      reason:
        "Invalid MongoDB ID.",
    };
  }

  const college = await College.findOne({
    _id: new mongoose.Types.ObjectId(
      mongoId
    ),
    slug: excelSlug,
  });

  if (college) {
    console.log(
      "🔄 ID + SLUG MATCH:",
      college.name
    );

    return {
      college,
      status: "MATCH",
    };
  }

  const idExists = await College.findById(
    mongoId
  );

  if (idExists) {
    return {
      college: null,
      status: "ID_SLUG_MISMATCH",
      reason:
        `MongoDB ID exists but slug does not match. Database slug: ${idExists.slug}`,
    };
  }

  const slugExists = await College.findOne({
    slug: excelSlug,
  });

  if (slugExists) {
    return {
      college: null,
      status: "SLUG_EXISTS",
      reason:
        "Slug belongs to another college.",
    };
  }

  return {
    college: null,
    status: "IDENTIFIER_NOT_FOUND",
  };
};

// ============================================================
// NORMALIZED DUPLICATE KEY
// ============================================================

const normalizeDuplicateValue = (value) => {
  return normalizeCell(value)
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
};

// ============================================================
// FIND DUPLICATE BY NAME + CITY + STATE
// ============================================================

const findDuplicateCollege = async (
  name,
  city,
  state,
  excludeId = null
) => {
  const normalizedName =
    normalizeDuplicateValue(name);

  const normalizedCity =
    normalizeDuplicateValue(city);

  const normalizedState =
    normalizeDuplicateValue(state);

  if (
    !normalizedName ||
    !normalizedCity ||
    !normalizedState
  ) {
    return null;
  }

  const query = {
    name: new RegExp(
      `^${escapeRegExp(normalizedName).replace(
        /\s+/g,
        "\\s+"
      )}$`,
      "i"
    ),
    city: new RegExp(
      `^${escapeRegExp(normalizedCity).replace(
        /\s+/g,
        "\\s+"
      )}$`,
      "i"
    ),
    state: new RegExp(
      `^${escapeRegExp(normalizedState).replace(
        /\s+/g,
        "\\s+"
      )}$`,
      "i"
    ),
  };

  if (
    excludeId &&
    mongoose.Types.ObjectId.isValid(excludeId)
  ) {
    query._id = {
      $ne: new mongoose.Types.ObjectId(
        excludeId
      ),
    };
  }

  return College.findOne(query);
};

// ============================================================
// CONTROLLER
// ============================================================

const importCollegeFromExcel = async (
  req,
  res
) => {
  console.log(
    "▶️ HIT importCollegeFromExcel API"
  );

  const uploadedFilePath =
    req.file?.path;

  try {
    // ========================================================
    // CHECK FILE
    // ========================================================

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error:
          "No Excel file uploaded.",
      });
    }

    // ========================================================
    // READ EXCEL
    // ========================================================

    const workbook =
      new ExcelJS.Workbook();

    await workbook.xlsx.readFile(
      req.file.path
    );

    const sheet =
      workbook.worksheets[0];

    if (!sheet) {
      return res.status(400).json({
        success: false,
        error:
          "Excel workbook has no worksheet.",
      });
    }

    console.log(
      "📑 Sheet:",
      sheet.name
    );

    console.log(
      "📊 Rows:",
      sheet.rowCount
    );

    const headerRow =
      sheet.getRow(1);

    // ========================================================
    // EXTRACT EMBEDDED IMAGES
    // ========================================================

    const imageMap = new Map();

    const images =
      sheet.getImages();

    for (const img of images) {
      try {
        const image =
          workbook.getImage(
            img.imageId
          ) ||
          workbook.model.media.find(
            (m) =>
              m.index === img.imageId
          );

        if (
          image &&
          image.buffer
        ) {
          const ext =
            image.type?.split("/")[1] ||
            "jpg";

          const filename =
            `${uuidv4()}.${ext}`;

          const s3Url =
            await uploadToS3(
              image.buffer,
              filename,
              image.type
            );

          const rowNumber =
            img.range.tl.nativeRow + 1;

          imageMap.set(
            rowNumber,
            s3Url
          );
        }
      } catch (imageError) {
        console.warn(
          "⚠️ Failed to upload embedded Excel image:",
          imageError.message
        );
      }
    }

    // ========================================================
    // READ EXCEL ROWS
    // ========================================================

    const rows = [];

    sheet.eachRow(
      (row, rowNumber) => {
        if (rowNumber === 1) {
          return;
        }

        const data = {};

        headerRow.eachCell(
          (cell, colNumber) => {
            const header =
              normalizeCell(
                cell.value ||
                  cell.text
              );

            const value =
              row.getCell(
                colNumber
              ).value;

            if (header) {
              data[header] = value;
            }
          }
        );

        if (
          normalizeCell(
            data["Name"]
          )
        ) {
          rows.push({
            ...data,
            rowNumber,
          });
        }
      }
    );

    console.log(
      "✅ Rows found:",
      rows.length
    );

    // ========================================================
    // RESULT ARRAYS
    // ========================================================

    const imported = [];
    const updated = [];
    const failed = [];

    const referenceCache =
      new Map();

    // ========================================================
    // PROCESS EACH ROW
    // ========================================================

    for (const row of rows) {
      try {
        console.log(
          "\n========================================"
        );

        console.log(
          `📄 Processing Excel row ${row.rowNumber}`
        );

        console.log(
          "========================================"
        );

        const name =
          normalizeCell(
            row["Name"]
          );

        const city =
          normalizeCell(
            row["City"]
          );

        const state =
          normalizeCell(
            row["State"]
          );

        // ====================================================
        // REQUIRED FIELDS
        // ====================================================

        const missingFields =
          getMissingFields(
            row,
            [
              "Name",
              "Description",
              "State",
              "City",
              "Address",
              "Affiliated By",
              "Ownership",
              "Contact Email",
            ]
          );

        if (
          missingFields.length
        ) {
          failed.push({
            rowNumber:
              row.rowNumber,

            college:
              name ||
              `Row ${row.rowNumber}`,

            error:
              `Missing required fields: ${missingFields.join(
                ", "
              )}`,
          });

          continue;
        }

        // ====================================================
        // CHECK UPDATE IDENTIFIER
        // ====================================================

        const updateCheck =
          await findCollegeForUpdate(
            row
          );

        // ====================================================
        // ID/SLUG PROVIDED BUT INVALID
        // ====================================================

        if (
          updateCheck.status ===
            "INCOMPLETE_IDENTIFIER" ||
          updateCheck.status ===
            "INVALID_ID" ||
          updateCheck.status ===
            "ID_SLUG_MISMATCH"
        ) {
          failed.push({
            rowNumber:
              row.rowNumber,

            college: name,

            error:
              updateCheck.reason ||
              "Invalid update identifier.",
          });

          console.log(
            "⏭️ SKIPPED:",
            name,
            updateCheck.reason
          );

          continue;
        }

        // ====================================================
        // RESOLVE REFERENCES
        // ====================================================

        const affiliatedById =
          await resolveFieldId(
            AffiliatedBy,
            row["Affiliated By"],
            true,
            referenceCache
          );

        const ownershipId =
          await resolveFieldId(
            Ownership,
            row["Ownership"],
            true,
            referenceCache
          );

        const streamIds =
          await resolveMultipleFieldIds(
            Stream,
            row["Streams"],
            false,
            referenceCache
          );

        const approvalIds =
          await resolveMultipleFieldIds(
            Approval,
            row["Approvals"],
            false,
            referenceCache
          );

        const examIds =
          await resolveMultipleFieldIds(
            ExamsAccepted,
            row["Exam Expected"],
            false,
            referenceCache
          );

        if (
          !affiliatedById ||
          !ownershipId
        ) {
          failed.push({
            rowNumber:
              row.rowNumber,

            college: name,

            error:
              "Missing required references",
          });

          continue;
        }

        // ====================================================
        // IMAGES
        // ====================================================

        const excelImage =
          imageMap.get(
            row.rowNumber
          );

        const excelImageUrl =
          extractText(
            row["Image"]
          );

        const imagePath =
          excelImage ||
          excelImageUrl ||
          "";

        const galleryImages =
          await uploadGalleryImages(
            row["Image Gallery"]
          );

        // ====================================================
        // COMMON COLLEGE DATA
        // ====================================================

        const collegeData = {
          name,

          description:
            stripHtml(
              row["Description"] ||
                ""
            ),

          about:
            stripHtml(
              row["About"] ||
                ""
            ),

          state,

          city,

          stream:
            streamIds,

          approvel:
            approvalIds,

          examExpected:
            examIds,

          affiliatedby:
            affiliatedById,

          ownership:
            ownershipId,

          address:
            normalizeCell(
              row["Address"]
            ),

          location:
            normalizeCell(
              row["Location"]
            ),

          rank:
            toNumber(
              row["Rank"]
            ),

          fees:
            toNumber(
              row["Fees"]
            ),

          avgPackage:
            toNumber(
              row["Avg Package"]
            ),

          website:
            normalizeWebsite(
              row["Website"]
            ),

          contactNumbers:
            parseContactNumbers(
              row["Contact Numbers"]
            ),

          contactEmail:
            extractEmail(
              row["Contact Email"]
            ),

          featured:
            [
              "yes",
              "true",
              "1",
            ].includes(
              normalizeCell(
                row["Featured"]
              ).toLowerCase()
            ),
        };

        // ====================================================
        // IMAGE HANDLING
        // ====================================================

        if (imagePath) {
          collegeData.image =
            imagePath;
        }

        if (
          galleryImages &&
          galleryImages.length > 0
        ) {
          collegeData.imageGallery =
            galleryImages;
        }

        // ====================================================
        // UPDATE EXISTING COLLEGE
        // ====================================================

        if (
          updateCheck.status ===
            "MATCH" &&
          updateCheck.college
        ) {
          const existingCollege =
            updateCheck.college;

          console.log(
            "🔄 Updating:",
            existingCollege.name
          );

          // -----------------------------------------------
          // Duplicate check excluding itself
          // -----------------------------------------------

          const duplicate =
            await findDuplicateCollege(
              name,
              city,
              state,
              existingCollege._id
            );

          if (duplicate) {
            failed.push({
              rowNumber:
                row.rowNumber,

              college: name,

              error:
                `Duplicate college already exists: ${duplicate.name} (${duplicate._id})`,
            });

            console.log(
              "⏭️ UPDATE SKIPPED - DUPLICATE:",
              name
            );

            continue;
          }

          // -----------------------------------------------
          // Never change _id
          // Never change slug
          // -----------------------------------------------

          Object.assign(
            existingCollege,
            collegeData
          );

          await existingCollege.save();

          updated.push(
            existingCollege
          );

          console.log(
            "✅ UPDATED:",
            existingCollege.name
          );

          continue;
        }

        // ====================================================
        // CREATE MODE
        // ====================================================

        console.log(
          "🆕 CREATE CHECK:",
          name
        );

        // ====================================================
        // DUPLICATE CHECK
        // NAME + CITY + STATE
        // ====================================================

        const duplicate =
          await findDuplicateCollege(
            name,
            city,
            state
          );

        if (duplicate) {
          failed.push({
            rowNumber:
              row.rowNumber,

            college: name,

            error:
              `Duplicate college already exists: ${duplicate.name} (${duplicate._id})`,
          });

          console.log(
            "⏭️ CREATE SKIPPED - DUPLICATE:",
            name
          );

          continue;
        }

        // ====================================================
        // SLUG
        // ====================================================

        const excelSlug =
          getExcelSlug(row);

        let newSlug = "";

        if (excelSlug) {
          const slugOwner =
            await College.findOne({
              slug: excelSlug,
            });

          if (!slugOwner) {
            newSlug =
              excelSlug;
          } else {
            console.log(
              `⚠️ Slug "${excelSlug}" already exists. Generating unique slug.`
            );

            newSlug =
              await generateUniqueSlug(
                name
              );
          }
        } else {
          newSlug =
            await generateUniqueSlug(
              name
            );
        }

        collegeData.slug =
          newSlug;

        // ====================================================
        // CREATE NEW COLLEGE
        // ====================================================

        const newCollege =
          new College(
            collegeData
          );

        await newCollege.save();

        imported.push(
          newCollege
        );

        console.log(
          "✅ CREATED:",
          newCollege.name
        );
      } catch (err) {
        const errorMessage =
          formatImportError(err);

        console.log(
          "❌ ERROR:",
          normalizeCell(
            row["Name"]
          ),
          errorMessage
        );

        failed.push({
          rowNumber:
            row.rowNumber,

          college:
            normalizeCell(
              row["Name"]
            ),

          error:
            errorMessage,
        });
      }
    }

    // ========================================================
    // FINAL RESPONSE
    // ========================================================

    return res.status(201).json({
      success: true,

      message:
        "College import completed",

      createdCount:
        imported.length,

      updatedCount:
        updated.length,

      failedCount:
        failed.length,

      totalProcessed:
        rows.length,

      createdColleges:
        imported.map(
          (college) => ({
            id:
              college._id,

            name:
              college.name,

            slug:
              college.slug,
          })
        ),

      updatedColleges:
        updated.map(
          (college) => ({
            id:
              college._id,

            name:
              college.name,

            slug:
              college.slug,
          })
        ),

      failedColleges:
        failed,

      failed,
    });
  } catch (err) {
    console.error(
      "❌ IMPORT FAILED:",
      err
    );

    return res.status(500).json({
      success: false,

      error:
        "Failed to import colleges",

      details:
        err.message,
    });
  } finally {
    // ========================================================
    // DELETE TEMPORARY EXCEL FILE
    // ========================================================

    if (
      uploadedFilePath &&
      fs.existsSync(
        uploadedFilePath
      )
    ) {
      try {
        fs.unlinkSync(
          uploadedFilePath
        );

        console.log(
          "🗑️ Temporary Excel file deleted."
        );
      } catch (deleteError) {
        console.warn(
          "⚠️ Could not delete temporary Excel file:",
          deleteError.message
        );
      }
    }
  }
};

module.exports = {
  importCollegeFromExcel,
};
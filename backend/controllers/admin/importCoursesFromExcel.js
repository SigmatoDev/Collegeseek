const ExcelJS = require("exceljs");
const mongoose = require("mongoose");

const Course = require("../../models/admin/courseModel");
const College = require("../../models/admin/collegemodel");
const Category = require("../../models/admin/coursesList");
const ProgramMode = require("../../models/admin/programMode");
const Specialization = require("../../models/admin/specialization");
const Stream = require("../../models/admin/streams");

// Safely extract Excel cell values
const extractText = (value) => {
  if (value === null || value === undefined) return "";

  if (value instanceof Date) return value;

  if (typeof value === "object") {
    if (Array.isArray(value.richText)) {
      return value.richText
        .map((item) => item.text || "")
        .join("")
        .trim();
    }

    return extractText(value.text ?? value.result ?? value.hyperlink ?? "");
  }

  return String(value).trim();
};

const normalizeCell = (value) => {
  const result = extractText(value);

  return result instanceof Date ? result : String(result).trim();
};

// Normalize Excel column headers
const normalizeHeader = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

// Safely parse numbers
const parseNumber = (value) => {
  const text = normalizeCell(value);

  if (text === "" || text === null) {
    return undefined;
  }

  const cleaned = String(text).replace(/,/g, "").replace(/₹/g, "").trim();

  const parsed = Number(cleaned);

  return Number.isFinite(parsed) ? parsed : undefined;
};

// Parse fees year: "2 Years" -> 2
const parseYear = (value) => {
  const text = normalizeCell(value);

  if (!text) return undefined;

  const match = String(text).match(/^(\d+(?:\.\d+)?)\s*(?:years?|yrs?)?$/i);

  if (!match) return undefined;

  return Number(match[1]);
};

// Safely parse dates
const parseDate = (value) => {
  if (!value) return null;

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  const text = normalizeCell(value);

  if (!text) return null;

  const parsed = new Date(text);

  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

// Escape regex special characters
const escapeRegex = (value) =>
  String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Exact case-insensitive matching
const exactRegex = (value) =>
  new RegExp(`^${escapeRegex(String(value).trim())}$`, "i");

// Generate URL-friendly slug
const normalizeSlug = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// Generate unique course slug
const generateSlug = async (specializationName, college, state, city) => {
  const baseSlug =
    normalizeSlug(`${specializationName}-${college.name}-${state}-${city}`) ||
    `course-${Date.now()}`;

  let slug = baseSlug;
  let counter = 1;

  while (await Course.findOne({ slug })) {
    slug = `${baseSlug}-${counter++}`;
  }

  return slug;
};

// Find database reference by name
const findReferenceByName = async (Model, name) => {
  const normalized = normalizeCell(name);

  if (!normalized) return null;

  return Model.findOne({
    name: exactRegex(normalized),
  });
};

// Parse college export format:
// "College Name (Karnataka, Bengaluru)"
const parseCollegeName = (rawName) => {
  const cleanName = normalizeCell(rawName);

  const match = cleanName.match(/^(.+?)\s*\(([^,]+),\s*([^)]+)\)$/);

  if (!match) {
    return {
      name: cleanName,
      state: "",
      city: "",
    };
  }

  return {
    name: match[1].trim(),
    state: match[2].trim(),
    city: match[3].trim(),
  };
};

// Resolve college
const findCollege = async (rawCollegeName, stateFromExcel, cityFromExcel) => {
  const parsed = parseCollegeName(rawCollegeName);

  if (!parsed.name) return null;

  const state = normalizeCell(stateFromExcel) || parsed.state;

  const city = normalizeCell(cityFromExcel) || parsed.city;

  // First attempt: exact college + location
  if (state && city) {
    const college = await College.findOne({
      name: exactRegex(parsed.name),
      state: exactRegex(state),
      city: exactRegex(city),
    });

    if (college) return college;
  }

  // Fallback: match by college name
  return College.findOne({
    name: exactRegex(parsed.name),
  });
};

// Resolve streams
const resolveStreams = async (rawValue) => {
  const text = normalizeCell(rawValue);

  if (!text) return [];

  const names = text
    .split("|")
    .map((name) => name.trim())
    .filter(Boolean);

  const streamIds = [];

  for (const name of names) {
    const stream = await findReferenceByName(Stream, name);

    if (stream) {
      streamIds.push(stream._id);
    }
  }

  return streamIds;
};

// Format MongoDB errors
const formatImportError = (error) => {
  if (error?.code === 11000) {
    return "Duplicate course or slug.";
  }

  if (error?.name === "ValidationError") {
    return Object.values(error.errors || {})
      .map((item) => item.message)
      .join("; ");
  }

  return error?.message || "Unknown import error";
};

// ========================================
// MAIN EXCEL IMPORT CONTROLLER
// ========================================

exports.importCoursesFromExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded.",
        imported: 0,
        updated: 0,
        failedCourses: [],
      });
    }

    const workbook = new ExcelJS.Workbook();

    await workbook.xlsx.readFile(req.file.path);

    // Find worksheet
    const worksheet =
      workbook.getWorksheet("Courses") ||
      workbook.getWorksheet("Sheet1") ||
      workbook.worksheets.find((sheet) =>
        sheet.name.toLowerCase().includes("course"),
      ) ||
      workbook.worksheets[0];

    if (!worksheet) {
      return res.status(400).json({
        message: "Excel worksheet not found.",
        imported: 0,
        updated: 0,
        failedCourses: [],
      });
    }

    // Build header map
    const headerMap = {};

    worksheet.getRow(1).eachCell((cell, columnNumber) => {
      const header = normalizeHeader(cell.value ?? cell.text);

      if (header) {
        headerMap[header] = columnNumber;
      }
    });

    // Get cell value using column names
    const getVal = (row, ...candidateNames) => {
      for (const name of candidateNames) {
        const columnNumber = headerMap[normalizeHeader(name)];

        if (!columnNumber) continue;

        const value = row.getCell(columnNumber).value;

        if (
          value !== null &&
          value !== undefined &&
          normalizeCell(value) !== ""
        ) {
          return value;
        }
      }

      return undefined;
    };

    const importedCourses = [];
    const updatedCourses = [];
    const failedCourses = [];

    // Process each Excel row
    for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
      const row = worksheet.getRow(rowNumber);

      if (!row.hasValues) continue;

      let specializationName = "";

      try {
        // --------------------------
        // EXTRACT EXCEL VALUES
        // --------------------------

        const mongoId = normalizeCell(
          getVal(row, "Mongo ID", "MongoDB ID", "_id", "id"),
        );

        let slug = normalizeSlug(getVal(row, "Slug"));

        specializationName = normalizeCell(
          getVal(row, "Specialization", "Name", "Course"),
        );

        const description = normalizeCell(getVal(row, "Description"));

        const rawCollegeName = getVal(row, "College", "College Name");

        const stateInExcel = normalizeCell(getVal(row, "State"));

        const cityInExcel = normalizeCell(getVal(row, "City"));

        const categoryName = normalizeCell(getVal(row, "Category"));

        const programModeName = normalizeCell(
          getVal(row, "Program Mode", "programMode"),
        );

        const duration = normalizeCell(getVal(row, "Duration"));

        const feesAmount = parseNumber(
          getVal(row, "Fees Amount", "fees_amount", "Fees"),
        );

        const feesYear = parseYear(
          getVal(row, "Fees Year", "fees_year", "Year"),
        );

        const currency = normalizeCell(getVal(row, "Currency")) || "INR";

        const eligibility = normalizeCell(getVal(row, "Eligibility"));

        const applicationStart = parseDate(
          getVal(row, "Application Start", "app_start"),
        );

        const applicationEnd = parseDate(
          getVal(row, "Application End", "app_end"),
        );

        const medianSalary = parseNumber(
          getVal(row, "Median Salary", "median_salary"),
        );

        const placementRate = parseNumber(
          getVal(row, "Placement Rate", "placement_rate"),
        );

        const intakeMale = parseNumber(
          getVal(row, "Intake Male", "intake_male"),
        );

        const intakeFemale = parseNumber(
          getVal(row, "Intake Female", "intake_female"),
        );

        const intakeTotal = parseNumber(
          getVal(row, "Intake Total", "intake_total"),
        );

        const entranceExam = normalizeCell(
          getVal(row, "Entrance Exam", "entrance_exam"),
        );

        const streamsRaw = getVal(row, "Streams", "Stream");

        // --------------------------
        // BROCHURE LINK
        // --------------------------

        const brochureRaw = getVal(
          row,
          "Brochure Link",
          "brochure_link",
          "Brochure",
        );

        let brochureLink = "";

        if (brochureRaw) {
          if (typeof brochureRaw === "object") {
            brochureLink = brochureRaw.hyperlink || brochureRaw.text || "";
          } else {
            brochureLink = String(brochureRaw).trim();
          }
        }

        // --------------------------
        // VALIDATE REQUIRED VALUES
        // --------------------------

        const errors = [];

        if (!specializationName) {
          errors.push("Specialization is required");
        }

        if (!normalizeCell(rawCollegeName)) {
          errors.push("College is required");
        }

        if (!categoryName) {
          errors.push("Category is required");
        }

        if (!programModeName) {
          errors.push("Program Mode is required");
        }

        if (feesAmount === undefined) {
          errors.push("Fees Amount must be a valid number");
        }

        if (feesYear === undefined) {
          errors.push("Fees Year must be a valid number");
        }

        if (errors.length) {
          failedCourses.push({
            rowNumber,
            course: specializationName || `Row ${rowNumber}`,
            error: errors.join("; "),
          });

          continue;
        }

        // --------------------------
        // RESOLVE COLLEGE
        // --------------------------

        const college = await findCollege(
          rawCollegeName,
          stateInExcel,
          cityInExcel,
        );

        if (!college) {
          failedCourses.push({
            rowNumber,
            course: specializationName,
            error: `College not found: ` + normalizeCell(rawCollegeName),
          });

          continue;
        }

        // --------------------------
        // RESOLVE REFERENCES
        // --------------------------

        const category = await findReferenceByName(Category, categoryName);

        const programMode = await findReferenceByName(
          ProgramMode,
          programModeName,
        );

        const specialization = await findReferenceByName(
          Specialization,
          specializationName,
        );

        const streamIds = await resolveStreams(streamsRaw);

        const missingReferences = [];

        if (!category) {
          missingReferences.push("Category");
        }

        if (!programMode) {
          missingReferences.push("Program Mode");
        }

        if (!specialization) {
          missingReferences.push("Specialization");
        }

        if (missingReferences.length) {
          failedCourses.push({
            rowNumber,
            course: specializationName,
            error: "Missing reference(s): " + missingReferences.join(", "),
          });

          continue;
        }

        // --------------------------
        // RESOLVE LOCATION
        // --------------------------

        const finalState = stateInExcel || normalizeCell(college.state);

        const finalCity = cityInExcel || normalizeCell(college.city);

        if (!finalState || !finalCity) {
          failedCourses.push({
            rowNumber,
            course: specializationName,
            error:
              "City or State is missing. " +
              "Provide values in Excel or update the college record.",
          });

          continue;
        }

        // --------------------------
        // FIND EXISTING COURSE
        // --------------------------

        let course = null;

        if (mongoId && mongoose.Types.ObjectId.isValid(mongoId)) {
          course = await Course.findById(mongoId);
        }

        if (!course && slug) {
          course = await Course.findOne({
            slug,
          });
        }

        // --------------------------
        // GENERATE SLUG
        // --------------------------

        if (!slug) {
          slug =
            course?.slug ||
            (await generateSlug(
              specializationName,
              college,
              finalState,
              finalCity,
            ));
        }

        // --------------------------
        // BUILD COURSE DATA
        // --------------------------

        const courseData = {
          slug,

          name: specializationName,

          specialization: specialization._id,

          description,

          college_id: college._id,

          state: finalState,

          city: finalCity,

          category: category._id,

          programMode: programMode._id,

          duration,

          fees: {
            amount: feesAmount,
            year: feesYear,
            currency,
          },

          eligibility,

          application_dates: {
            start_date: applicationStart,
            end_date: applicationEnd,
          },

          placements: {
            median_salary: medianSalary,
            placement_rate: placementRate,
          },

          intake_capacity: {
            male: intakeMale,
            female: intakeFemale,
            total: intakeTotal,
          },

          entrance_exam: entranceExam,

          streams: streamIds,

          brochure_link: brochureLink,
        };

        // --------------------------
        // UPDATE OR CREATE
        // --------------------------

        if (course) {
          Object.assign(course, courseData);

          await course.save();

          updatedCourses.push({
            rowNumber,
            id: course._id,
            slug: course.slug,
            course: specializationName,
          });
        } else {
          const createdCourse = await Course.create(courseData);

          importedCourses.push({
            rowNumber,
            id: createdCourse._id,
            slug: createdCourse.slug,
            course: specializationName,
          });
        }
      } catch (error) {
        failedCourses.push({
          rowNumber,
          course: specializationName || `Row ${rowNumber}`,
          error: formatImportError(error),
        });
      }
    }

    // --------------------------
    // FINAL RESPONSE
    // --------------------------

    const hasFailures = failedCourses.length > 0;

    return res.status(hasFailures ? 400 : 200).json({
      message: hasFailures
        ? "Some courses failed to import"
        : "Courses imported successfully",

      imported: importedCourses.length,

      updated: updatedCourses.length,

      failedCount: failedCourses.length,

      totalProcessed:
        importedCourses.length + updatedCourses.length + failedCourses.length,

      importedCourses,

      updatedCourses,

      failedCourses,
    });
  } catch (error) {
    console.error("Course import failed:", error);

    return res.status(500).json({
      message: "Failed to import courses",
      error: formatImportError(error),
      imported: 0,
      updated: 0,
      failedCourses: [],
    });
  }
};

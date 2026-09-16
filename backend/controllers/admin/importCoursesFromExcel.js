const ExcelJS = require("exceljs");
const fs = require("fs");
const mongoose = require("mongoose");

const Course = require("../../models/admin/courseModel");
const College = require("../../models/admin/collegemodel");
const Category = require("../../models/admin/coursesList");
const ProgramMode = require("../../models/admin/programMode");
const Specialization = require("../../models/admin/specialization");
const Stream = require("../../models/admin/streams");

const extractText = (value) => {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value).trim();
  }
  if (value instanceof Date) return value;

  if (typeof value === "object") {
    if (Array.isArray(value.richText)) {
      return value.richText.map((item) => extractText(item.text)).join("").trim();
    }

    return extractText(
      value.text ??
        value.result ??
        value.hyperlink ??
        value.formula ??
        value.sharedFormula,
    );
  }

  return "";
};

const normalizeCell = (value) => {
  const text = extractText(value);
  return text instanceof Date ? text : String(text || "").trim();
};

const normalizeHeader = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

const parseNumber = (value) => {
  const text = normalizeCell(value);
  if (text === "") return undefined;

  const parsed = Number(String(text).replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : undefined;
};

const parseDate = (value) => {
  if (!value) return null;
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;

  const text = normalizeCell(value);
  if (!text) return null;

  const parsed = new Date(text);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const escapeRegex = (value) =>
  String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildExactRegex = (value) =>
  new RegExp(`^${escapeRegex(value).replace(/\s+/g, "\\s+")}$`, "i");

const normalizeSlug = (value) =>
  normalizeCell(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const splitValues = (value) => {
  const text = normalizeCell(value);
  if (!text) return [];

  return text
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean);
};

const getWorksheet = (workbook) => {
  return (
    workbook.getWorksheet("Courses") ||
    workbook.getWorksheet("Sheet1") ||
    workbook.worksheets.find((sheet) =>
      sheet.name.toLowerCase().includes("course"),
    ) ||
    workbook.worksheets[0]
  );
};

const buildHeaderMap = (worksheet) => {
  const headerMap = {};
  const headerRow = worksheet.getRow(1);

  headerRow.eachCell((cell, columnNumber) => {
    const key = normalizeHeader(cell.value ?? cell.text);
    if (key) headerMap[key] = columnNumber;
  });

  return headerMap;
};

const getCellValue = (row, headerMap, ...candidateNames) => {
  for (const name of candidateNames) {
    const columnNumber = headerMap[normalizeHeader(name)];
    if (!columnNumber) continue;

    const value = row.getCell(columnNumber).value;
    if (value !== null && value !== undefined && normalizeCell(value) !== "") {
      return value;
    }
  }

  return undefined;
};

const generateSlug = async (specializationName, college, state, city) => {
  const baseSlug =
    normalizeSlug(`${specializationName || "course"}-${college.name}-${state}-${city}`) ||
    `course-${Date.now()}`;

  let slug = baseSlug;
  let counter = 1;

  while (await Course.findOne({ slug })) {
    slug = `${baseSlug}-${counter++}`;
  }

  return slug;
};

const findReferenceByName = async (Model, name) => {
  const normalized = normalizeCell(name);
  if (!normalized) return null;

  return Model.findOne({
    name: buildExactRegex(normalized),
  });
};

const parseCollegeName = (rawCollegeName) => {
  const cleanName = normalizeCell(rawCollegeName);
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

const findCollege = async (rawCollegeName, stateFromExcel, cityFromExcel) => {
  const parsedCollege = parseCollegeName(rawCollegeName);
  if (!parsedCollege.name) return null;

  const state = normalizeCell(stateFromExcel) || parsedCollege.state;
  const city = normalizeCell(cityFromExcel) || parsedCollege.city;

  if (state && city) {
    const exactCollege = await College.findOne({
      name: buildExactRegex(parsedCollege.name),
      state: buildExactRegex(state),
      city: buildExactRegex(city),
    });

    if (exactCollege) return exactCollege;
  }

  const byName = await College.findOne({
    name: buildExactRegex(parsedCollege.name),
  });

  if (byName) return byName;

  const strippedName = parsedCollege.name.replace(/\(.*?\)/g, "").trim();
  if (!strippedName || strippedName === parsedCollege.name) return null;

  return College.findOne({
    name: buildExactRegex(strippedName),
  });
};

const resolveStreams = async (streamsRaw) => {
  const streamIds = [];

  for (const streamName of splitValues(streamsRaw)) {
    const stream = await findReferenceByName(Stream, streamName);
    if (stream) streamIds.push(stream._id);
  }

  return streamIds;
};

const formatImportError = (error) => {
  if (error?.code === 11000) {
    const fields = Object.keys(error.keyPattern || error.keyValue || {});
    return `Duplicate ${fields.join(", ") || "value"}.`;
  }

  if (error?.name === "ValidationError") {
    return Object.values(error.errors || {})
      .map((item) => item.message)
      .join("; ");
  }

  return error?.message || "Unknown import error";
};

const importCoursesFromExcel = async (req, res) => {
  const uploadedFilePath = req.file?.path;

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

    const worksheet = getWorksheet(workbook);
    if (!worksheet) {
      return res.status(400).json({
        message: "Excel workbook has no worksheet.",
        imported: 0,
        updated: 0,
        failedCourses: [],
      });
    }

    const headerMap = buildHeaderMap(worksheet);
    const importedCourses = [];
    const updatedCourses = [];
    const failedCourses = [];

    for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
      const row = worksheet.getRow(rowNumber);
      const specializationName = normalizeCell(
        getCellValue(row, headerMap, "Specialization", "Name", "Course"),
      );

      if (!specializationName && !row.hasValues) continue;

      try {
        const mongoId = normalizeCell(
          getCellValue(row, headerMap, "Mongo ID", "MongoDB ID", "_id", "id"),
        );
        let slug = normalizeSlug(getCellValue(row, headerMap, "Slug"));

        const description = normalizeCell(
          getCellValue(row, headerMap, "Description"),
        );
        const rawCollegeName = getCellValue(row, headerMap, "College", "College Name");
        const stateInExcel = getCellValue(row, headerMap, "State");
        const cityInExcel = getCellValue(row, headerMap, "City");
        const categoryName = getCellValue(row, headerMap, "Category");
        const programModeName = getCellValue(row, headerMap, "Program Mode", "programMode");
        const duration = normalizeCell(getCellValue(row, headerMap, "Duration"));
        const feesAmount = parseNumber(
          getCellValue(row, headerMap, "Fees Amount", "fees_amount", "Fees"),
        );
        const feesYear = parseNumber(
          getCellValue(row, headerMap, "Fees Year", "fees_year", "Year"),
        );
        const currency =
          normalizeCell(getCellValue(row, headerMap, "Currency")) || "INR";
        const eligibility = normalizeCell(getCellValue(row, headerMap, "Eligibility"));
        const applicationStart = parseDate(
          getCellValue(row, headerMap, "Application Start", "app_start"),
        );
        const applicationEnd = parseDate(
          getCellValue(row, headerMap, "Application End", "app_end"),
        );
        const medianSalary = parseNumber(
          getCellValue(row, headerMap, "Median Salary", "median_salary"),
        );
        const placementRate = parseNumber(
          getCellValue(row, headerMap, "Placement Rate", "placement_rate"),
        );
        const intakeMale = parseNumber(
          getCellValue(row, headerMap, "Intake Male", "intake_male"),
        );
        const intakeFemale = parseNumber(
          getCellValue(row, headerMap, "Intake Female", "intake_female"),
        );
        const intakeTotal = parseNumber(
          getCellValue(row, headerMap, "Intake Total", "intake_total"),
        );
        const entranceExam = normalizeCell(
          getCellValue(row, headerMap, "Entrance Exam", "entrance_exam"),
        );
        const streamsRaw = getCellValue(row, headerMap, "Streams", "Stream");
        const brochureLink = normalizeCell(
          getCellValue(row, headerMap, "Brochure Link", "brochure_link", "Brochure"),
        );

        const college = await findCollege(rawCollegeName, stateInExcel, cityInExcel);
        if (!college) {
          failedCourses.push({
            rowNumber,
            course: specializationName || `Row ${rowNumber}`,
            error: `College not found: ${normalizeCell(rawCollegeName)}`,
          });
          continue;
        }

        const category = await findReferenceByName(Category, categoryName);
        const programMode = await findReferenceByName(ProgramMode, programModeName);
        const specialization = await findReferenceByName(
          Specialization,
          specializationName,
        );
        const streamIds = await resolveStreams(streamsRaw);

        const missingReferences = [];
        if (!category) missingReferences.push("Category");
        if (!programMode) missingReferences.push("Program Mode");
        if (!specialization) missingReferences.push("Specialization");

        if (missingReferences.length) {
          failedCourses.push({
            rowNumber,
            course: specializationName || `Row ${rowNumber}`,
            error: `Missing reference(s): ${missingReferences.join(", ")}`,
          });
          continue;
        }

        const finalState = normalizeCell(stateInExcel) || college.state;
        const finalCity = normalizeCell(cityInExcel) || college.city;

        let course = null;
        if (mongoId && mongoose.Types.ObjectId.isValid(mongoId)) {
          course = await Course.findById(mongoId);
        }

        if (!course && slug) {
          course = await Course.findOne({ slug });
        }

        if (!slug) {
          slug =
            course?.slug ||
            (await generateSlug(specializationName, college, finalState, finalCity));
        }

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

    const statusCode = failedCourses.length ? 400 : 200;

    return res.status(statusCode).json({
      message: failedCourses.length
        ? "Some courses failed to import"
        : "Courses imported successfully",
      imported: importedCourses.length,
      updated: updatedCourses.length,
      failedCount: failedCourses.length,
      totalProcessed: importedCourses.length + updatedCourses.length + failedCourses.length,
      importedCourses,
      updatedCourses,
      failedCourses,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to import courses",
      error: formatImportError(error),
      imported: 0,
      updated: 0,
      failedCourses: [],
    });
  } finally {
    if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
      try {
        fs.unlinkSync(uploadedFilePath);
      } catch (error) {
        console.warn("Could not delete temporary Excel file:", error.message);
      }
    }
  }
};

module.exports = {
  importCoursesFromExcel,
};

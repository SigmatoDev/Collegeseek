const ExcelJS = require("exceljs");
const mongoose = require("mongoose");
const Course = require("../../models/admin/courseModel");
const College = require("../../models/admin/collegemodel");
const Category = require("../../models/admin/coursesList");
const ProgramMode = require("../../models/admin/programMode");
const Specialization = require("../../models/admin/specialization");
const Stream = require("../../models/admin/streams");

// Utility to safely parse number
const parseNumber = (val) => (val ? Number(val) : undefined);

// Generate unique slug based on specialization + college + state + city
const generateSlug = async (specializationName, college) => {
  if (!college) return `course-${Date.now()}`;

  let baseSlug =
    `${specializationName}-${college.name}-${college.state}-${college.city}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  let slug = baseSlug;
  let counter = 1;
  while (await Course.findOne({ slug })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
};

exports.importCoursesFromExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(req.file.path);
    const worksheet = workbook.getWorksheet("Courses");

    if (!worksheet) {
      return res
        .status(400)
        .json({ error: "No 'Courses' sheet found in Excel file" });
    }

    const rows = worksheet.getSheetValues();
    rows.shift(); // undefined index 0
    rows.shift(); // header row

    let importedCount = 0;
    let updatedCount = 0;
    let failedCourses = [];

    for (const row of rows) {
      if (!row) continue;

      try {
        const mongoId = row[2]?.toString().trim();
        let slug = row[3]?.toString().trim().toLowerCase().replace(/\s+/g, "-");

        const specializationName = row[4]?.toString().trim();
        const description = row[5]?.toString().trim();
        const collegeNameRaw = row[6]?.toString().trim();
        const categoryName = row[7]?.toString().trim();
        const programModeName = row[8]?.toString().trim();
        const duration = row[9]?.toString().trim();
        const fees_amount = parseNumber(row[10]);
        const fees_year = row[11]?.toString().trim();
        const currency = row[12]?.toString().trim() || "INR";
        const eligibility = row[13]?.toString().trim();
        const app_start = row[14] ? new Date(row[14]) : null;
        const app_end = row[15] ? new Date(row[15]) : null;
        const median_salary = parseNumber(row[16]);
        const placement_rate = parseNumber(row[17]);
        const intake_male = parseNumber(row[18]);
        const intake_female = parseNumber(row[19]);
        const intake_total = parseNumber(row[20]);
        const entrance_exam = row[21]?.toString().trim();
        const streamsRaw = row[22]?.toString().trim();
        const brochure_link = row[23]?.toString().trim();

        // --- College ---
        const collegeName = collegeNameRaw?.split("(")[0].trim();
        const college = collegeName
          ? await College.findOne({ name: new RegExp(`^${collegeName}$`, "i") })
          : null;

        if (!college) {
          failedCourses.push({
            course: specializationName || "Unnamed",
            error: `College not found: ${collegeNameRaw}`,
          });
          continue;
        }

        // --- Category ---
        const category = categoryName
          ? await Category.findOne({
              name: new RegExp(`^${categoryName.trim()}$`, "i"),
            })
          : null;
        if (categoryName && !category) {
          failedCourses.push({
            course: specializationName || "Unnamed",
            error: `Category not found: ${categoryName}`,
          });
        }

        // --- ProgramMode ---
        const programMode = programModeName
          ? await ProgramMode.findOne({
              name: new RegExp(`^${programModeName.trim()}$`, "i"),
            })
          : null;
        if (programModeName && !programMode) {
          failedCourses.push({
            course: specializationName || "Unnamed",
            error: `ProgramMode not found: ${programModeName}`,
          });
        }

        // --- Specialization ---
        const specialization = specializationName
          ? await Specialization.findOne({
              name: new RegExp(`^${specializationName.trim()}$`, "i"),
            })
          : null;
        if (specializationName && !specialization) {
          failedCourses.push({
            course: specializationName,
            error: `Specialization not found: ${specializationName}`,
          });
        }

        // --- Streams ---
        let streamIds = [];
        if (streamsRaw) {
          const streamNames = streamsRaw.split("|").map((s) => s.trim());
          for (const sName of streamNames) {
            const stream = await Stream.findOne({ name: sName });
            if (stream) streamIds.push(stream._id);
            else {
              failedCourses.push({
                course: specializationName || "Unnamed",
                error: `Stream not found: ${sName}`,
              });
            }
          }
        }

        // --- Slug ---
        if (!slug || slug === "") {
          slug = await generateSlug(specializationName || "course", college);
        }

        // --- Find existing course ---
        let course = null;
        if (mongoId && mongoose.Types.ObjectId.isValid(mongoId)) {
          course = await Course.findById(mongoId);
        }
        if (!course && slug) {
          course = await Course.findOne({ slug });
        }

        if (course) {
          // Update existing
          course.slug = slug;
          course.specialization = specialization?._id;
          course.description = description;
          course.college_id = college._id;
          course.category = category?._id;
          course.programMode = programMode?._id;
          course.duration = duration;
          course.fees = { amount: fees_amount, year: fees_year, currency };
          course.eligibility = eligibility;
          course.application_dates = { start_date: app_start, end_date: app_end };
          course.placements = { median_salary, placement_rate };
          course.intake_capacity = {
            male: intake_male,
            female: intake_female,
            total: intake_total,
          };
          course.entrance_exam = entrance_exam;
          course.streams = streamIds;
          course.brochure_link = brochure_link;

          await course.save();
          updatedCount++;
        } else {
          // Create new
          await Course.create({
            slug,
            specialization: specialization?._id,
            description,
            college_id: college._id,
            category: category?._id,
            programMode: programMode?._id,
            duration,
            fees: { amount: fees_amount, year: fees_year, currency },
            eligibility,
            application_dates: { start_date: app_start, end_date: app_end },
            placements: { median_salary, placement_rate },
            intake_capacity: {
              male: intake_male,
              female: intake_female,
              total: intake_total,
            },
            entrance_exam,
            streams: streamIds,
            brochure_link,
          });

          importedCount++;
        }
      } catch (rowError) {
        failedCourses.push({
          course: row[4] || "Unknown",
          error: rowError.message,
        });
      }
    }

    // --- Response ---
    if (failedCourses.length > 0) {
      return res.status(400).json({
        message: "Some courses failed to import",
        imported: importedCount,
        updated: updatedCount,
        failedCourses,
      });
    }

    res.json({
      message: "Courses imported successfully",
      imported: importedCount,
      updated: updatedCount,
      failedCourses,
    });
  } catch (err) {
    console.error("Import error:", err);
    res.status(500).json({ error: "Failed to import courses" });
  }
};


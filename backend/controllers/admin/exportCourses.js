const ExcelJS = require("exceljs");
const Course = require("../../models/admin/courseModel");

// Utility to strip HTML tags from content
const stripHtml = (str) => str?.replace(/<[^>]*>?/gm, "") || "";

exports.exportCoursesToExcel = async (req, res) => {
  try {
    const ids = req.query.ids ? req.query.ids.split(",") : null;
    const filter = ids ? { _id: { $in: ids } } : {};

    const courses = await Course.find(filter)
      .populate("college_id", "name")
      .populate("category", "name")
      .populate("programMode", "name")
      .populate("specialization", "name")
      .sort({ createdAt: -1 })
      .lean();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Courses");

    // Define columns with wrap text
    worksheet.columns = [
      { header: "S. No.", key: "s_no", width: 10, style: { alignment: { wrapText: true, horizontal: "left" } } },
      { header: "Slug", key: "slug", width: 20, style: { alignment: { wrapText: true } } },
      { header: "Name", key: "name", width: 20, style: { alignment: { wrapText: true } } },
      { header: "Specialization", key: "specialization", width: 20, style: { alignment: { wrapText: true } } },
      { header: "Description", key: "description", width: 40, style: { alignment: { wrapText: true } } },
      { header: "College", key: "college", width: 25, style: { alignment: { wrapText: true } } },
      { header: "Category", key: "category", width: 20, style: { alignment: { wrapText: true } } },
      { header: "Program Mode", key: "programMode", width: 20, style: { alignment: { wrapText: true } } },
      { header: "Duration", key: "duration", width: 10, style: { alignment: { wrapText: true } } },
      { header: "Fees Amount", key: "fees_amount", width: 15, style: { alignment: { wrapText: true, horizontal: "left" } } },
      { header: "Fees Year", key: "fees_year", width: 10, style: { alignment: { wrapText: true, horizontal: "left" } } },
      { header: "Currency", key: "currency", width: 10, style: { alignment: { wrapText: true } } },
      { header: "Eligibility", key: "eligibility", width: 30, style: { alignment: { wrapText: true } } },
      { header: "Application Start", key: "app_start", width: 15, style: { alignment: { wrapText: true } } },
      { header: "Application End", key: "app_end", width: 15, style: { alignment: { wrapText: true } } },
      { header: "Median Salary", key: "median_salary", width: 15, style: { alignment: { wrapText: true, horizontal: "left" } } },
      { header: "Placement Rate", key: "placement_rate", width: 15, style: { alignment: { wrapText: true, horizontal: "left" } } },
      { header: "Intake Male", key: "intake_male", width: 10, style: { alignment: { wrapText: true, horizontal: "left" } } },
      { header: "Intake Female", key: "intake_female", width: 10, style: { alignment: { wrapText: true, horizontal: "left" } } },
      { header: "Intake Total", key: "intake_total", width: 10, style: { alignment: { wrapText: true, horizontal: "left" } } },
      { header: "Entrance Exam", key: "entrance_exam", width: 20, style: { alignment: { wrapText: true } } },
      { header: "Brochure Link", key: "brochure_link", width: 30, style: { alignment: { wrapText: true } } },
    ];

    // Add rows
    courses.forEach((course, index) => {
      worksheet.addRow({
        s_no: index + 1,
        slug: course.slug,
        name: course.name,
        specialization: course.specialization?.name || "",
        description: stripHtml(course.description),
        college: course.college_id?.name || "",
        category: course.category?.name || "",
        programMode: course.programMode?.name || "",
        duration: course.duration,
        fees_amount: course.fees?.amount ?? "",
        fees_year: course.fees?.year ?? "",
        currency: course.fees?.currency || "INR",
        eligibility: stripHtml(course.eligibility),
        app_start: course.application_dates?.start_date
          ? new Date(course.application_dates.start_date).toLocaleDateString()
          : "",
        app_end: course.application_dates?.end_date
          ? new Date(course.application_dates.end_date).toLocaleDateString()
          : "",
        median_salary: course.placements?.median_salary ?? "",
        placement_rate: course.placements?.placement_rate ?? "",
        intake_male: course.intake_capacity?.male ?? "",
        intake_female: course.intake_capacity?.female ?? "",
        intake_total: course.intake_capacity?.total ?? "",
        entrance_exam: course.entrance_exam || "",
        brochure_link: course.brochure_link || "",
      });
    });

    // Bold headers
    worksheet.getRow(1).font = { bold: true };

    // Set headers for Excel download
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=Courses.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error("Export error:", err);
    res.status(500).json({ error: "Failed to export courses" });
  }
};

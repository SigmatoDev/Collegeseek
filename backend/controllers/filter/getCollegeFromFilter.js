const College = require("../../models/admin/collegemodel");
const Course = require("../../models/admin/courseModel");
const Stream = require("../../models/admin/streams");
const Ownership = require("../../models/admin/ownerShip");
const ExamsAccepted = require("../../models/admin/examExpected");
const Approval = require("../../models/admin/approvels");
const AffiliatedBy = require("../../models/admin/affiliatedBy");
const CoursesList = require("../../models/admin/coursesList");
const Specialization = require("../../models/admin/specialization");
const ProgramMode = require("../../models/admin/programMode");
exports.getCollegesFromFilter = async (req, res) => {
  try {
    const {
      states = [],
      cities = [],
      streams = [],
      ownerships = [],
      exams = [],
      approvals = [],
      affiliatedBy = [],
      categories = [],
      specializations = [],
      programModes = [],
      fees = [],
      page = 1,
      limit = 10,
    } = req.body;
    const collegeQuery = {};
    // :large_green_circle: State & City - Case insensitive
    if (states.length) {
      collegeQuery.state = {
        $in: states.map((s) => new RegExp(`^${s}$`, "i")),
      };
    }
    if (cities.length) {
      collegeQuery.city = {
        $in: cities.map((c) => new RegExp(`^${c}$`, "i")),
      };
    }
    // :large_green_circle: Stream
    if (streams.length) {
      const streamDocs = await Stream.find({
        name: { $in: streams.map((s) => new RegExp(`^${s}$`, "i")) },
      });
      collegeQuery.stream = { $in: streamDocs.map((s) => s._id) };
    }
    // :large_green_circle: Ownership
    if (ownerships.length) {
      const ownershipDocs = await Ownership.find({
        name: { $in: ownerships.map((o) => new RegExp(`^${o}$`, "i")) },
      });
      collegeQuery.ownership = { $in: ownershipDocs.map((o) => o._id) };
    }
    // :large_green_circle: Exams
    if (exams.length) {
      const examDocs = await ExamsAccepted.find({
        code: { $in: exams.map((e) => new RegExp(`^${e}$`, "i")) },
      });
      collegeQuery.examExpected = { $in: examDocs.map((e) => e._id) };
    }
    // :large_green_circle: Approvals
    if (approvals.length) {
      const approvalDocs = await Approval.find({
        code: { $in: approvals.map((a) => new RegExp(`^${a}$`, "i")) },
      });
      collegeQuery.approvel = { $in: approvalDocs.map((a) => a._id) };
    }
    // :large_green_circle: Affiliated By
    if (affiliatedBy.length) {
      const affDocs = await AffiliatedBy.find({
        name: { $in: affiliatedBy.map((a) => new RegExp(`^${a}$`, "i")) },
      });
      collegeQuery.affiliatedby = { $in: affDocs.map((a) => a._id) };
    }
    // :large_green_circle: Course-based filters
    let courseCollegeIds = [];
    if (
      categories.length ||
      specializations.length ||
      programModes.length ||
      fees.length
    ) {
      const courseQuery = {};
      if (categories.length) {
        const categoryDocs = await CoursesList.find({
          name: { $in: categories.map((c) => new RegExp(`^${c}$`, "i")) },
        });
        courseQuery.category = { $in: categoryDocs.map((c) => c._id) };
      }
      if (specializations.length) {
        const specDocs = await Specialization.find({
          name: { $in: specializations.map((s) => new RegExp(`^${s}$`, "i")) },
        });
        courseQuery.specialization = { $in: specDocs.map((s) => s._id) };
      }
      if (programModes.length) {
        const modeDocs = await ProgramMode.find({
          name: { $in: programModes.map((m) => new RegExp(`^${m}$`, "i")) },
        });
        courseQuery.programMode = { $in: modeDocs.map((m) => m._id) };
      }
      if (fees.length) {
        const feeConditions = fees.map((range) => {
          const [min, max] = range.includes("Above")
            ? [parseInt(range.replace(/[^\d]/g, "")), Infinity]
            : range.split("-").map((v) => parseInt(v));
          return max === Infinity
            ? { "fees.amount": { $gte: min } }
            : { "fees.amount": { $gte: min, $lte: max } };
        });
        courseQuery.$or = feeConditions;
      }
      const matchedCourses = await Course.find(courseQuery).select(
        "college_id"
      );
      courseCollegeIds = [
        ...new Set(matchedCourses.map((c) => c.college_id.toString())),
      ];
      if (courseCollegeIds.length) {
        collegeQuery._id = { $in: courseCollegeIds };
      } else {
        return res.json({ colleges: [], currentPage: page, totalPages: 0 });
      }
    }
    // :large_green_circle: Pagination values
    const skip = (parseInt(page) - 1) * parseInt(limit);
    // :white_check_mark: Fetch all matching college IDs (used for accurate filters)
    const allCollegeDocs = await College.find(collegeQuery).select("_id");
    const allCollegeIds = allCollegeDocs.map((doc) => doc._id);
    // :large_green_circle: Get paginated colleges
    const totalCount = allCollegeIds.length;
    const totalPages = Math.ceil(totalCount / parseInt(limit));
    const colleges = await College.find(collegeQuery)
      .populate("stream ownership approvel affiliatedby examExpected")
      .skip(skip)
      .limit(parseInt(limit));
    // :white_check_mark: Return paginated data + all matched IDs
    res.json({
      colleges,
      currentPage: parseInt(page),
      totalPages,
      allCollegeIds, // :point_left: added here
    });
  } catch (err) {
    console.error("Error filtering colleges:", err);
    res.status(500).json({ error: "Failed to filter colleges" });
  }
};

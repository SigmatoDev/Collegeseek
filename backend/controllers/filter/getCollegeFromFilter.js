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
      fees = []
    } = req.body;

      // ✅ Pagination setup
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const collegeQuery = {};
    // :white_check_mark: State & City - Case insensitive match
    if (states.length) {
      collegeQuery.state = {
        $in: states.map(s => new RegExp(`^${s}$`, "i"))
      };
    }
    if (cities.length) {
      collegeQuery.city = {
        $in: cities.map(c => new RegExp(`^${c}$`, "i"))
      };
    }
    // :white_check_mark: Stream match by name → ObjectId
    if (streams.length) {
      const streamDocs = await Stream.find({
        name: { $in: streams.map(s => new RegExp(`^${s}$`, "i")) }
      });
      collegeQuery.stream = { $in: streamDocs.map(s => s._id) };
    }
    // :white_check_mark: Ownership match by name → ObjectId
    if (ownerships.length) {
      const ownershipDocs = await Ownership.find({
        name: { $in: ownerships.map(o => new RegExp(`^${o}$`, "i")) }
      });
      collegeQuery.ownership = { $in: ownershipDocs.map(o => o._id) };
    }
    // :white_check_mark: Exams match by name → ObjectId
    if (exams.length) {
      const examDocs = await ExamsAccepted.find({
        // name: { $in: exams.map(e => new RegExp(`^${e}$`, "i")) }
        code: { $in: exams.map(e => new RegExp(`^${e}$`, "i")) }
      });
      collegeQuery.examExpected = { $in: examDocs.map(e => e._id) };
    }
    // :white_check_mark: Approvals match by name → ObjectId
    if (approvals.length) {
      const approvalDocs = await Approval.find({
        // name: { $in: approvals.map(a => new RegExp(`^${a}$`, "i")) }
        code: { $in: approvals.map(a => new RegExp(`^${a}$`, "i")) }
      });
      collegeQuery.approvel = { $in: approvalDocs.map(a => a._id) };
    }
    // :white_check_mark: AffiliatedBy match by name → ObjectId
    if (affiliatedBy.length) {
      const affDocs = await AffiliatedBy.find({
        name: { $in: affiliatedBy.map(a => new RegExp(`^${a}$`, "i")) }
      });
      collegeQuery.affiliatedby = { $in: affDocs.map(a => a._id) };
    }
    // :white_check_mark: Course-based filters (if any)
    let courseCollegeIds = [];
    if (categories.length || specializations.length || programModes.length || fees.length) {
      const courseQuery = {};
      if (categories.length) {
        const categoryDocs = await CoursesList.find({
          name: { $in: categories.map(c => new RegExp(`^${c}$`, "i")) }
        });
        courseQuery.category = { $in: categoryDocs.map(c => c._id) };
      }
      if (specializations.length) {
        const specDocs = await Specialization.find({
          name: { $in: specializations.map(s => new RegExp(`^${s}$`, "i")) }
        });
        courseQuery.specialization = { $in: specDocs.map(s => s._id) };
      }
      if (programModes.length) {
        const modeDocs = await ProgramMode.find({
          name: { $in: programModes.map(m => new RegExp(`^${m}$`, "i")) }
        });
        courseQuery.programMode = { $in: modeDocs.map(m => m._id) };
      }
      if (fees.length) {
        const feeConditions = fees.map((range) => {
          const [min, max] = range.includes("Above")
            ? [parseInt(range.replace(/[^\d]/g, "")), Infinity]
            : range.split("-").map(v => parseInt(v));
          return max === Infinity
            ? { "fees.amount": { $gte: min } }
            : { "fees.amount": { $gte: min, $lte: max } };
        });
        courseQuery.$or = feeConditions;
      }
      const matchedCourses = await Course.find(courseQuery).select("college_id");
      courseCollegeIds = [...new Set(matchedCourses.map(c => c.college_id.toString()))];
      if (courseCollegeIds.length) {
        collegeQuery._id = { $in: courseCollegeIds };
      } else {
        return res.json({ colleges: [], total: 0, page, limit }); // No match
      }
    }
    const totalColleges = await College.countDocuments(collegeQuery).populate("stream ownership approvel affiliatedby examExpected");
     const colleges = await College.find(collegeQuery)
      .skip(skip)
      .limit(limit)
      .populate("stream ownership approvel affiliatedby examExpected");

    res.json({ colleges, total: totalColleges, page, limit });;
  } catch (err) {
    console.error("Error filtering colleges:", err);
    res.status(500).json({ error: "Failed to filter colleges" });
  }
};






















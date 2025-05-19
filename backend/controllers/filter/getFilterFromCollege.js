const College = require("../../models/admin/collegemodel");
const Stream = require("../../models/admin/streams");
const Ownership = require("../../models/admin/ownerShip");
const ExamsAccepted = require("../../models/admin/examExpected");
const Approval = require("../../models/admin/approvels");
const AffiliatedBy = require("../../models/admin/affiliatedBy");
const CoursesList = require("../../models/admin/coursesList");
const Specialization = require("../../models/admin/specialization");
const ProgramMode = require("../../models/admin/programMode");
const Course = require("../../models/admin/courseModel");
const mongoose = require("mongoose");
const capitalize = (text) =>
  text?.charAt(0).toUpperCase() + text?.slice(1).toLowerCase();
exports.getFiltersFromColleges = async (req, res) => {
  try {
    const { collegeIds = [] } = req.body;
    if (!collegeIds.length) return res.json({});
    const ids = collegeIds.map((id) => new mongoose.Types.ObjectId(id));
    // STATE
    const stateAgg = await College.aggregate([
      { $match: { _id: { $in: ids } } },
      { $group: { _id: { $toLower: "$state" }, count: { $sum: 1 } } },
    ]);
    const states = stateAgg.map((s) => ({
      name: capitalize(s._id),
      count: s.count,
    }));
    // CITY
    const cityAgg = await College.aggregate([
      { $match: { _id: { $in: ids } } },
      { $group: { _id: { $toLower: "$city" }, count: { $sum: 1 } } },
    ]);
    const cities = cityAgg.map((c) => ({
      name: capitalize(c._id),
      count: c.count,
    }));
    // STREAMS
    const streamAgg = await College.aggregate([
      { $match: { _id: { $in: ids } } },
      { $unwind: "$stream" },
      { $group: { _id: "$stream", count: { $sum: 1 } } },
    ]);
    const streams = await Stream.find({
      _id: { $in: streamAgg.map((s) => s._id) },
    });
    const streamResult = streams.map((s) => {
      const matched = streamAgg.find(
        (sa) => sa._id.toString() === s._id.toString()
      );
      return { name: capitalize(s.name), count: matched?.count || 0 };
    });
    // OWNERSHIP
    const ownershipAgg = await College.aggregate([
      { $match: { _id: { $in: ids } } },
      { $group: { _id: "$ownership", count: { $sum: 1 } } },
    ]);
    const ownerships = await Ownership.find({
      _id: { $in: ownershipAgg.map((o) => o._id) },
    });
    const ownershipResult = ownerships.map((o) => {
      const matched = ownershipAgg.find(
        (oa) => oa._id.toString() === o._id.toString()
      );
      return { name: capitalize(o.name), count: matched?.count || 0 };
    });
    // EXAMS
    const examAgg = await College.aggregate([
      { $match: { _id: { $in: ids } } },
      { $unwind: "$examExpected" },
      { $group: { _id: "$examExpected", count: { $sum: 1 } } },
    ]);
    const exams = await ExamsAccepted.find({
      _id: { $in: examAgg.map((e) => e._id) },
    });
    const examResult = exams.map((e) => {
      const matched = examAgg.find(
        (ea) => ea._id.toString() === e._id.toString()
      );
      // return { name: capitalize(e.name), count: matched?.count || 0 };
      return { name: capitalize(e.code), count: matched?.count || 0 };
    });
    // APPROVALS
    const approvalAgg = await College.aggregate([
      { $match: { _id: { $in: ids } } },
      { $unwind: "$approvel" },
      { $group: { _id: "$approvel", count: { $sum: 1 } } },
    ]);
    const approvals = await Approval.find({
      _id: { $in: approvalAgg.map((a) => a._id) },
    });
    const approvalResult = approvals.map((a) => {
      const matched = approvalAgg.find(
        (aa) => aa._id.toString() === a._id.toString()
      );
      // return { name: capitalize(a.name), count: matched?.count || 0 };
      return { name: capitalize(a.code), count: matched?.count || 0 };
    });
    // AFFILIATED BY
    const affAgg = await College.aggregate([
      { $match: { _id: { $in: ids } } },
      { $group: { _id: "$affiliatedby", count: { $sum: 1 } } },
    ]);
    const affiliated = await AffiliatedBy.find({
      _id: { $in: affAgg.map((a) => a._id) },
    });
    const affiliatedResult = affiliated.map((a) => {
      const matched = affAgg.find(
        (aa) => aa._id.toString() === a._id.toString()
      );
      return { name: capitalize(a.name), count: matched?.count || 0 };
    });
    // COURSE FILTERS BASED ON MATCHED COLLEGES
    const courseDocs = await Course.find({ college_id: { $in: ids } });
    const catMap = new Map();
    const specMap = new Map();
    const modeMap = new Map();
    const feeMap = {
      "0-100000": 0,
      "100001-200000": 0,
      "200001-300000": 0,
      "300001-500000": 0,
      "Above 500000": 0,
    };
    for (let course of courseDocs) {
      if (course.category)
        catMap.set(
          course.category.toString(),
          (catMap.get(course.category.toString()) || 0) + 1
        );
      if (course.specialization)
        specMap.set(
          course.specialization.toString(),
          (specMap.get(course.specialization.toString()) || 0) + 1
        );
      if (course.programMode)
        modeMap.set(
          course.programMode.toString(),
          (modeMap.get(course.programMode.toString()) || 0) + 1
        );
      const amt = course.fees?.amount || 0;
      if (amt <= 100000) feeMap["0-100000"]++;
      else if (amt <= 200000) feeMap["100001-200000"]++;
      else if (amt <= 300000) feeMap["200001-300000"]++;
      else if (amt <= 500000) feeMap["300001-500000"]++;
      else feeMap["Above 500000"]++;
    }
    const catDocs = await CoursesList.find({
      _id: { $in: [...catMap.keys()] },
    });
    const specDocs = await Specialization.find({
      _id: { $in: [...specMap.keys()] },
    });
    const modeDocs = await ProgramMode.find({
      _id: { $in: [...modeMap.keys()] },
    });
    const categories = catDocs.map((c) => ({
      name: c.name,
      count: catMap.get(c._id.toString()),
    }));
    const specializations = specDocs.map((s) => ({
      name: s.name,
      count: specMap.get(s._id.toString()),
    }));
    const programModes = modeDocs.map((p) => ({
      name: p.name,
      count: modeMap.get(p._id.toString()),
    }));
    const fees = Object.entries(feeMap).map(([range, count]) => ({
      range,
      count,
    }));
    return res.json({
      states,
      cities,
      streams: streamResult,
      ownerships: ownershipResult,
      exams: examResult,
      approvals: approvalResult,
      affiliatedBy: affiliatedResult,
      categories,
      specializations,
      programModes,
      fees,
    });
  } catch (err) {
    console.error("Error in getFiltersByColleges:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};







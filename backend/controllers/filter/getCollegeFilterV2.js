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

const capitalize = (text) =>
  text?.charAt(0).toUpperCase() + text?.slice(1).toLowerCase();

const FILTER_CACHE_TTL_MS = 10 * 60 * 1000;
const filterCache = new Map();

const normalizeValues = (values) =>
  values
    .map((value) => String(value).toLowerCase())
    .sort((a, b) => a.localeCompare(b));

const buildCacheKey = (filters) => {
  const entries = Object.keys(filters)
    .sort()
    .map((key) => `${key}:${normalizeValues(filters[key]).join(",")}`);
  return entries.join("|");
};

const getCacheEntry = (key) => {
  const entry = filterCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    filterCache.delete(key);
    return null;
  }
  return entry;
};

exports.getCollegesAndFiltersV2 = async (req, res) => {
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
      includeFilters = true,
    } = req.body;

    const collegeQuery = {};

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
    if (streams.length) {
      const streamDocs = await Stream.find({
        name: { $in: streams.map((s) => new RegExp(`^${s}$`, "i")) },
      })
        .select("_id")
        .lean();
      collegeQuery.stream = { $in: streamDocs.map((s) => s._id) };
    }
    if (ownerships.length) {
      const ownershipDocs = await Ownership.find({
        name: { $in: ownerships.map((o) => new RegExp(`^${o}$`, "i")) },
      })
        .select("_id")
        .lean();
      collegeQuery.ownership = { $in: ownershipDocs.map((o) => o._id) };
    }
    if (exams.length) {
      const examDocs = await ExamsAccepted.find({
        code: { $in: exams.map((e) => new RegExp(`^${e}$`, "i")) },
      })
        .select("_id")
        .lean();
      collegeQuery.examExpected = { $in: examDocs.map((e) => e._id) };
    }
    if (approvals.length) {
      const approvalDocs = await Approval.find({
        code: { $in: approvals.map((a) => new RegExp(`^${a}$`, "i")) },
      })
        .select("_id")
        .lean();
      collegeQuery.approvel = { $in: approvalDocs.map((a) => a._id) };
    }
    if (affiliatedBy.length) {
      const affDocs = await AffiliatedBy.find({
        name: { $in: affiliatedBy.map((a) => new RegExp(`^${a}$`, "i")) },
      })
        .select("_id")
        .lean();
      collegeQuery.affiliatedby = { $in: affDocs.map((a) => a._id) };
    }

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
        })
          .select("_id")
          .lean();
        courseQuery.category = { $in: categoryDocs.map((c) => c._id) };
      }
      if (specializations.length) {
        const specDocs = await Specialization.find({
          name: { $in: specializations.map((s) => new RegExp(`^${s}$`, "i")) },
        })
          .select("_id")
          .lean();
        courseQuery.specialization = { $in: specDocs.map((s) => s._id) };
      }
      if (programModes.length) {
        const modeDocs = await ProgramMode.find({
          name: { $in: programModes.map((m) => new RegExp(`^${m}$`, "i")) },
        })
          .select("_id")
          .lean();
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

      const courseCollegeIds = await Course.distinct("college_id", courseQuery);
      if (courseCollegeIds.length) {
        collegeQuery._id = { $in: courseCollegeIds };
      } else {
        return res.json({ colleges: [], currentPage: page, totalPages: 0, filters: {} });
      }
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const cacheKey = buildCacheKey({
      states,
      cities,
      streams,
      ownerships,
      exams,
      approvals,
      affiliatedBy,
      categories,
      specializations,
      programModes,
      fees,
    });
    const cacheEntry = getCacheEntry(cacheKey);
    const totalCount =
      cacheEntry?.totalCount ?? (await College.countDocuments(collegeQuery));
    const totalPages = Math.ceil(totalCount / parseInt(limit));

    const colleges = await College.find(collegeQuery)
      .select(
        "name slug image city state rank fees avgPackage description shortlistedUsers shortlistedCount"
      )
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    let filters = cacheEntry?.filters || null;

    if (!filters || includeFilters) {
      const matchingCollegeIds = await College.distinct("_id", collegeQuery);
      const matchStage = collegeQuery;

      const stateAgg = await College.aggregate([
        { $match: matchStage },
        { $group: { _id: { $toLower: "$state" }, count: { $sum: 1 } } },
      ]);
      const statesResult = stateAgg.map((s) => ({
        name: capitalize(s._id),
        count: s.count,
      }));

    const cityAgg = await College.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: { city: { $toLower: "$city" }, state: { $toLower: "$state" } },
          count: { $sum: 1 },
        },
      },
    ]);
    const citiesResult = cityAgg.map((c) => ({
      name: capitalize(c._id.city),
      count: c.count,
      state: capitalize(c._id.state),
    }));

      const streamAgg = await College.aggregate([
        { $match: matchStage },
        { $unwind: "$stream" },
        { $group: { _id: "$stream", count: { $sum: 1 } } },
      ]);
      const streamDocs = await Stream.find({
        _id: { $in: streamAgg.map((s) => s._id) },
      }).lean();
      const streamResult = streamDocs.map((s) => {
        const matched = streamAgg.find(
          (sa) => sa._id.toString() === s._id.toString()
        );
        return { name: capitalize(s.name), count: matched?.count || 0 };
      });

      const ownershipAgg = await College.aggregate([
        { $match: matchStage },
        { $group: { _id: "$ownership", count: { $sum: 1 } } },
      ]);
      const ownershipDocs = await Ownership.find({
        _id: { $in: ownershipAgg.map((o) => o._id) },
      }).lean();
      const ownershipResult = ownershipDocs.map((o) => {
        const matched = ownershipAgg.find(
          (oa) => oa._id.toString() === o._id.toString()
        );
        return { name: capitalize(o.name), count: matched?.count || 0 };
      });

      const examAgg = await College.aggregate([
        { $match: matchStage },
        { $unwind: "$examExpected" },
        { $group: { _id: "$examExpected", count: { $sum: 1 } } },
      ]);
      const examsResultDocs = await ExamsAccepted.find({
        _id: { $in: examAgg.map((e) => e._id) },
      }).lean();
      const examResult = examsResultDocs.map((e) => {
        const matched = examAgg.find(
          (ea) => ea._id.toString() === e._id.toString()
        );
        return { name: e.code?.toUpperCase(), count: matched?.count || 0 };
      });

      const approvalAgg = await College.aggregate([
        { $match: matchStage },
        { $unwind: "$approvel" },
        { $group: { _id: "$approvel", count: { $sum: 1 } } },
      ]);
      const approvalsResultDocs = await Approval.find({
        _id: { $in: approvalAgg.map((a) => a._id) },
      }).lean();
      const approvalResult = approvalsResultDocs.map((a) => {
        const matched = approvalAgg.find(
          (aa) => aa._id.toString() === a._id.toString()
        );
        return { name: a.code?.toUpperCase(), count: matched?.count || 0 };
      });

      const affAgg = await College.aggregate([
        { $match: matchStage },
        { $group: { _id: "$affiliatedby", count: { $sum: 1 } } },
      ]);
      const affiliatedDocs = await AffiliatedBy.find({
        _id: { $in: affAgg.map((a) => a._id) },
      }).lean();
      const affiliatedResult = affiliatedDocs.map((a) => {
        const matched = affAgg.find(
          (aa) => aa._id.toString() === a._id.toString()
        );
        return { name: capitalize(a.name), count: matched?.count || 0 };
      });

      const courseDocs = await Course.find(
        matchingCollegeIds.length ? { college_id: { $in: matchingCollegeIds } } : {}
      )
        .select("category specialization programMode fees.amount")
        .lean();
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
      }).lean();
      const specDocs = await Specialization.find({
        _id: { $in: [...specMap.keys()] },
      }).lean();
      const modeDocs = await ProgramMode.find({
        _id: { $in: [...modeMap.keys()] },
      }).lean();
      const categoriesResult = catDocs.map((c) => ({
        name: c.name,
        count: catMap.get(c._id.toString()),
      }));
      const specializationsResult = specDocs.map((s) => ({
        name: s.name,
        count: specMap.get(s._id.toString()),
      }));
      const programModesResult = modeDocs.map((p) => ({
        name: p.name,
        count: modeMap.get(p._id.toString()),
      }));
      const feesResult = Object.entries(feeMap).map(([range, count]) => ({
        range,
        count,
      }));

      filters = {
        states: statesResult,
        cities: citiesResult,
        streams: streamResult,
        ownerships: ownershipResult,
        exams: examResult,
        approvals: approvalResult,
        affiliatedBy: affiliatedResult,
        categories: categoriesResult,
        specializations: specializationsResult,
        programModes: programModesResult,
        fees: feesResult,
      };

      filterCache.set(cacheKey, {
        expiresAt: Date.now() + FILTER_CACHE_TTL_MS,
        filters,
        totalCount,
      });
    }

    return res.json({
      colleges,
      currentPage: parseInt(page),
      totalPages,
      filters: filters || {},
    });
  } catch (err) {
    console.error("Error filtering colleges (v2):", err);
    res.status(500).json({ error: "Failed to filter colleges" });
  }
};

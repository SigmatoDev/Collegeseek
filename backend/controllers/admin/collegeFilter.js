const mongoose = require("mongoose");
const CollegeModel = require("../../models/admin/collegemodel");
const CoursesModel = require("../../models/admin/courseModel");

const getFilteredColleges = async (req, res) => {
  console.log("📥 Incoming Request Body:", req.body);
  try {
    const {
      degrees,
      programModes,
      courseNames,
      streams,
      exams,
      states,
      cities,
      ranks,
      fees,
      ownerships,
      affiliations,
      approvals,
      page = 1,
      limit = 10,
    } = req.body;

    const courseFilters = {};
    const collegeQuery = {};
    let matchedCourseCollegeIds = [];

    const toObjectIdArray = (arr) => {
      return arr?.map((id) => new mongoose.Types.ObjectId(id));
    };

    // Step 1: Filter Courses and collect related College IDs
    if (degrees?.length) {
      courseFilters.category = { $in: toObjectIdArray(degrees) };
    }
    if (programModes?.length) {
      courseFilters.programMode = { $in: toObjectIdArray(programModes) };
    }
    if (courseNames?.length) {
      courseFilters.name = { $in: courseNames };
    }

    if (Object.keys(courseFilters).length > 0) {
      const matchedCourses = await CoursesModel.find(courseFilters).select("college_id");
      matchedCourseCollegeIds = [
        ...new Set(matchedCourses.map((c) => c.college_id.toString())),
      ];

      if (matchedCourseCollegeIds.length > 0) {
        collegeQuery._id = { $in: matchedCourseCollegeIds };
      } else {
        return res.status(200).json({
          success: true,
          data: [],
          pagination: {
            total: 0,
            page: Number(page),
            limit: Number(limit),
            totalPages: 0,
          },
        });
      }
    }

    // Step 2: Apply college filters
    if (streams?.length) {
      collegeQuery.stream = { $in: toObjectIdArray(streams) };
    }
    if (exams?.length) {
      collegeQuery.examExpected = { $in: toObjectIdArray(exams) };
    }
    if (states?.length) {
      collegeQuery.state = { $in: states };
    }
    if (cities?.length) {
      collegeQuery.city = { $in: cities };
    }
    if (ownerships?.length) {
      collegeQuery.ownership = { $in: toObjectIdArray(ownerships) };
    }
    if (affiliations?.length) {
      collegeQuery.affiliatedby = { $in: toObjectIdArray(affiliations) };
    }
    if (approvals?.length) {
      collegeQuery.approvel = { $in: toObjectIdArray(approvals) };
    }

    // Step 3: Handle Fees
    if (fees?.length) {
      const feeConditions = [];
      fees.forEach((feeRange) => {
        if (feeRange.includes("Below")) {
          const amount = parseInt(feeRange.replace(/\D/g, ""));
          feeConditions.push({ fees: { $lt: amount } });
        } else if (feeRange.includes("Above")) {
          const amount = parseInt(feeRange.replace(/\D/g, ""));
          feeConditions.push({ fees: { $gt: amount } });
        } else if (feeRange.includes("-")) {
          const [min, max] = feeRange.split("-").map((val) => parseInt(val.replace(/\D/g, "")));
          feeConditions.push({ fees: { $gte: min, $lte: max } });
        }
      });
      if (feeConditions.length > 0) {
        collegeQuery.$and = collegeQuery.$and || [];
        collegeQuery.$and.push({ $or: feeConditions });
      }
    }

    // Step 4: Handle Rank ranges
    if (ranks?.length) {
      const rankConditions = [];
      ranks.forEach((rankRange) => {
        if (rankRange.includes("Below")) {
          const value = parseInt(rankRange.replace(/\D/g, ""));
          rankConditions.push({ rank: { $lt: value } });
        } else if (rankRange.includes("Above")) {
          const value = parseInt(rankRange.replace(/\D/g, ""));
          rankConditions.push({ rank: { $gt: value } });
        } else if (rankRange.includes("-")) {
          const [min, max] = rankRange.split("-").map((val) => parseInt(val.replace(/\D/g, "")));
          rankConditions.push({ rank: { $gte: min, $lte: max } });
        }
      });
      if (rankConditions.length > 0) {
        collegeQuery.$and = collegeQuery.$and || [];
        collegeQuery.$and.push({ $or: rankConditions });
      }
    }

    // Final Query Logging
    // console.log("🎯 Final College Query Before DB Call:", JSON.stringify(collegeQuery, null, 2));

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    const [colleges, totalCount] = await Promise.all([
      CollegeModel.find(collegeQuery)
        .select("name city state rank fees image")
        .skip(skip)
        .limit(Number(limit)),
      CollegeModel.countDocuments(collegeQuery),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json({
      success: true,
      data: colleges,
      pagination: {
        total: totalCount,
        page: Number(page),
        limit: Number(limit),
        totalPages,
      },
    });
  } catch (error) {
    console.error("❌ Error in getFilteredColleges:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

module.exports = { getFilteredColleges };

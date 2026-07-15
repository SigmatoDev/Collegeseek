// const College = require("../../models/admin/collegemodel");

// const getAllColleges = async (req, res) => {
//   try {
//     const search = req.query.search || "";
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;

//     const query = {
//       name: { $regex: search, $options: "i" }, // case-insensitive name search
//     };

//     const total = await College.countDocuments(query);
//     const pages = Math.ceil(total / limit);
//     const skip = (page - 1) * limit;

//     const colleges = await College.find(query)
//       .skip(skip)
//       .limit(limit)
//       .sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       data: colleges,
//       pagination: {
//         total,
//         page,
//         pages,
//         limit,
//       },
//     });
//   } catch (err) {
//     console.error("Error fetching colleges:", err);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };

// module.exports = {
//   getAllColleges,
// };
const College = require("../../models/admin/collegemodel");

const getAllColleges = async (req, res) => {
  try {
    const search =
      typeof req.query.search === "string"
        ? req.query.search.trim()
        : "";

    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);

    const limit = Math.min(
      Math.max(parseInt(req.query.limit, 10) || 10, 1),
      100
    );

    const query = search
      ? {
          name: {
            $regex: search,
            $options: "i",
          },
        }
      : {};

    const total = await College.countDocuments(query);
    const pages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;

    /*
      _id already has a MongoDB index.
      This avoids the 32 MB in-memory sorting error.
    */
    const colleges = await College.find(query)
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return res.status(200).json({
      success: true,
      data: colleges,
      pagination: {
        total,
        page,
        pages,
        limit,
        hasNextPage: page < pages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (err) {
    console.error("Error fetching colleges:", {
      message: err.message,
      stack: err.stack,
      query: req.query,
    });

    return res.status(500).json({
      success: false,
      message: "Unable to fetch colleges",
    });
  }
};

module.exports = {
  getAllColleges,
};
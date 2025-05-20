const College = require("../../models/admin/collegemodel");

const getAllColleges = async (req, res) => {
  try {
    const search = req.query.search || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const query = {
      name: { $regex: search, $options: "i" }, // case-insensitive name search
    };

    const total = await College.countDocuments(query);
    const pages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;

    const colleges = await College.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: colleges,
      pagination: {
        total,
        page,
        pages,
        limit,
      },
    });
  } catch (err) {
    console.error("Error fetching colleges:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = {
  getAllColleges,
};

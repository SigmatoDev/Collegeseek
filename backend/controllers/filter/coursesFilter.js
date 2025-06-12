const College = require('../../models/admin/collegemodel');
const Course = require('../../models/admin/courseModel');

const getCoursesByStreamId = async (req, res) => {
  try {
    const streamId = req.params.streamId;
    console.log("Received Stream ID:", streamId);

    // Step 1: Find colleges with this stream ID
    const colleges = await College.find({ stream: streamId }, '_id');
    console.log("Colleges found for stream:", colleges);

    if (!colleges || colleges.length === 0) {
      console.log("No colleges found for the given stream ID.");
      return res.status(404).json({ message: 'No colleges found for this stream' });
    }

    const collegeIds = colleges.map(college => college._id);
    console.log("College IDs:", collegeIds);

    // Step 2: Find courses for these colleges
    const courses = await Course.find({ college_id: { $in: collegeIds } })
      .populate('college_id', 'name')
      .populate('specialization', 'name');

    console.log(`Found ${courses.length} courses for these colleges.`);
    res.json(courses);
  } catch (err) {
    console.error('Error fetching courses by stream ID:', err);
    res.status(500).json({ message: 'Error fetching courses' });
  }
};

module.exports = {
  getCoursesByStreamId,
};

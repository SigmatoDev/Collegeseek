const Stream = require('../../models/admin/streams');
const ExamsAccepted = require('../../models/admin/examExpected');
const CoursesList = require('../../models/admin/coursesList');
const College = require('../../models/admin/collegemodel');
const Course = require('../../models/admin/courseModel');

exports.getCategoryData = async (req, res) => {
  try {
    console.log('Fetching category data...');

    // Fetch 15 random streams, exams, and courses categories
    const streams = await Stream.aggregate([{ $sample: { size: 15 } }]);
    const exams = await ExamsAccepted.aggregate([{ $sample: { size: 15 } }]);
    const courses = await CoursesList.aggregate([{ $sample: { size: 15 } }]);

    // Streams count by counting colleges referencing the stream
    const streamsData = await Promise.all(
      streams.map(async (s) => {
        const count = await College.countDocuments({ stream: s._id });
        return {
          name: s.name,
          count,
          icon: s.image || '📚',
        };
      })
    );

    // Exams count by counting colleges referencing the exam
    function toTitleCase(str) {
      return str
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }

    const examsData = await Promise.all(
      exams.map(async (e) => {
        const formattedName = toTitleCase(e.code.trim());
        const count = await College.countDocuments({ examExpected: e._id });
        return {
          name: formattedName,
          count,
          icon: e.image || '📝',
        };
      })
    );

    // Courses count by counting distinct colleges having courses with that category
    const coursesData = await Promise.all(
      courses.map(async (c) => {
        const collegeIds = await Course.distinct('college_id', { category: c._id });
        const count = collegeIds.length;

        return {
          name: c.name,
          count,
          icon: c.image || '🎓',
        };
      })
    );

    // **Calculate dynamic tab counts here:**

    // Total Colleges count
    const collegesCount = await College.countDocuments();

    // Total Exams count - count of all exams categories (or sum of colleges referencing exams)
    // Option 1: total exam categories
    // const examsCount = await ExamsAccepted.countDocuments();

    // Option 2: total number of colleges referencing any examExpected (if you want sum of counts)
    const examsCount = await College.countDocuments({ examExpected: { $exists: true, $ne: null } });

    // Total Courses count - total distinct courses categories (or distinct colleges with courses)
    // Option 1: total course categories
    // const coursesCount = await CoursesList.countDocuments();

    // Option 2: distinct colleges that have courses
    const coursesCollegeIds = await Course.distinct('college_id');
    const coursesCount = coursesCollegeIds.length;

    const tabCounts = {
      Colleges: collegesCount,
      Exams: examsCount,
      Courses: coursesCount,
    };

    const response = {
      Streams: streamsData,
      Exams: examsData,
      Courses: coursesData,
      tabCounts,  // <-- send this to frontend too
    };

    console.log('Sending category data response:', response);
    res.json(response);
  } catch (error) {
    console.error('Error fetching category data:', error);
    res.status(500).json({ message: 'Server error fetching category data' });
  }
};


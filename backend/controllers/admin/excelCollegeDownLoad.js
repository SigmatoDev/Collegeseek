const ExcelJS = require('exceljs');
const College = require('../../models/admin/collegemodel');

// Helper to strip HTML tags
function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
}

exports.exportColleges = async (req, res) => {
  try {
    const colleges = await College.find()
      .populate('stream', 'name')
      .populate('approvel', 'name')
      .populate('affiliatedby', 'name')
      .populate('examExpected', 'name')
      .populate('ownership', 'name')
      .lean();

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Colleges');

    sheet.columns = [
      { header: 'College ID', key: 'collegeId', width: 10 },
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Slug', key: 'slug', width: 25 },
      { header: 'Description', key: 'description', width: 50 },
      { header: 'About', key: 'about', width: 50 },
      { header: 'State', key: 'state', width: 15 },
      { header: 'City', key: 'city', width: 15 },

      { header: 'Streams', key: 'streams', width: 30 },
      { header: 'Approvals', key: 'approvals', width: 30 },
      { header: 'Affiliated By', key: 'affiliatedby', width: 30 },
      { header: 'Exams Expected', key: 'examExpected', width: 30 },
      { header: 'Ownership', key: 'ownership', width: 30 },

      { header: 'Rank', key: 'rank', width: 10 },
      { header: 'Fees', key: 'fees', width: 10 },
      { header: 'Avg Package', key: 'avgPackage', width: 15 },
      { header: 'Website', key: 'website', width: 30 },
      { header: 'Contact', key: 'contact', width: 15 },
      { header: 'Contact Email', key: 'contactEmail', width: 30 },
      { header: 'Featured', key: 'featured', width: 10 },
      { header: 'Address', key: 'address', width: 40 },
      { header: 'Location', key: 'location', width: 30 },
    ];

    let collegeIdCounter = 1;

    colleges.forEach(college => {
      sheet.addRow({
        collegeId: collegeIdCounter++,  // Start from 1, increment by 1
        name: college.name,
        slug: college.slug,
        description: stripHtml(college.description),
        about: stripHtml(college.about),
        state: college.state,
        city: college.city,

        streams: college.stream?.map(s => s.name).join(', ') || '',
        approvals: college.approvel?.map(a => a.name).join(', ') || '',
        affiliatedby: college.affiliatedby?.name || '',
        examExpected: college.examExpected?.map(e => e.name).join(', ') || '',
        ownership: college.ownership?.name || '',

        rank: college.rank,
        fees: college.fees,
        avgPackage: college.avgPackage,
        website: college.website,
        contact: college.contact,
        contactEmail: college.contactEmail,
        featured: college.featured ? 'Yes' : 'No',
        address: college.address,
        location: college.location, 
      });
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader('Content-Disposition', 'attachment; filename=colleges.xlsx');

    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    console.error('Error exporting colleges:', error);
    res.status(500).json({ error: 'Failed to export colleges' });
  }
};

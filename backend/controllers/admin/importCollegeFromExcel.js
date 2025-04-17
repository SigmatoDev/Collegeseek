const xlsx = require("xlsx");
const fs = require("fs");
const path = require("path");
const College = require("../../models/admin/collegemodel");
const slugify = require("slugify");

// Generate a unique slug from name
const generateUniqueSlug = async (name) => {
  let baseSlug = slugify(name, { lower: true, strict: true });
  let slug = baseSlug;
  let count = 1;

  while (await College.findOne({ slug })) {
    slug = `${baseSlug}-${count++}`;
  }

  return slug;
};

const extractTabsFromRow = (row) => {
  const tabs = [];

  for (let i = 1; i <= 5; i++) { // You can adjust 5 to however many tabs you expect max
    const titleKey = `tab${i}-title`;
    const descKey = `tab${i}-description`;

    if (row[titleKey] && row[descKey]) {
      tabs.push({
        title: row[titleKey].toString().trim(),
        description: row[descKey].toString().trim(),
      });
    }
  }

  return tabs;
};


// Convert "url|url" => [url1, url2]
const formatImages = (imagesStr) => {
  if (!imagesStr) return [];
  return imagesStr.split("|").map((img) => img.trim());
};

exports.importCollegeFromExcel = async (req, res) => {
  console.log("req body import files", req.body);
  console.log("hit import excel");

  try {
    if (!req.file) {
      return res.status(400).json({ error: "No Excel file uploaded." });
    }

    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const imported = [];
    const failed = [];

    for (const row of sheetData) {
      try {
        const slug = await generateUniqueSlug(row.name);
        const safeField = (value, fallback = "-") => {
          if (typeof value === "string" && value.trim() !== "") return value.trim();
          if (typeof value === "number" && !isNaN(value)) return value;
          return fallback;
        };
        
        const college = new College({
          name: safeField(row.name),
          slug,
          description: safeField(row.description),
          about: safeField(row.about),
          state: safeField(row.state),
          city: safeField(row.city),
          address: safeField(row.address),
          location: safeField(row.location),
          rank: Number(row.rank) || 0,
          fees: Number(row.fees) || 0,
          avgPackage: Number(row.avgPackage) || 0,
          tabs: extractTabsFromRow(row),
          image: safeField(row.image, ""),
          imageGallery: formatImages(row.imageGallery),
          website: safeField(row.website),
          contact: safeField(row.contact),
          contactEmail: safeField(row.contactEmail, `default${Date.now()}@example.com`),
        });
        

        await college.save();
        imported.push(college);
      } catch (err) {
        console.error(`Failed to import college: ${row.name}`, err);
        failed.push({
          college: row.name,
          error: err.message,
        });
      }
    }

    // Delete temp file
    fs.unlinkSync(req.file.path);

    // Return the result
    res.status(201).json({
      message: `Import completed.`,
      successCount: imported.length,
      failedCount: failed.length,
      failedColleges: failed,
    });
    
  } catch (err) {
    console.error("Excel import error:", err);
    res.status(500).json({ error: "Failed to import colleges", details: err.message });
  }
};

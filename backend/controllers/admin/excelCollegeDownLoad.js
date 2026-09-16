// // const ExcelJS = require("exceljs");
// // const axios = require("axios");
// // const College = require("../../models/admin/collegemodel");
// // const path = require("path");

// // // Helper to strip HTML tags
// // function stripHtml(html) {
// //   if (!html) return "";
// //   return html.replace(/<[^>]*>/g, "").trim();
// // }

// // // Helper to download image and return buffer
// // async function fetchImageBuffer(imageUrl) {
// //   try {
// //     const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
// //     return Buffer.from(response.data, "binary");
// //   } catch (err) {
// //     console.error(`Failed to fetch image at ${imageUrl}:`, err.message);
// //     return null;
// //   }
// // }

// // exports.exportColleges = async (req, res) => {
// //   try {
// //     const selectedIdsParam = req.query.ids;
// //     const selectedIds = selectedIdsParam ? selectedIdsParam.split(",") : [];
// //     const query = selectedIds.length > 0 ? { _id: { $in: selectedIds } } : {};

// //     const colleges = await College.find(query)
// //       .populate("stream", "name")
// //       .populate("approvel", "name")
// //       .populate("affiliatedby", "name")
// //       .populate("examExpected", "name")
// //       .populate("ownership", "name")
// //       .lean();

// //     const workbook = new ExcelJS.Workbook();
// //     const sheet = workbook.addWorksheet("Colleges");

// //     // Define columns
// //     sheet.columns = [
// //       { header: "College ID", key: "collegeId", width: 10 },
// //       { header: "image", key: "image", width: 15 },
// //       { header: "Mongo_id", key: "mongoId", width: 30 },
// //       { header: "name", key: "name", width: 30 },
// //       { header: "Slug", key: "slug", width: 25 },
// //       { header: "description", key: "description", width: 50 },
// //       { header: "about", key: "about", width: 50 },
// //       { header: "state", key: "state", width: 15 },
// //       { header: "city", key: "city", width: 15 },
// //       { header: "stream", key: "streams", width: 30 },
// //       { header: "approvel", key: "approvals", width: 30 },
// //       { header: "affiliatedby", key: "affiliatedby", width: 30 },
// //       { header: "examExpected", key: "examExpected", width: 30 },
// //       { header: "ownership", key: "ownership", width: 30 },
// //       { header: "rank", key: "rank", width: 10 },
// //       { header: "fees", key: "fees", width: 10 },
// //       { header: "avgPackage", key: "avgPackage", width: 15 },
// //       { header: "website", key: "website", width: 30 },
// //       { header: "contact", key: "contact", width: 15 },
// //       { header: "contactEmail", key: "contactEmail", width: 30 },
// //       { header: "featured", key: "featured", width: 10 },
// //       { header: "address", key: "address", width: 40 },
// //       { header: "location", key: "location", width: 30 },
// //     ];

// //     // Apply wrap and alignment
// //     sheet.columns.forEach((col) => {
// //       col.style = {
// //         alignment: { wrapText: true, horizontal: "left", vertical: "top" },
// //       };
// //     });

// //     let collegeIdCounter = 1;

// //     for (let i = 0; i < colleges.length; i++) {
// //       const college = colleges[i];
// //       const rowIndex = i + 2; // 1-based row index (row 1 is header)

// //       // Add row
// //       sheet.addRow({
// //         collegeId: collegeIdCounter++,
// //         image: "",
// //         mongoId: college._id.toString(),
// //         name: college.name,
// //         slug: college.slug,
// //         description: stripHtml(college.description),
// //         about: stripHtml(college.about),
// //         state: college.state,
// //         city: college.city,
// //         streams: JSON.stringify(college.stream?.map((s) => s.name) || []),
// //         approvals: JSON.stringify(college.approvel?.map((a) => a.name) || []),
// //         affiliatedby: college.affiliatedby?.name || "",
// //         examExpected: JSON.stringify(
// //           college.examExpected?.map((e) => e.name) || []
// //         ),
// //         ownership: college.ownership?.name || "",
// //         rank: college.rank,
// //         fees: college.fees,
// //         avgPackage: college.avgPackage,
// //         website: college.website,
// //         contact: college.contact,
// //         contactEmail: college.contactEmail,
// //         featured: college.featured ? "Yes" : "No",
// //         address: college.address,
// //         location: college.location,
// //       });

// //       // Insert image
// //       if (college.image) {
// //         let imageUrl = college.image;

// //         // Fix local path
// //         if (imageUrl.startsWith("/uploads")) {
// //           imageUrl = `${req.protocol}://${req.get("host")}${imageUrl}`;
// //         }

// //         const imageBuffer = await fetchImageBuffer(imageUrl);

// //         if (imageBuffer) {
// //           let ext = path.extname(imageUrl).slice(1).toLowerCase();
// //           const supportedExtensions = ["jpeg", "jpg", "png", "gif"];
// //           if (!supportedExtensions.includes(ext)) {
// //             ext = "jpeg";
// //           }

// //           const imageId = workbook.addImage({
// //             buffer: imageBuffer,
// //             extension: ext,
// //           });

// //           sheet.getRow(rowIndex).height = 60;

// //           sheet.addImage(imageId, {
// //             tl: { col: 1, row: rowIndex - 1 },
// //             ext: { width: 80, height: 80 },
// //             editAs: "oneCell",
// //           });
// //         }
// //       }
// //     }

// //     // Return Excel file
// //     res.setHeader(
// //       "Content-Type",
// //       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
// //     );
// //     res.setHeader("Content-Disposition", "attachment; filename=colleges.xlsx");

// //     await workbook.xlsx.write(res);
// //     res.end();
// //   } catch (error) {
// //     console.error("Error exporting colleges:", error);
// //     res.status(500).json({ error: "Failed to export colleges" });
// //   }
// // };

// require("dotenv").config();
// const ExcelJS = require("exceljs");
// const axios = require("axios");
// const path = require("path");
// const College = require("../../models/admin/collegemodel");

// // Helper to strip HTML tags
// function stripHtml(html) {
//   if (!html) return "";
//   return html.replace(/<[^>]*>/g, "").trim();
// }

// // Helper to download image and return buffer
// async function fetchImageBuffer(imageUrl) {
//   try {
//     const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
//     return Buffer.from(response.data, "binary");
//   } catch (err) {
//     console.warn(`⚠ Failed to fetch image at ${imageUrl}:`, err.message);
//     return null;
//   }
// }

// exports.exportColleges = async (req, res) => {
//   try {
//     const selectedIdsParam = req.query.ids;
//     const selectedIds = selectedIdsParam ? selectedIdsParam.split(",") : [];
//     const query = selectedIds.length > 0 ? { _id: { $in: selectedIds } } : {};

//     const colleges = await College.find(query)
//       .populate("stream", "name")
//       .populate("approvel", "name")
//       .populate("affiliatedby", "name")
//       .populate("examExpected", "name")
//       .populate("ownership", "name")
//       .lean();

//     const workbook = new ExcelJS.Workbook();
//     const sheet = workbook.addWorksheet("Colleges");

//     // Define columns
//     sheet.columns = [
//       { header: "College ID", key: "collegeId", width: 10 },
//       { header: "Image", key: "image", width: 15 },
//       { header: "Mongo ID", key: "mongoId", width: 30 },
//       { header: "Name", key: "name", width: 30 },
//       { header: "Slug", key: "slug", width: 25 },
//       { header: "Description", key: "description", width: 50 },
//       { header: "About", key: "about", width: 50 },
//       { header: "State", key: "state", width: 15 },
//       { header: "City", key: "city", width: 15 },
//       { header: "Streams", key: "streams", width: 30 },
//       { header: "Approvals", key: "approvals", width: 30 },
//       { header: "Affiliated By", key: "affiliatedby", width: 30 },
//       { header: "Exam Expected", key: "examExpected", width: 30 },
//       { header: "Ownership", key: "ownership", width: 30 },
//       { header: "Rank", key: "rank", width: 10 },
//       { header: "Fees", key: "fees", width: 10 },
//       { header: "Avg Package", key: "avgPackage", width: 15 },
//       { header: "Website", key: "website", width: 30 },
//       { header: "Contact Numbers", key: "contactNumbers", width: 30 },
//       { header: "Contact Email", key: "contactEmail", width: 30 },
//       { header: "Featured", key: "featured", width: 10 },
//       { header: "Address", key: "address", width: 40 },
//       { header: "Location", key: "location", width: 30 },
//     ];

//     // Apply wrap and alignment
//     sheet.columns.forEach((col) => {
//       col.style = {
//         alignment: { wrapText: true, horizontal: "left", vertical: "top" },
//       };
//     });

//     const BACKEND_URL = process.env.PUBLIC_BASE_URL || `${req.protocol}://${req.get("host")}`;
//     let collegeIdCounter = 1;

//     for (let i = 0; i < colleges.length; i++) {
//       const college = colleges[i];
//       const rowIndex = i + 2; // row 1 is header

//       // Add row
//       sheet.addRow({
//         collegeId: collegeIdCounter++,
//         image: "", // Placeholder; actual image added later
//         mongoId: college._id.toString(),
//         name: college.name,
//         slug: college.slug,
//         description: stripHtml(college.description),
//         about: stripHtml(college.about),
//         state: college.state,
//         city: college.city,
//         streams: JSON.stringify(college.stream?.map((s) => s.name) || []),
//         approvals: JSON.stringify(college.approvel?.map((a) => a.name) || []),
//         affiliatedby: college.affiliatedby?.name || "",
//         examExpected: JSON.stringify(college.examExpected?.map((e) => e.name) || []),
//         ownership: college.ownership?.name || "",
//         rank: college.rank,
//         fees: college.fees,
//         avgPackage: college.avgPackage,
//         website: college.website,
//         contactNumbers: college.contactNumbers
//           ?.map((c) => `${c.type}: ${c.number}`)
//           .join(", ") || "",
//         contactEmail: college.contactEmail,
//         featured: college.featured ? "Yes" : "No",
//         address: college.address,
//         location: college.location,
//       });

//       // Insert image if exists
//       if (college.image) {
//         let imageUrl = college.image.startsWith("/uploads")
//           ? `${BACKEND_URL}${college.image}`
//           : college.image;

//         const imageBuffer = await fetchImageBuffer(imageUrl);

//         if (imageBuffer) {
//           let ext = path.extname(imageUrl).slice(1).toLowerCase();
//           if (!["jpeg", "jpg", "png", "gif"].includes(ext)) ext = "jpeg";

//           const imageId = workbook.addImage({
//             buffer: imageBuffer,
//             extension: ext,
//           });

//           sheet.getRow(rowIndex).height = 60;

//           sheet.addImage(imageId, {
//             tl: { col: 1, row: rowIndex - 1 },
//             ext: { width: 80, height: 80 },
//             editAs: "oneCell",
//           });
//         }
//       }
//     }

//     // Send Excel file
//     res.setHeader(
//       "Content-Type",
//       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//     );
//     res.setHeader(
//       "Content-Disposition",
//       "attachment; filename=colleges.xlsx"
//     );

//     await workbook.xlsx.write(res);
//     res.end();
//   } catch (error) {
//     console.error("❌ Error exporting colleges:", error);
//     res.status(500).json({ error: "Failed to export colleges" });
//   }
// };

const axios = require("axios");
const path = require("path");
const ExcelJS = require("exceljs");
const College = require("../../models/admin/collegemodel");

// Helper to strip HTML tags
function stripHtml(html) {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").trim();
}

// Helper to download image and return buffer
async function fetchImageBuffer(imageUrl) {
  try {
    const response = await axios.get(imageUrl, {
      responseType: "arraybuffer",
      timeout: 10000,
    });

    return Buffer.from(response.data);
  } catch (err) {
    console.warn(`⚠ Failed to fetch image at ${imageUrl}:`, err.message);
    return null;
  }
}

exports.exportColleges = async (req, res) => {
  try {
    /*
      Examples:

      Export page 1 to 120:
      /export-colleges?pageFrom=1&pageTo=120&limit=10

      Export page 50 to 100:
      /export-colleges?pageFrom=50&pageTo=100&limit=10

      Export selected IDs:
      /export-colleges?ids=id1,id2,id3
    */

    const selectedIdsParam = req.query.ids;

    const selectedIds = selectedIdsParam
      ? selectedIdsParam.split(",").filter(Boolean)
      : [];

    let pageFrom = parseInt(req.query.pageFrom) || 1;
    let pageTo = parseInt(req.query.pageTo) || pageFrom;
    let limit = parseInt(req.query.limit) || 10;

    // Prevent invalid values
    if (pageFrom < 1) pageFrom = 1;

    if (pageTo < pageFrom) {
      pageTo = pageFrom;
    }

    if (limit < 1) {
      limit = 10;
    }

    let query = {};
    let mongoQuery;

    /*
     * CASE 1
     * Export selected college IDs
     */
    if (selectedIds.length > 0) {
      query = {
        _id: {
          $in: selectedIds,
        },
      };

      mongoQuery = College.find(query);
    }

    /*
     * CASE 2
     * Export page range
     */
    else {
      const skip = (pageFrom - 1) * limit;

      const numberOfPages = pageTo - pageFrom + 1;

      const totalRecords = numberOfPages * limit;

      console.log("Exporting colleges");
      console.log("Page From:", pageFrom);
      console.log("Page To:", pageTo);
      console.log("Per Page:", limit);
      console.log("Skip:", skip);
      console.log("Maximum Records:", totalRecords);

      mongoQuery = College.find({})
        // IMPORTANT:
        // Use the SAME sort that your college listing API uses
        .sort({ _id: 1 })
        .skip(skip)
        .limit(totalRecords);
    }

    const colleges = await mongoQuery
      .populate("stream", "name")
      .populate("approvel", "name")
      .populate("affiliatedby", "name")
      .populate("examExpected", "name")
      .populate("ownership", "name")
      .lean();

    if (!colleges.length) {
      return res.status(404).json({
        error: "No colleges found for the selected page range",
      });
    }

    const workbook = new ExcelJS.Workbook();

    const sheet = workbook.addWorksheet("Colleges");

    // Define columns
    sheet.columns = [
      {
        header: "College ID",
        key: "collegeId",
        width: 10,
      },
      {
        header: "Image",
        key: "image",
        width: 15,
      },
      {
        header: "Mongo ID",
        key: "mongoId",
        width: 30,
      },
      {
        header: "Name",
        key: "name",
        width: 30,
      },
      {
        header: "Slug",
        key: "slug",
        width: 25,
      },
      {
        header: "Description",
        key: "description",
        width: 50,
      },
      {
        header: "About",
        key: "about",
        width: 50,
      },
      {
        header: "State",
        key: "state",
        width: 15,
      },
      {
        header: "City",
        key: "city",
        width: 15,
      },
      {
        header: "Streams",
        key: "streams",
        width: 30,
      },
      {
        header: "Approvals",
        key: "approvals",
        width: 30,
      },
      {
        header: "Affiliated By",
        key: "affiliatedby",
        width: 30,
      },
      {
        header: "Exam Expected",
        key: "examExpected",
        width: 30,
      },
      {
        header: "Ownership",
        key: "ownership",
        width: 30,
      },
      {
        header: "Rank",
        key: "rank",
        width: 10,
      },
      {
        header: "Fees",
        key: "fees",
        width: 10,
      },
      {
        header: "Avg Package",
        key: "avgPackage",
        width: 15,
      },
      {
        header: "Website",
        key: "website",
        width: 30,
      },
      {
        header: "Contact Numbers",
        key: "contactNumbers",
        width: 30,
      },
      {
        header: "Contact Email",
        key: "contactEmail",
        width: 30,
      },
      {
        header: "Featured",
        key: "featured",
        width: 10,
      },
      {
        header: "Address",
        key: "address",
        width: 40,
      },
      {
        header: "Location",
        key: "location",
        width: 30,
      },
    ];

    // Header styling
    const headerRow = sheet.getRow(1);

    headerRow.font = {
      bold: true,
    };

    headerRow.alignment = {
      vertical: "middle",
      horizontal: "center",
    };

    headerRow.height = 25;

    // Apply wrapping/alignment
    sheet.columns.forEach((col) => {
      col.style = {
        alignment: {
          wrapText: true,
          horizontal: "left",
          vertical: "top",
        },
      };
    });

    const BACKEND_URL =
      process.env.PUBLIC_BASE_URL ||
      `${req.protocol}://${req.get("host")}`;

    /*
     * College ID should represent actual position
     * when exporting pages.
     *
     * Example:
     * Page 10, limit 10
     * first college ID = 91
     */
    let collegeIdCounter;

    if (selectedIds.length > 0) {
      collegeIdCounter = 1;
    } else {
      collegeIdCounter = (pageFrom - 1) * limit + 1;
    }

    for (let i = 0; i < colleges.length; i++) {
      const college = colleges[i];

      const row = sheet.addRow({
        collegeId: collegeIdCounter++,

        image: "",

        mongoId: college._id?.toString() || "",

        name: college.name || "",

        slug: college.slug || "",

        description: stripHtml(college.description),

        about: stripHtml(college.about),

        state: college.state || "",

        city: college.city || "",

        streams: JSON.stringify(
          college.stream?.map((s) => s.name) || []
        ),

        approvals: JSON.stringify(
          college.approvel?.map((a) => a.name) || []
        ),

        affiliatedby:
          college.affiliatedby?.name || "",

        examExpected: JSON.stringify(
          college.examExpected?.map((e) => e.name) || []
        ),

        ownership:
          college.ownership?.name || "",

        rank: college.rank || "",

        fees: college.fees || "",

        avgPackage:
          college.avgPackage || "",

        website:
          college.website || "",

        contactNumbers:
          college.contactNumbers
            ?.map(
              (c) =>
                `${c.type || ""}: ${c.number || ""}`
            )
            .join(", ") || "",

        contactEmail:
          college.contactEmail || "",

        featured:
          college.featured ? "Yes" : "No",

        address:
          college.address || "",

        location:
          college.location || "",
      });

      const rowIndex = row.number;

      /*
       * Insert image
       */
      if (college.image) {
        try {
          const imageUrl =
            college.image.startsWith("/uploads")
              ? `${BACKEND_URL}${college.image}`
              : college.image;

          const imageBuffer =
            await fetchImageBuffer(imageUrl);

          if (imageBuffer) {
            let ext = path
              .extname(imageUrl)
              .split("?")[0]
              .slice(1)
              .toLowerCase();

            if (ext === "jpg") {
              ext = "jpeg";
            }

            if (!["jpeg", "png", "gif"].includes(ext)) {
              ext = "jpeg";
            }

            const imageId =
              workbook.addImage({
                buffer: imageBuffer,
                extension: ext,
              });

            sheet.getRow(rowIndex).height = 65;

            sheet.addImage(imageId, {
              tl: {
                col: 1,
                row: rowIndex - 1,
              },
              ext: {
                width: 80,
                height: 80,
              },
              editAs: "oneCell",
            });
          }
        } catch (imageError) {
          console.warn(
            "Image processing failed:",
            imageError.message
          );
        }
      }
    }

    // Freeze header
    sheet.views = [
      {
        state: "frozen",
        ySplit: 1,
      },
    ];

    /*
     * File name
     */
    let fileName;

    if (selectedIds.length > 0) {
      fileName = "selected-colleges.xlsx";
    } else {
      fileName = `colleges-page-${pageFrom}-to-${pageTo}.xlsx`;
    }

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${fileName}"`
    );

    await workbook.xlsx.write(res);

    res.end();
  } catch (error) {
    console.error(
      "❌ Error exporting colleges:",
      error
    );

    if (!res.headersSent) {
      res.status(500).json({
        error: "Failed to export colleges",
      });
    }
  }
};
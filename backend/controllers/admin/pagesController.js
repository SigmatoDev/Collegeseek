const fs = require("fs");
const path = require("path");
const Page = require("../../models/admin/Page");
const slugify = require("slugify");



// exports.createPages = async (req, res) => {
//   console.log("hit me new page creation");
//   try {
//     const { title, description, content } = req.body;
//     if (!title || !description || !content) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }
//     // Generate a slug from the title if it's not provided
//     let slug = slugify(title, { lower: true });
//     // Check if the slug already exists in the database
//     let existingPage = await Page.findOne({ slug });
//     let originalSlug = slug;
//     let count = 1;
//     // If the slug exists, append a number to make it unique
//     while (existingPage) {
//       slug = `${originalSlug}-${count}`;
//       existingPage = await Page.findOne({ slug });
//       count++;
//     }
//     const parsedContent =
//       typeof content === "string" ? JSON.parse(content) : content;
//     // Loop through blocks to process base64 images
//     const processedBlocks = await Promise.all(
//       parsedContent.blocks.map(async (block) => {
//         if (
//           block.type === "image" &&
//           block.data &&
//           block.data.file &&
//           block.data.file.url?.startsWith("data:image/")
//         ) {
//           const base64Data = block.data.file.url;
//           const matches = base64Data.match(/^data:(image\/.+);base64,(.+)$/);
//           if (!matches) {
//             throw new Error("Failed to process image format.");
//           }
//           const ext = matches[1].split("/")[1];
//           const base64 = matches[2];
//           const buffer = Buffer.from(base64, "base64");
//           const fileName = `${Date.now()}-${Math.floor(
//             Math.random() * 1000
//           )}.${ext}`;
//           const filePath = path.join(__dirname, "../../uploads", fileName);
//           fs.writeFileSync(filePath, buffer);
//           // Replace the base64 with a URL path
//           block.data.file.url = `/uploads/${fileName}`;
//         }
//         return block;
//       })
//     );
//     // Create the new page
//     const newPage = new Page({
//       title,
//       description,
//       slug, // Ensure the slug is set
//       content: {
//         ...parsedContent,
//         blocks: processedBlocks,
//       },
//     });
//     await newPage.save();
//     res.status(200).json(newPage);
//   } catch (error) {
//     console.error("Error creating page:", error);
//     res
//       .status(500)
//       .json({ message: "Failed to process images", error: error.message });
//   }
// };
// exports.getPageById = async (req, res) => {
//   try {
//     const page = await Page.findById(req.params.id);
//     if (!page) {
//       return res.status(404).json({ message: "Page not found" });
//     }
//     res.status(200).json(page);
//   } catch (error) {
//     console.error("Fetch page error:", error);
//     res.status(500).json({ message: "Server error", error });
//   }
// };
exports.createPages = async (req, res) => {
  console.log("hit me new page creation");
  try {
    const { title, description, content } = req.body;

    if (!title || !description || !content) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create slug
    let slug = slugify(title, { lower: true });
    let existingPage = await Page.findOne({ slug });

    let originalSlug = slug;
    let count = 1;

    while (existingPage) {
      slug = `${originalSlug}-${count}`;
      existingPage = await Page.findOne({ slug });
      count++;
    }

    // TinyMCE sends HTML content, DO NOT JSON.parse()
    let processedContent = content;

    // Find base64 images inside TinyMCE HTML
    const base64Images = [
      ...content.matchAll(/<img[^>]+src="data:(image\/[^;]+);base64,([^"]+)"/g),
    ];

    for (const match of base64Images) {
      const mimeType = match[1];
      const base64Data = match[2];

      const ext = mimeType.split("/")[1];
      const buffer = Buffer.from(base64Data, "base64");

      const fileName = `${Date.now()}-${Math.floor(Math.random() * 1000)}.${ext}`;
      const filePath = path.join(__dirname, "../../uploads", fileName);

      fs.writeFileSync(filePath, buffer);

      // Replace base64 with image URL
      processedContent = processedContent.replace(
        match[0],
        match[0].replace(
          /src="[^"]+"/,
          `src="/uploads/${fileName}"`
        )
      );
    }

    // Save page
    const newPage = new Page({
      title,
      description,
      slug,
      content: processedContent, // Save cleaned HTML
    });

    await newPage.save();

    res.status(200).json(newPage);
  } catch (error) {
    console.error("Error creating page:", error);
    res.status(500).json({
      message: "Failed to process images",
      error: error.message,
    });
  }
};
exports.getPageById = async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);
    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }
    res.status(200).json({ page }); // :white_check_mark: Wrap inside `page`
  } catch (error) {
    console.error("Fetch page error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
exports.getPageBySlug = async (req, res) => {
  console.log("hit me slug");
  try {
    // Find the page by slug (use `findOne` to query by slug)
    const page = await Page.findOne({ slug: req.params.slug }); // Querying by `slug`, not `_id`
    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }
    // Send the page data as a response
    res.status(200).json(page);
  } catch (error) {
    console.error("Fetch page error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
exports.getPages = async (req, res) => {
  try {
    // Get page and limit from query params, set defaults if not provided
    const page = parseInt(req.query.page) || 1;       // Default page 1
    const limit = parseInt(req.query.limit) || 10;    // Default 10 items per page

    // Calculate how many documents to skip
    const skip = (page - 1) * limit;

    // Fetch total number of pages for metadata
    const totalPages = await Page.countDocuments();

    if (totalPages === 0) {
      return res.status(404).json({ message: "No pages found" });
    }

    // Fetch pages with pagination
    const pages = await Page.find()
      .skip(skip)
      .limit(limit);

    // Return paginated results with metadata
    res.status(200).json({
      totalPages,
      currentPage: page,
      pagesPerPage: limit,
      pages,
    });
  } catch (error) {
    console.error("Error fetching pages:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
exports.deletePageById = async (req, res) => {
  try {
    const pageId = req.params.id;

    const page = await Page.findById(pageId);

    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }

    // NEW: Safe check for page.content
    let imageMatches = [];

    if (page.content && typeof page.content === "string") {
      imageMatches = [...page.content.matchAll(/src="\/uploads\/([^"]+)"/g)];
    }

    // Delete matched images
    imageMatches.forEach(([_, filename]) => {
      const filePath = path.join(__dirname, "../../uploads", filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    // Delete the page
    await Page.findByIdAndDelete(pageId);

    res.status(200).json({ message: "Page deleted successfully" });
  } catch (error) {
    console.error("Error deleting page:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

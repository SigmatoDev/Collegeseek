const fs = require("fs");
const path = require("path");
const Page = require("../../models/admin/Page");
const slugify = require("slugify");
exports.createPages = async (req, res) => {
  console.log("hit me new page creation");
  try {
    const { title, description, content } = req.body;
    if (!title || !description || !content) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    // Generate a slug from the title if it's not provided
    let slug = slugify(title, { lower: true });
    // Check if the slug already exists in the database
    let existingPage = await Page.findOne({ slug });
    let originalSlug = slug;
    let count = 1;
    // If the slug exists, append a number to make it unique
    while (existingPage) {
      slug = `${originalSlug}-${count}`;
      existingPage = await Page.findOne({ slug });
      count++;
    }
    const parsedContent =
      typeof content === "string" ? JSON.parse(content) : content;
    // Loop through blocks to process base64 images
    const processedBlocks = await Promise.all(
      parsedContent.blocks.map(async (block) => {
        if (
          block.type === "image" &&
          block.data &&
          block.data.file &&
          block.data.file.url?.startsWith("data:image/")
        ) {
          const base64Data = block.data.file.url;
          const matches = base64Data.match(/^data:(image\/.+);base64,(.+)$/);
          if (!matches) {
            throw new Error("Failed to process image format.");
          }
          const ext = matches[1].split("/")[1];
          const base64 = matches[2];
          const buffer = Buffer.from(base64, "base64");
          const fileName = `${Date.now()}-${Math.floor(
            Math.random() * 1000
          )}.${ext}`;
          const filePath = path.join(__dirname, "../../uploads", fileName);
          fs.writeFileSync(filePath, buffer);
          // Replace the base64 with a URL path
          block.data.file.url = `/uploads/${fileName}`;
        }
        return block;
      })
    );
    // Create the new page
    const newPage = new Page({
      title,
      description,
      slug, // Ensure the slug is set
      content: {
        ...parsedContent,
        blocks: processedBlocks,
      },
    });
    await newPage.save();
    res.status(200).json(newPage);
  } catch (error) {
    console.error("Error creating page:", error);
    res
      .status(500)
      .json({ message: "Failed to process images", error: error.message });
  }
};
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
    // Fetch all pages from the database
    const pages = await Page.find();
    if (!pages || pages.length === 0) {
      return res.status(404).json({ message: "No pages found" });
    }
    // Return the list of pages
    res.status(200).json(pages);
  } catch (error) {
    console.error("Error fetching pages:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
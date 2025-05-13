const fs = require("fs");
const path = require("path");
const slugify = require("slugify");
const Page = require("../../models/admin/Page");

exports.updatePage = async (req, res) => {
  console.log("Hit me to update page");

  try {
    const { title, description, content } = req.body;
    const { id } = req.params;  // Get the page ID from the URL params

    if (!title || !description || !content) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find the existing page by ID
    let existingPage = await Page.findById(id);

    if (!existingPage) {
      return res.status(404).json({ message: "Page not found" });
    }

    const parsedContent =
      typeof content === "string" ? JSON.parse(content) : content;

    // Process base64 images in the content
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

    // Update the existing page with new data
    existingPage.title = title;
    existingPage.description = description;
    // We will not update the slug, just leave it as is
    existingPage.content = {
      ...parsedContent,
      blocks: processedBlocks,
    };

    // Save the updated page to the database
    await existingPage.save();

    res.status(200).json(existingPage);
  } catch (error) {
    console.error("Error updating page:", error);
    res
      .status(500)
      .json({ message: "Failed to update page", error: error.message });
  }
};

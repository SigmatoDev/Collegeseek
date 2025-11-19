const path = require("path");
const fs = require("fs");
const Page = require("../../models/admin/Page"); // Adjust to your path
exports.updatePageById = async (req, res) => {
  try {
    const pageId = req.params.id;
    const { title, description, content } = req.body;
    if (!title || !description || !content) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const page = await Page.findById(pageId);
    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }
    const parsedContent =
      typeof content === "string" ? JSON.parse(content) : content;
    // Process image blocks (base64 -> file)
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
            throw new Error("Invalid base64 image format.");
          }
          const ext = matches[1].split("/")[1];
          const base64 = matches[2];
          const buffer = Buffer.from(base64, "base64");
          const fileName = `${Date.now()}-${Math.floor(
            Math.random() * 1000
          )}.${ext}`;
          const filePath = path.join(__dirname, "../../uploads", fileName);
          fs.writeFileSync(filePath, buffer);
          // Replace with static URL
          block.data.file.url = `/uploads/${fileName}`;
        }
        return block;
      })
    );
    // Update page fields
    page.title = title;
    page.description = description;
    page.content = {
      ...parsedContent,
      blocks: processedBlocks,
    };
    await page.save();
    res.status(200).json({ message: "Page updated successfully", page });
  } catch (error) {
    console.error("Error updating page:", error);
    res.status(500).json({ message: "Update failed", error: error.message });
  }
};
// exports.updatePageById = async (req, res) => {
//   try {
//     const pageId = req.params.id;
//     const { title, description, content } = req.body;

//     if (!title || !description || !content) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     const page = await Page.findById(pageId);
//     if (!page) {
//       return res.status(404).json({ message: "Page not found" });
//     }

//     // TinyMCE sends HTML — DO NOT JSON.parse()
//     let processedContent = content;

//     // Find all base64 images inside HTML
//     const base64Images = [
//       ...content.matchAll(/<img[^>]+src="data:(image\/[^;]+);base64,([^"]+)"/g),
//     ];

//     for (const match of base64Images) {
//       const mimeType = match[1];
//       const base64Data = match[2];

//       const ext = mimeType.split("/")[1];
//       const buffer = Buffer.from(base64Data, "base64");

//       const fileName = `${Date.now()}-${Math.floor(Math.random() * 1000)}.${ext}`;
//       const filePath = path.join(__dirname, "../../uploads", fileName);

//       fs.writeFileSync(filePath, buffer);

//       // Replace base64 image with image URL
//       processedContent = processedContent.replace(
//         match[0],
//         match[0].replace(/src="[^"]+"/, `src="/uploads/${fileName}"`)
//       );
//     }

//     // Update page fields
//     page.title = title;
//     page.description = description;
//     page.content = processedContent;

//     await page.save();

//     res.status(200).json({ message: "Page updated successfully", page });
//   } catch (error) {
//     console.error("Error updating page:", error);
//     res.status(500).json({
//       message: "Update failed",
//       error: error.message,
//     });
//   }
// };

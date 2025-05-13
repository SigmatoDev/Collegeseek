// const mongoose = require('mongoose');
// const Page = require("../../models/admin/Page");
// const Module = require("../../models/admin/Module");
// const path = require('path');
// const fs = require('fs');
// const multer = require('multer');
// const slugify = require('slugify'); // Add slugify for slug generation



// // Create uploads directory if it doesn't exist
// // Ensure uploads directory exists
// const uploadDir = path.join(__dirname, '..', 'uploads');
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// // Configure Multer for file storage
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, uploadDir);
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     const ext = path.extname(file.originalname);
//     cb(null, file.fieldname + '-' + uniqueSuffix + ext);
//   },
// });

// // Multer middleware to handle a single file with field name 'image'
// const upload = multer({
//   storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
// }).single('image'); // Updated field name from 'file' to 'image'

// // File upload route handler
// const uploadImage = (req, res) => {
//   upload(req, res, function (err) {
//     if (err instanceof multer.MulterError) {
//       return res.status(400).json({ success: 0, message: err.message });
//     } else if (err) {
//       return res.status(500).json({ success: 0, message: 'Server error, please try again.' });
//     }

//     if (!req.file) {
//       return res.status(400).json({ success: 0, message: 'No file uploaded' });
//     }

//     // Step 4: Construct the file URL
//     const fileUrl = `/uploads/${req.file.filename}`;

//     // Step 5: Return the file URL in the response
//     return res.status(200).json({
//       success: 1,
//       url: fileUrl,
//     });
//   });
// };

// // Function to generate and ensure unique slug
// const generateUniqueSlug = async (title) => {
//   let slug = slugify(title, { lower: true, strict: true }); // Generate the slug from the title
//   let existingPage = await Page.findOne({ slug });

//   // If the slug already exists, append a timestamp or a random value to make it unique
//   while (existingPage) {
//     slug = `${slug}-${new Date().getTime()}`;
//     existingPage = await Page.findOne({ slug });
//   }

//   return slug;
// };

// const createPage = async (req, res) => {
//   try {
//     console.log("API hit: Creating a new page");

//     const { title, description, modules } = req.body;

//     // Basic validation
//     if (!title || !description || !Array.isArray(modules)) {
//       return res.status(400).json({
//         message: "Title, description, and modules (as an array) are required.",
//       });
//     }

//     // Optional: Validate each module's structure
//     const formattedModules = modules.map((mod, index) => {
//       if (!mod.moduleId || typeof mod.order !== "number") {
//         throw new Error(`Invalid module at index ${index}`);
//       }

//       return {
//         moduleId: mod.moduleId,
//         order: mod.order,
//       };
//     });

//     // Generate a unique slug based on the title
//     const slug = await generateUniqueSlug(title);

//     // Create new page with the generated slug
//     const newPage = new Page({
//       title: title.trim(),
//       description: typeof description === "string" ? description.trim() : JSON.stringify(description),
//       modules: formattedModules,
//       slug: slug, // Add the slug to the new page document
//     });

//     await newPage.save();

//     console.log("Page created successfully:", newPage);

//     return res.status(201).json({
//       message: "Page created successfully",
//       page: newPage,
//     });
//   } catch (err) {
//     console.error("Error creating page:", err.message);
//     return res.status(500).json({
//       message: "Failed to create page",
//       error: err.message,
//     });
//   }
// };




// // Get all pages
// const getPages = async (req, res) => {
//   try {
//     // Fetch pages and populate modules
//     const pages = await Page.find().populate("modules.moduleId");
    
//     // Log the fetched pages for debugging

//     res.status(200).json(pages);
//   } catch (err) {
//     // Log the error for debugging

//     res.status(500).json({ message: "Failed to fetch pages" });
//   }
// };


// const getPageById = async (req, res) => {
//   const { id } = req.params;  // Get the ID from the route parameter

//   // Ensure the ID is a valid ObjectId before querying
//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return res.status(400).json({ message: "Invalid ID format" });
//   }

//   try {
//     const page = await Page.findById(id).populate("modules.moduleId");
//     if (!page) {
//       return res.status(404).json({ message: "Page not found" });
//     }
//     res.status(200).json(page);
//   } catch (err) {
//     console.error("Error fetching page by ID:", err);
//     res.status(500).json({ message: "Failed to fetch page" });
//   }
// };


// // Update Page
// const updatePage = async (req, res) => {
//   try {
//     const pageId = req.params.id;
//     const { title, description, modules } = req.body;

//     const page = await Page.findById(pageId);

//     if (!page) {
//       return res.status(404).json({ message: "Page not found" });
//     }

//     // Update the slug if the title changes
//     let slug = page.slug;
//     if (title && title !== page.title) {
//       slug = await generateUniqueSlug(title);
//     }

//     // Validate and format modules
//     const formattedModules = modules.map((mod, index) => {
//       if (!mod.moduleId || typeof mod.order !== "number") {
//         throw new Error(`Invalid module at index ${index}`);
//       }
//       return {
//         moduleId: mod.moduleId,
//         order: mod.order,
//       };
//     });

//     // Update the page document
//     page.title = title || page.title;
//     page.description = description || page.description;
//     page.modules = formattedModules;
//     page.slug = slug;

//     await page.save();

//     res.status(200).json({
//       message: "Page updated successfully",
//       page,
//     });
//   } catch (err) {
//     console.error("Error updating page:", err.message);
//     res.status(500).json({
//       message: "Failed to update page",
//       error: err.message,
//     });
//   }
// };

// // Delete Page
// const deletePage = async (req, res) => {
//   try {
//     const pageId = req.params.id;

//     const page = await Page.findById(pageId);

//     if (!page) {
//       return res.status(404).json({ message: "Page not found" });
//     }

//     await page.remove();
//     res.status(200).json({ message: "Page deleted successfully" });
//   } catch (err) {
//     console.error("Error deleting page:", err.message);
//     res.status(500).json({
//       message: "Failed to delete page",
//       error: err.message,
//     });
//   }
// };


// module.exports = {
//   createPage,
//   getPages,
//   getPageById,
//   updatePage,
//   deletePage,
//   uploadImage, 
// };

const mongoose = require("mongoose"); // ✅ Import mongoose
const Blog = require("../../models/admin/blogModel"); // ✅ Use correct model
const multer = require("multer");
const slugify = require("slugify");
const path = require("path");

// ✅ Configure Multer Storage for Image Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // ✅ Ensure `uploads/` directory exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // ✅ Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPG, PNG, and WEBP are allowed."), false);
    }
  },
}).single("image"); // ✅ Accept only a single image

// ✅ Create a new blog
const createBlog = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      console.log("📥 Incoming Request:", { body: req.body, file: req.file });

      // ✅ Destructure request body
      const { title, content, author, category, publishedDate } = req.body;

      // ✅ Validate required fields with clearer error
      const missingFields = [];
      if (!title || !title.trim()) missingFields.push("title");
      if (!content || !content.trim()) missingFields.push("content");
      if (!author || !author.trim()) missingFields.push("author");
      // if (!category || !category.trim()) missingFields.push("category");

      if (missingFields.length > 0) {
        return res.status(400).json({
          message: `Missing required field(s): ${missingFields.join(", ")}`,
        });
      }

      // ✅ Handle Image Upload
      const image = req.file ? `/uploads/${req.file.filename}` : null;

      // ✅ Generate slug from title
      let baseSlug = slugify(title, { lower: true, strict: true });
      let slug = baseSlug;
      let count = 1;

      // ✅ Ensure slug is unique
      while (await Blog.findOne({ slug })) {
        slug = `${baseSlug}-${count++}`;
      }

      // ✅ Create a new blog post
      const blog = new Blog({
        title,
        content,
        author,
        // category,
        publishedDate: publishedDate || new Date(),
        image,
        slug,
      });

      // ✅ Save to database
      await blog.save();

      console.log("✅ Blog successfully created:", blog);
      res.status(201).json({ message: "Blog created successfully", blog });
    } catch (error) {
      console.error("❌ Error creating blog:", error);
      res.status(500).json({ error: "Failed to create blog", details: error.message });
    }
  });
};




// ✅ Get all blogs
const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (error) {
    console.error("❌ Error fetching blogs:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllBlog = async (req, res) => {
  try {
    // Extract page and limit from query parameters (defaults if not provided)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Calculate the skip value based on the page and limit
    const skip = (page - 1) * limit;

    // Fetch blogs with pagination
    const blogs = await Blog.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Count total blogs for pagination metadata
    const totalBlogs = await Blog.countDocuments();

    // Send response with pagination info
    res.status(200).json({
      blogs,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalBlogs / limit),
        totalBlogs
      }
    });
  } catch (error) {
    console.error("❌ Error fetching blogs:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// ✅ Get a single blog by ID
const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Validate ID format before querying
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid blog ID" });
    }

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json(blog);
  } catch (error) {
    console.error("❌ Error fetching blog:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Update a blog
// ✅ Update a blog
const updateBlog = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const { title, content, author, category, tags, publishedDate } = req.body;
      
      let updatedFields = {
        title,
        content,
        author,
        category,
        tags,
        publishedDate,
      };

      // ✅ Generate and update slug
      if (title) {
        updatedFields.slug = slugify(title, { lower: true, strict: true });
      }

      // ✅ Handle Image Update
      if (req.file) {
        updatedFields.image = `/uploads/${req.file.filename}`;
      }

      const updatedBlog = await Blog.findByIdAndUpdate(
        req.params.id,
        updatedFields,
        { new: true }
      );

      if (!updatedBlog) {
        return res.status(404).json({ message: "Blog not found" });
      }

      res.status(200).json(updatedBlog);
    } catch (error) {
      console.error("❌ Error updating blog:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
};
const getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.query;

    // Validate that slug is provided and is not empty
    if (!slug || typeof slug !== 'string' || slug.trim() === "") {
      return res.status(400).json({ message: "Slug is required and must be a non-empty string" });
    }

    // Fetch the blog using the slug
    const blog = await Blog.findOne({ slug });

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Return the blog details as response
    res.status(200).json({
      id: blog._id,
      title: blog.title,
      slug: blog.slug,
      image: blog.image,
      content: blog.content,
      author: blog.author,
      category: blog.category,
      createdAt: blog.createdAt,
    });
  } catch (error) {
    console.error("❌ Error fetching blog by slug:", error.message);

    // Handle different error cases
    if (error instanceof mongoose.Error) {
      return res.status(500).json({ message: "Database error", details: error.message });
    }

    res.status(500).json({ message: "Server error", details: error.message });
  }
};


// ✅ Delete a blog
const deleteBlog = async (req, res) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
    if (!deletedBlog) return res.status(404).json({ message: "Blog not found" });
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting blog:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Export functions
module.exports = {
  createBlog,
  getAllBlogs,
  getAllBlog,
  getBlogById,
  updateBlog,
  getBlogBySlug,
  deleteBlog,
};

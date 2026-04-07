const mongoose = require("mongoose");
const Blog = require("../../models/admin/blogModel");
const multer = require("multer");
const slugify = require("slugify");
const path = require("path");

// ✅ AWS SDK v3
const { S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const multerS3 = require("multer-s3");

// ✅ Initialize S3
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// ✅ Multer S3 Storage
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      const fileName = `uploads/${Date.now()}-${file.originalname}`;
      cb(null, fileName);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPG, PNG, and WEBP are allowed."), false);
    }
  },
}).single("image");


// ✅ Create Blog
const createBlog = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err.message });

    try {
      const { title, content, author, category, publishedDate } = req.body;

      const missingFields = [];
      if (!title?.trim()) missingFields.push("title");
      if (!content?.trim()) missingFields.push("content");
      if (!author?.trim()) missingFields.push("author");

      if (missingFields.length > 0) {
        return res.status(400).json({
          message: `Missing required field(s): ${missingFields.join(", ")}`,
        });
      }

      // ✅ S3 URL
      const image = req.file ? req.file.location : null;

      let baseSlug = slugify(title, { lower: true, strict: true });
      let slug = baseSlug;
      let count = 1;

      while (await Blog.findOne({ slug })) {
        slug = `${baseSlug}-${count++}`;
      }

      const blog = new Blog({
        title,
        content,
        author,
        publishedDate: publishedDate || new Date(),
        image,
        slug,
      });

      await blog.save();

      res.status(201).json({ message: "Blog created successfully", blog });
    } catch (error) {
      res.status(500).json({ error: "Failed to create blog", details: error.message });
    }
  });
};


// ✅ Get All Blogs
const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// ✅ Paginated Blogs
const getAllBlog = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const blogs = await Blog.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalBlogs = await Blog.countDocuments();

    res.status(200).json({
      blogs,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalBlogs / limit),
        totalBlogs,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// ✅ Get Blog By ID
const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid blog ID" });
    }

    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// ✅ Update Blog
const updateBlog = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err.message });

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

      if (title) {
        updatedFields.slug = slugify(title, { lower: true, strict: true });
      }

      // ✅ If new image uploaded
      if (req.file) {
        const oldBlog = await Blog.findById(req.params.id);

        // 🔥 Delete old image from S3
        if (oldBlog?.image) {
          const oldKey = oldBlog.image.split(".amazonaws.com/")[1];

          await s3.send(
            new DeleteObjectCommand({
              Bucket: process.env.AWS_BUCKET_NAME,
              Key: oldKey,
            })
          );
        }

        updatedFields.image = req.file.location;
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
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
};


// ✅ Get Blog By Slug
const getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.query;

    if (!slug || typeof slug !== "string" || slug.trim() === "") {
      return res.status(400).json({ message: "Slug is required" });
    }

    const blog = await Blog.findOne({ slug });
    if (!blog) return res.status(404).json({ message: "Blog not found" });

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
    res.status(500).json({ message: "Server error", details: error.message });
  }
};


// ✅ Delete Blog
const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) return res.status(404).json({ message: "Blog not found" });

    // 🔥 Delete image from S3
    if (blog.image) {
      const key = blog.image.split(".amazonaws.com/")[1];

      await s3.send(
        new DeleteObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: key,
        })
      );
    }

    await Blog.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// ✅ Export
module.exports = {
  createBlog,
  getAllBlogs,
  getAllBlog,
  getBlogById,
  updateBlog,
  getBlogBySlug,
  deleteBlog,
};
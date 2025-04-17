const express = require("express");
const {
  createBlog,
  getAllBlogs,
  getBlogById,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
} = require("../../controllers/admin/blogController");

const router = express.Router();

router.post("/blog", createBlog);
router.get("/blog", getAllBlogs);
router.get("/blog/:id", getBlogById);
router.put("/blog/:id", updateBlog);
router.delete("/blog/:id", deleteBlog);
router.get("/blog", getBlogBySlug); // GET /api/blog?slug=...

module.exports = router;

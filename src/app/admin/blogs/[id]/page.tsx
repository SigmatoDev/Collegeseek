"use client";

import AdminLayout from "@/components/admin/adminLayout";
import BlogForm from "./form";

const BlogPage = () => {
  return (
    <AdminLayout>
      <div>
        <h1 className="text-2xl font-bold mb-4"> Blogs</h1>
        <BlogForm />
      </div>
    </AdminLayout>
  );
};

export default BlogPage;
"use client";

import AdminLayout from "@/components/admin/adminLayout";
import BlogForm from "./form";
import { Toaster } from "react-hot-toast";

const BlogPage = () => {
  return (
    <AdminLayout>
      <div>
        <h1 className="text-2xl pl-9 font-bold mb-4"> Blogs</h1>

        <BlogForm />
      </div>
    </AdminLayout>
  );
};

export default BlogPage;
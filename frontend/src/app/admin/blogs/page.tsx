"use client";

import AdminLayout from "@/components/admin/adminLayout";
import Blogs from "./blogs";
import { Toaster } from "react-hot-toast";

const BlogsPage = () => {
  return (
    <AdminLayout>
      <div>
        <Blogs />
        <Toaster position="top-right" toastOptions={{ duration: 8000 }} />

      </div>
    </AdminLayout>
  );
};

export default BlogsPage;

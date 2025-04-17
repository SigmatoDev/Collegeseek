"use client";

import AdminLayout from "@/components/admin/adminLayout";
import Blogs from "./blogs";

const BlogsPage = () => {
  return (
    <AdminLayout>
      <div>
        <Blogs />
      </div>
    </AdminLayout>
  );
};

export default BlogsPage;

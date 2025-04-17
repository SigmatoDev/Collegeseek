'use client';

import AdminLayout from "@/components/admin/adminLayout";
import Form from "./form";

const CoursePage = () => {
  return (
    <AdminLayout>
      <div>
        <h1 className="text-2xl font-bold mb-4">Manage Courses</h1>
        <Form />
      </div>
    </AdminLayout>
  );
};

export default CoursePage;
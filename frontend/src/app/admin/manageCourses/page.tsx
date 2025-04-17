"use client";

import AdminLayout from "@/components/admin/adminLayout";
import Courses from "./courses";

const CoursesPage = () => {
  return (
    <AdminLayout>
      <div>
        {/* <h1 className="text-2xl font-bold mb-4">Manage Courses</h1> */}
        <Courses />
      </div>
    </AdminLayout>
  );
};

export default CoursesPage;

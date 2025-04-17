"use client";

import AdminLayout from "@/components/admin/adminLayout";
import CreateCourse from "./courseslist";


const CollegesPage = () => {
  return (
    <AdminLayout>
      <div>
        {/* <h1 className="text-2xl font-bold mb-4">Manage Colleges</h1> */}
        <CreateCourse />
      </div>
    </AdminLayout>
  );
};

export default CollegesPage;

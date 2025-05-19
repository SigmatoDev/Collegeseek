"use client";

import AdminLayout from "@/components/admin/adminLayout";
import CreateCourse from "./courseslist";
import { Toaster } from "react-hot-toast";


const CollegesPage = () => {
  return (
    <AdminLayout>
      <div>
        {/* <h1 className="text-2xl font-bold mb-4">Manage Colleges</h1> */}
        <CreateCourse />
                <Toaster position="top-right" toastOptions={{ duration: 8000 }} />

      </div>
    </AdminLayout>
  );
};

export default CollegesPage;

"use client";

import AdminLayout from "@/components/admin/adminLayout";
import Courses from "./courses";
import { Toaster } from "react-hot-toast";

const CoursesPage = () => {
  return (
    <AdminLayout>
      <div>
        {/* <h1 className="text-2xl font-bold mb-4">Manage Courses</h1> */}
        <Courses />
                <Toaster position="top-right" toastOptions={{ duration: 8000 }} />

      </div>
    </AdminLayout>
  );
};

export default CoursesPage;

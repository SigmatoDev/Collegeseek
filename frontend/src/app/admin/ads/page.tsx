'use client';

import AdminLayout from "@/components/admin/adminLayout";
import AdminCollegePage from "./ads1";
import AdminCollegePagead2 from "./ads2";
import { Toaster } from "react-hot-toast";
import AdminCoursesPagead1 from "./ads3";
import AdminCoursesPagead2 from "./ads4";

const SettingsPage = () => {
  return (
    <AdminLayout>
      <div className="p-8 bg-gray-50 min-h-screen">
        <Toaster position="top-right" />

        {/* Page Heading */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            College Page Advertisement
          </h1>
          <p className="text-gray-600 text-sm">
            Manage the promotional content shown on the college listing page. Upload images.
          </p>
        </div>

        {/* Grid for Ad Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Advertisement 1 */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-6 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-semibold text-gray-700 mb-3 border-b pb-2">Advertisement 1</h2>
            <AdminCollegePage />
          </div>

          {/* Advertisement 2 */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-6 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-semibold text-gray-700 mb-3 border-b pb-2">Advertisement 2</h2>
            <AdminCollegePagead2 />
          </div>

          
        </div>
          {/* Page Heading */}
        <div className="mt-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Courses Page Advertisement
          </h1>
          <p className="text-gray-600 text-sm">
            Manage the promotional content shown on the college listing page. Upload images.
          </p>
        </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-8">
          {/* Advertisement 1 */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-6 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-semibold text-gray-700 mb-3 border-b pb-2">Advertisement 1</h2>
            <AdminCoursesPagead1 />
          </div>

          {/* Advertisement 2 */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-6 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-semibold text-gray-700 mb-3 border-b pb-2">Advertisement 2</h2>
            <AdminCoursesPagead2 />
          </div>

          
        </div>
      </div>
    </AdminLayout>
  );
};

export default SettingsPage;

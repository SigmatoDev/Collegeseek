"use client";

import AdminLayout from "@/components/admin/adminLayout";
import { Toaster } from "react-hot-toast";
import AdoutMetaEditor from "./aboutPage";

const AdminMenuPage = () => {
  return (
    <AdminLayout>
      <div>
        {/* <h1 className="text-2xl font-bold mb-4">Manage Courses</h1> */}
        <AdoutMetaEditor />
        <Toaster position="top-right" toastOptions={{ duration: 8000 }} />
      </div>
    </AdminLayout>
  );
};

export default AdminMenuPage;

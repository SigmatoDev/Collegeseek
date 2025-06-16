"use client";

import AdminLayout from "@/components/admin/adminLayout";
import MetaEditor from "./homePage";
import { Toaster } from "react-hot-toast";

const AdminMenuPage = () => {
  return (
    <AdminLayout>
      <div>
        {/* <h1 className="text-2xl font-bold mb-4">Manage Courses</h1> */}
        <MetaEditor />
        <Toaster position="top-right" toastOptions={{ duration: 8000 }} />
      </div>
    </AdminLayout>
  );
};

export default AdminMenuPage;

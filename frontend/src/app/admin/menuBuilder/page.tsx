"use client";

import AdminLayout from "@/components/admin/adminLayout";
import AdminMenuProper from "./menuProper";

const AdminMenuPage = () => {
  return (
    <AdminLayout>
      <div>
        {/* <h1 className="text-2xl font-bold mb-4">Manage Courses</h1> */}
        <AdminMenuProper />
      </div>
    </AdminLayout>
  );
};

export default AdminMenuPage;

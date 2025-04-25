"use client";

import AdminLayout from "@/components/admin/adminLayout";
import CreatePage from "./create";

const AdminMenuPage = () => {
  return (
    <AdminLayout>
      <div>
        {/* <h1 className="text-2xl font-bold mb-4">Manage Courses</h1> */}
        < CreatePage/>
      </div>
    </AdminLayout>
  );
};

export default AdminMenuPage;

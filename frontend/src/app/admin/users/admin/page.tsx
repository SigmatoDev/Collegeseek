"use client";

import AdminLayout from "@/components/admin/adminLayout";
import AdminUsers from "./admin";

const AdminPage = () => {
  return (
    <AdminLayout>
      <div>
        <AdminUsers />
      </div>
    </AdminLayout>
  );
};

export default AdminPage;

"use client";

import AdminLayout from "@/components/admin/adminLayout";
import CategoryFilter from "./categoryFilter";

const AdminMenuPage = () => {
  return (
    <AdminLayout>
      <div>
        <CategoryFilter />
      </div>
    </AdminLayout>
  );
};

export default AdminMenuPage;

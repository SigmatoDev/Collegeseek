"use client";

import AdminLayout from "@/components/admin/adminLayout";
import Create from "./create";

const AdminCreatePage = () => {
  return (
    <AdminLayout>
      <div>
        <Create />
      </div>
    </AdminLayout>
  );
};

export default AdminCreatePage;

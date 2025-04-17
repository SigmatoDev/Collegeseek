"use client";

import AdminLayout from "@/components/admin/adminLayout";
import EditCounsellingForm from "./form";

const AdminEditCounsellingPage = () => {
  return (
    <AdminLayout>
      <div>
        <EditCounsellingForm />
      </div>
    </AdminLayout>
  );
};

export default AdminEditCounsellingPage;

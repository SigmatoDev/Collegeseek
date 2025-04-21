"use client";

import AdminLayout from "@/components/admin/adminLayout";
import EditContactForm from "./form";

const AdminEditContactPage = () => {
  return (
    <AdminLayout>
      <div>
        <EditContactForm />
      </div>
    </AdminLayout>
  );
};

export default AdminEditContactPage;

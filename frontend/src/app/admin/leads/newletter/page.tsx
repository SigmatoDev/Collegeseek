"use client";

import AdminLayout from "@/components/admin/adminLayout";
import AdminNewsletter from "./newsletter";

const AdminNewsletterPage = () => {
  return (
    <AdminLayout>
      <div>
        <AdminNewsletter />
      </div>
    </AdminLayout>
  );
};

export default AdminNewsletterPage;
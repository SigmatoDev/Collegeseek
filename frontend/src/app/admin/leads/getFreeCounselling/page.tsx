"use client";

import AdminLayout from "@/components/admin/adminLayout";
import AdminCounselling from "./getFreeCounselling";

const AdminCounsellingPage = () => {
  return (
    <AdminLayout>
      <div>
        <AdminCounselling />
      </div>
    </AdminLayout>
  );
};

export default AdminCounsellingPage;

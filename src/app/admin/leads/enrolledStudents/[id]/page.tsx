"use client";

import AdminLayout from "@/components/admin/adminLayout";
import EditEnrollmentForm from "./Form";

const AdminEditEnrollmentPage = () => {
  return (
    <AdminLayout>
      <div>
        <EditEnrollmentForm/>
      </div>
    </AdminLayout>
  );
};

export default AdminEditEnrollmentPage;

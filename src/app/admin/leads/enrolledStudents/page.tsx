"use client";

import AdminLayout from "@/components/admin/adminLayout";
import AdminEnrollments from "./enrolledStudents";

const AdminEnrollmentsPage = () => {
  return (
    <AdminLayout>
      <div>
        <AdminEnrollments />
      </div>
    </AdminLayout>
  );
};

export default AdminEnrollmentsPage;

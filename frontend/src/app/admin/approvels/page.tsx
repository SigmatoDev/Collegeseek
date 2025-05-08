"use client";

import AdminLayout from "@/components/admin/adminLayout";
import AdminApprovals from "./approvels";

const ApprovalsPage = () => {
  return (
    <AdminLayout>
      <div>
        {/* <h1 className="text-2xl font-bold mb-4">Manage Approvals</h1> */}
        <AdminApprovals />
      </div>
    </AdminLayout>
  );
};

export default ApprovalsPage;

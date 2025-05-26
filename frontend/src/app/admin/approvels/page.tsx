"use client";

import AdminLayout from "@/components/admin/adminLayout";
import AdminApprovals from "./approvels";
import { Toaster } from "react-hot-toast";

const ApprovalsPage = () => {
  return (
    <AdminLayout>
      <div>
        {/* <h1 className="text-2xl font-bold mb-4">Manage Approvals</h1> */}
        <AdminApprovals />
        <Toaster position="top-right" toastOptions={{ duration: 8000 }} />
      </div>
    </AdminLayout>
  );
};

export default ApprovalsPage;

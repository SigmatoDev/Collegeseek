"use client"

import AdminLayout from "@/components/admin/adminLayout";
import ApprovalForm from "./form";


const ApprovalPage = () => {
  return (
    <AdminLayout>
      <div>
        <h1 className="text-2xl pl-9 font-bold mb-4">Manage Approvals</h1>
        <ApprovalForm /> {/* Use the ApprovalForm component here */}
      </div>
    </AdminLayout>
  );
};

export default ApprovalPage;

"use client";

import AdminLayout from "@/components/admin/adminLayout";
import OwnershipForm from "./from";

const OwnershipPage = () => {
  return (
    <AdminLayout>
      <div>
        <h1 className="text-2xl pl-9 font-bold mb-4">Manage Ownerships</h1>
        <OwnershipForm /> {/* Use the OwnershipForm component here */}
      </div>
    </AdminLayout>
  );
};

export default OwnershipPage;

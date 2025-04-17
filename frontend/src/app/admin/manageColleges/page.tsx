"use client";

import AdminLayout from "@/components/admin/adminLayout";
import Colleges from "./colleges";

const CollegesPage = () => {
  return (
    <AdminLayout>
      <div>
        {/* <h1 className="text-2xl font-bold mb-4">Manage Colleges</h1> */}
        <Colleges />
      </div>
    </AdminLayout>
  );
};

export default CollegesPage;

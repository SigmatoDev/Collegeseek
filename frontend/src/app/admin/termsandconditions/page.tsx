"use client";

import AdminLayout from "@/components/admin/adminLayout";
import AdminTerms from "./terms";

const CreateTermPage = () => {
  return (
    <AdminLayout>
      <div>
        {/* <h1 className="text-2xl font-bold mb-4">Manage Courses</h1> */}
        <AdminTerms />
      </div>
    </AdminLayout>
  );
};

export default CreateTermPage;

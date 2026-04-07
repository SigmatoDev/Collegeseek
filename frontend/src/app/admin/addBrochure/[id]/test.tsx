"use client";

import AdminLayout from "@/components/admin/adminLayout";
import Form from "./form";

const FromPage = () => {
  return (
    <AdminLayout>
      <div>
        <h1 className="text-2xl pl-9 font-bold mb-4">Manage brochure</h1>
        <Form />
      </div>
    </AdminLayout>
  );
};

export default FromPage;

"use client"

import AdminLayout from "@/components/admin/adminLayout";
import Form from "./form";




const FromPage = () => {
  return (
    <AdminLayout>
      <div>
      <h1 className="text-2xl font-bold pl-9 mb-4">Manage Colleges</h1>
      <Form />
      </div>
    </AdminLayout>
  );
};

export default FromPage;
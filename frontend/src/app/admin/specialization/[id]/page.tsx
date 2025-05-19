"use client";

import AdminLayout from "@/components/admin/adminLayout";
import SpecializationForm from "./from";

const SpecializationPage = () => {
  return (
    <AdminLayout>
      <div>
        <h1 className="text-2xl font-bold mb-4">Manage Specializations</h1>
        <SpecializationForm />
      </div>
    </AdminLayout>
  );
};

export default SpecializationPage;

"use client";

import AdminLayout from "@/components/admin/adminLayout";
import ProgramModeForm from "./from";

const ProgramModePage = () => {
  return (
    <AdminLayout>
      <div>
        <h1 className="text-2xl pl-9 font-bold mb-4">Manage Program Modes</h1>
        <ProgramModeForm />
      </div>
    </AdminLayout>
  );
};

export default ProgramModePage;

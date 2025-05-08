"use client";

import AdminLayout from "@/components/admin/adminLayout";
import AdminProgramModes from "./programMode"; // Make sure this is the correct file path

const ProgramModesPage = () => {
  return (
    <AdminLayout>
      <AdminProgramModes />
    </AdminLayout>
  );
};

export default ProgramModesPage;

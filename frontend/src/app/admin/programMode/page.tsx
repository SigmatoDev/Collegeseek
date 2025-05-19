"use client";

import AdminLayout from "@/components/admin/adminLayout";
import AdminProgramModes from "./programMode"; // Make sure this is the correct file path
import { Toaster } from "react-hot-toast";

const ProgramModesPage = () => {
  return (
    <AdminLayout>
      <AdminProgramModes />
      <Toaster position="top-right" toastOptions={{ duration: 8000 }} />
    </AdminLayout>
  );
};

export default ProgramModesPage;

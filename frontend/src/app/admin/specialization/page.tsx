"use client";

import AdminLayout from "@/components/admin/adminLayout";
import AdminSpecializations from "./specialization";
import { Toaster } from "react-hot-toast";

const SpecializationsPage = () => {
  return (
    <AdminLayout>
      <AdminSpecializations />
      <Toaster position="top-right" toastOptions={{ duration: 8000 }} />
    </AdminLayout>
  );
};

export default SpecializationsPage;

"use client";

import AdminLayout from "@/components/admin/adminLayout";
import AdminOwnerships from "./ownership";
import { Toaster } from "react-hot-toast";

const OwnershipsPage = () => {
  return (
    <AdminLayout>
      <AdminOwnerships />
      <Toaster position="top-right" toastOptions={{ duration: 8000 }} />
    </AdminLayout>
  );
};

export default OwnershipsPage;

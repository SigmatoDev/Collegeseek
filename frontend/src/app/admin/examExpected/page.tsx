"use client";

import AdminLayout from "@/components/admin/adminLayout";
import AdminExamExpected from "./examExpected";
import { Toaster } from "react-hot-toast";

const ExamExpectedPage = () => {
  return (
    <AdminLayout>
      <AdminExamExpected />
      <Toaster position="top-right" toastOptions={{ duration: 8000 }} />
    </AdminLayout>
  );
};

export default ExamExpectedPage;

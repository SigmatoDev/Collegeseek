"use client";

import AdminLayout from "@/components/admin/adminLayout";
import UploadPageAds from "./ads";

const SettingsPage = () => {
  return (
    <AdminLayout>
      <div>
        <h1 className="text-2xl font-bold mb-4">Settings</h1>
        <UploadPageAds />
      </div>
    </AdminLayout>
  );
};

export default SettingsPage;

"use client";

import AdminLayout from "@/components/admin/adminLayout";
import UploadPageAds from "./ads";

const SettingsPage = () => {
  return (
    <AdminLayout>
      <div>
        <UploadPageAds />
      </div>
    </AdminLayout>
  );
};

export default SettingsPage;

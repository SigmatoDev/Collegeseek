"use client";

import AdminLayout from "@/components/admin/adminLayout";
import Settings from "./setting";

const SettingsPage = () => {
  return (
    <AdminLayout>
      <div>
        <h1 className="text-2xl font-bold mb-4">Settings</h1>
        <Settings />
      </div>
    </AdminLayout>
  );
};

export default SettingsPage;

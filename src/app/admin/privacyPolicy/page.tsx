"use client";

import AdminLayout from "@/components/admin/adminLayout";
import AdminPrivacyPolicy from "./privacyPolicy";

const CreatePrivacyPolicyPage = () => {
  return (
    <AdminLayout>
      <div>
        <AdminPrivacyPolicy /> {/* Use the correct component for Privacy Policy */}
      </div>
    </AdminLayout>
  );
};

export default CreatePrivacyPolicyPage;

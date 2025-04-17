"use client";

import AdminLayout from "@/components/admin/adminLayout";
import { useParams } from 'next/navigation'; // Use useParams for dynamic routing
import CreateOrEditPrivacyPolicy from "./Form";

const PrivacyPolicyPage = () => {
  const { id } = useParams(); // This will get the dynamic 'id' parameter

  // Handle loading state or invalid ID state
  if (!id) {
    return <div>Loading...</div>; // Customize the loading state
  }

  return (
    <AdminLayout>
      <div>
        <CreateOrEditPrivacyPolicy params={{ id: id as string }} /> {/* Pass id as part of params */}
      </div>
    </AdminLayout>
  );
};

export default PrivacyPolicyPage;

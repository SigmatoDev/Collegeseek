 "use client";

import AdminLayout from "@/components/admin/adminLayout";
import ApplicationDetails from "./details";

const ApplicationDetailPage = () => {
  return (
    <AdminLayout>
      <div>
        <ApplicationDetails />
      </div>
    </AdminLayout>
  );
};

export default ApplicationDetailPage;

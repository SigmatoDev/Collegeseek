 "use client";

import AdminLayout from "@/components/admin/adminLayout";
import ApplicationsList from "./applications";

const ApplicationsPage = () => {
  return (
    <AdminLayout>
      <div>
        <ApplicationsList />
      </div>
    </AdminLayout>
  );
};

export default ApplicationsPage;

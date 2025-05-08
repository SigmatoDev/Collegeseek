"use client";

import AdminLayout from "@/components/admin/adminLayout";
import AdminAffiliatedBy from "./affiliatedBy";

const AffiliatedByPage = () => {
  return (
    <AdminLayout>
      <div>
        <AdminAffiliatedBy />
      </div>
    </AdminLayout>
  );
};

export default AffiliatedByPage;

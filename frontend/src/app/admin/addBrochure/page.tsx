"use client"

import AdminLayout from "@/components/admin/adminLayout";
import Brochure from "./brochure";

const BrochurePage = () => {
  return (
    <AdminLayout>
      <div>
        {/* <h1 className="text-2xl font-bold mb-4">Manage Brochure</h1> */}
        <Brochure />
      </div>
    </AdminLayout>
  );
};

export default BrochurePage;

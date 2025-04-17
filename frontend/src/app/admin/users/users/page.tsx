"use client";

import AdminLayout from "@/components/admin/adminLayout";
import Users from "./users"; // Import Users instead of AdminUsers

const Userspage = () => {
  return (
    <AdminLayout>
      <div>
        <Users /> {/* Render Users instead of AdminUsers */}
      </div>
    </AdminLayout>
  );
};

export default Userspage;

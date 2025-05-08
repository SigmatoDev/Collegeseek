"use client";

import AdminLayout from "@/components/admin/adminLayout";
import AdminStreams from "./streams";

const StreamsPage = () => {
  return (
    <AdminLayout>
      <div>
        {/* <h1 className="text-2xl font-bold mb-4">Manage Streams</h1> */}
        <AdminStreams />
      </div>
    </AdminLayout>
  );
};

export default StreamsPage;

"use client";

import AdminLayout from "@/components/admin/adminLayout";
import StreamForm from "./from";

const StreamPage = () => {
  return (
    <AdminLayout>
      <div>
        <h1 className="text-2xl pl-9 font-bold mb-4">Manage Streams</h1>
        <StreamForm /> {/* Use the StreamForm component here */}
      </div>
    </AdminLayout>
  );
};

export default StreamPage;

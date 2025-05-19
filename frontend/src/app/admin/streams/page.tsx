"use client";

import AdminLayout from "@/components/admin/adminLayout";
import AdminStreams from "./streams";
import { Toaster } from "react-hot-toast";

const StreamsPage = () => {
  return (
    <AdminLayout>
      <div>
        {/* <h1 className="text-2xl font-bold mb-4">Manage Streams</h1> */}
        <AdminStreams />
        <Toaster position="top-right" toastOptions={{ duration: 8000 }} />
      </div>
    </AdminLayout>
  );
};

export default StreamsPage;

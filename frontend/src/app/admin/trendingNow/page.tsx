"use client";

import AdminLayout from "@/components/admin/adminLayout";
import AdminTrendingNow from "./trendingNow";
import { Toaster } from "react-hot-toast";

const TrendingNowPage = () => {
  return (
    <AdminLayout>
      <div>
        {/* <h1 className="text-2xl font-bold mb-4">Manage Trending Exams</h1> */}
        <AdminTrendingNow />
        <Toaster position="top-right" toastOptions={{ duration: 8000 }} />
      </div>
    </AdminLayout>
  );
};

export default TrendingNowPage;

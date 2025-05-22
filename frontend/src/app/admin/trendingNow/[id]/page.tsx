"use client";

import AdminLayout from "@/components/admin/adminLayout";
import AddTrendingExam from "./from";

const TrendingNowPage = () => {
  return (
    <AdminLayout>
      <div>
        <h1 className="text-2xl pl-9 font-bold mb-4">Manage Trending Now</h1>
        <AddTrendingExam /> {/* Use the TrendingForm component here */}
      </div>
    </AdminLayout>
  );
};

export default TrendingNowPage;

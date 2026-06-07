"use client";

import { api_url } from "@/utils/apiCall";
import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

type AnalyticsPoint = {
  date: string;
  users: number;
};

type AnalyticsChartProps = {
  data?: AnalyticsPoint[];
};

export default function AnalyticsChart({
  data: externalData,
}: AnalyticsChartProps) {
  const [data, setData] = useState<AnalyticsPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(!externalData);

  useEffect(() => {
    if (externalData) {
      console.log("Using externalData:", externalData);
      setData(externalData);
      setLoading(false);
      return;
    }

    const fetchAnalytics = async () => {
      try {
        console.log("🚀 Calling API:", `${api_url}/analytics`);

        const res = await fetch(`${api_url}/analytics`);

        console.log("📡 Response status:", res.status);
        console.log("📡 Response ok:", res.ok);

        const result = await res.json();

        console.log("📊 API result:", result);

        setData(Array.isArray(result) ? result : []);
      } catch (error) {
        console.log("❌ Analytics fetch error:", error);
        setData([]);
      } finally {
        console.log("✅ API call finished");
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [externalData]);

  if (loading) {
    return (
      <div className="p-8 text-gray-500">
        Loading analytics...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      {/* Header */}
      <div className="mb-6">
        <p className="text-sm uppercase tracking-widest text-gray-400">
          Google Analytics
        </p>
        <h2 className="text-2xl font-bold text-gray-900">
          Website Visitors
        </h2>
      </div>

      {/* ⚠️ FIX IS HERE */}
      <div className="w-full h-[350px] min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="users"
              stroke="#4f46e5"
              strokeWidth={3}
              dot={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
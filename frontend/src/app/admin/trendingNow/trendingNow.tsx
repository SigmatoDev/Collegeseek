"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { api_url } from "@/utils/apiCall";
import { toast } from "react-hot-toast";
import { PencilSquareIcon, PlusCircleIcon, TrashIcon } from "@heroicons/react/24/outline";

interface TrendingExam {
  _id: string;
  name: string;
}

const AdminTrendingNow = () => {
  const [trendingExams, setTrendingExams] = useState<TrendingExam[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchTrendingExams = async () => {
      try {
        const { data } = await axios.get(`${api_url}/get/trendingNow`); // Added slash before get
        if (!Array.isArray(data) || data.length === 0) {
          setError("No trending exams found.");
          setTrendingExams([]);
          return;
        }
        setTrendingExams(data);
        setError(null);
      } catch (err: any) {
        console.error("API Fetch Error:", err);
        setError(err.response?.data?.message || "Failed to load trending exams.");
        setTrendingExams([]);
      } finally {
        setLoading(false);
      }
    };

    if (typeof window !== "undefined") {
      fetchTrendingExams();
    }
  }, []);

  const handleDelete = async (examId: string) => {
    if (!window.confirm("Are you sure you want to delete this exam?")) return;

    try {
      await axios.delete(`${api_url}/d/trendingNow/${examId}`); // Add slash before d
      setTrendingExams((prev) => prev.filter((exam) => exam._id !== examId));
      toast.success("Exam deleted successfully!");
    } catch (err) {
      console.error("Error deleting exam:", err);
      toast.error("Error deleting exam. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Trending Now</h1>
        <button
          onClick={() => router.push("/admin/trendingNow/new")}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition"
        >
          <PlusCircleIcon className="w-5 h-5 mr-2" />
         Trending Now
        </button>
      </header>

      {loading && <p className="text-center text-gray-500">Loading trending exams...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto shadow-md rounded bg-white">
          <table className="table-auto w-full text-left border-collapse">
            <thead className="bg-gray-200 text-gray-600">
              <tr>
                {["Name", "Actions"].map((header) => (
                  <th key={header} className="px-6 py-3 text-sm font-semibold">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {trendingExams.length > 0 ? (
                trendingExams.map((exam) => (
                  <tr key={exam._id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm text-gray-700">{exam.name}</td>
                    <td className="px-6 py-3 flex space-x-2">
                      <button
                        onClick={() => router.push(`/admin/trendingNow/${exam._id}`)}
                        className="bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-600 transition"
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                        <span>Edit</span>
                      </button>
                      {/* Uncomment if delete API and button ready
                      <button
                        onClick={() => handleDelete(exam._id)}
                        className="bg-red-500 text-white px-3 py-2 rounded-lg flex items-center space-x-2 hover:bg-red-600 transition"
                      >
                        <TrashIcon className="h-5 w-5" />
                        <span>Delete</span>
                      </button> 
                      */}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="text-center py-4 text-gray-500">
                    No trending exams found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminTrendingNow;

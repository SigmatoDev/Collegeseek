"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { api_url } from "@/utils/apiCall";
import { toast } from "react-hot-toast";
import { PencilSquareIcon, PlusCircleIcon, TrashIcon } from "@heroicons/react/24/outline";

interface Exam {
  _id: string;
  name: string;
  code: string;
}

const AdminExamsAccepted = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const { data } = await axios.get(`${api_url}get/Exams`);
        if (!Array.isArray(data) || data.length === 0) {
          setError("No exams data received.");
          return;
        }
        setExams(data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load exams.");
      } finally {
        setLoading(false);
      }
    };

    if (typeof window !== "undefined") {
      fetchExams();
    }
  }, []);

  const handleDelete = async (examId: string) => {
    if (!window.confirm("Are you sure you want to delete this exam?")) return;

    try {
      await axios.delete(`${api_url}d/Exams/${examId}`);
      setExams((prev) => prev.filter((exam) => exam._id !== examId));
      toast.success("Exam deleted successfully!");
    } catch (err) {
      toast.error("Error deleting exam. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Exams Accepted</h1>
        <button
          onClick={() => router.push("/admin/examExpected/new")}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          <PlusCircleIcon className="w-5 h-5 mr-2" />
          Add Exam
        </button>
      </header>

      {loading && <p className="text-center text-gray-500">Loading exams...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto shadow-md rounded bg-white">
          <table className="table-auto w-full text-left border-collapse">
            <thead className="bg-gray-200 text-gray-600">
              <tr>
                {["Name", "Code", "Actions"].map((header) => (
                  <th key={header} className="px-6 py-3 text-sm font-semibold">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.isArray(exams) && exams.length > 0 ? (
                exams.map((exam) => (
                  <tr key={exam._id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm text-gray-700">{exam.name}</td>
                    <td className="px-6 py-3 text-sm text-gray-700">{exam.code}</td>
                    <td className="px-6 py-3 flex space-x-2">
                      <button
                        onClick={() => router.push(`/admin/examExpected/${exam._id}`)}
                        className="bg-blue-500 text-white px-3 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-600 transition"
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                        <span>Edit</span>
                      </button>
                      {/* <button
                        onClick={() => handleDelete(exam._id)}
                        className="bg-red-500 text-white px-3 py-2 rounded-lg flex items-center space-x-2 hover:bg-red-600 transition"
                      >
                        <TrashIcon className="h-5 w-5" />
                        <span>Delete</span>
                      </button> */}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center py-4 text-gray-500">
                    No exams found.
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

export default AdminExamsAccepted;

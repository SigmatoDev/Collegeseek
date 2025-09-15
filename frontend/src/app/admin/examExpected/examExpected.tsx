"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { api_url } from "@/utils/apiCall";
import { toast } from "react-hot-toast";
import { PencilSquareIcon, PlusCircleIcon } from "@heroicons/react/24/outline";

interface Exam {
  _id: string;
  name: string;
  code: string;
}

interface PaginationData {
  data: Exam[];
  pagination: {
    totalExams: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

const AdminExamsAccepted = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const router = useRouter();
  const limit = 10;

  const fetchExams = async (pageToFetch: number) => {
    setLoading(true);
    try {
      const { data }: { data: PaginationData } = await axios.get(
        `${api_url}get/Exams`,
        {
          params: { page: pageToFetch, limit },
        }
      );

      if (!Array.isArray(data.data)) {
        setError("Invalid response from server.");
        return;
      }

      setExams(data.data);
      setTotalPages(data.pagination.totalPages);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load exams.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams(currentPage);
  }, [currentPage]);

  const handleDelete = async (examId: string) => {
    if (!window.confirm("Are you sure you want to delete this exam?")) return;

    try {
      await axios.delete(`${api_url}d/Exams/${examId}`);
      toast.success("Exam deleted successfully!");
      fetchExams(currentPage); // refresh current page
    } catch (err) {
      toast.error("Error deleting exam. Please try again.");
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
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
        <>
          <div className="overflow-x-auto shadow-md rounded bg-white">
            <table className="table-auto w-full text-left border-collapse">
              <thead className="bg-gray-200 text-gray-600">
                <tr>
                  <th className="px-6 py-3 text-sm font-semibold">Name</th>
                  <th className="px-6 py-3 text-sm font-semibold">Code</th>
                  <th className="px-6 py-3 text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {exams.length > 0 ? (
                  exams.map((exam) => (
                    <tr key={exam._id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-3 text-sm text-gray-700">
                        {exam.name}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-700">
                        {exam.code}
                      </td>
                      <td className="px-6 py-3 flex space-x-2">
                        <button
                          onClick={() =>
                            router.push(`/admin/examExpected/${exam._id}`)
                          }
                          className="bg-blue-500 text-white px-3 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-600 transition"
                        >
                          <PencilSquareIcon className="h-5 w-5" />
                          <span>Edit</span>
                        </button>
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

            {/* Pagination Controls */}
            <div className="flex justify-between items-center p-4 border-t bg-gray-50">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition ${
                  currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Previous
              </button>

              <span className="flex items-center space-x-2 text-sm text-gray-700">
                Page {currentPage} of {totalPages}
                <span className="p-2">/ Go to page:</span>
                <input
                  type="number"
                  min={1}
                  max={totalPages}
                  placeholder="Page #"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const pageNum = Number(
                        (e.target as HTMLInputElement).value
                      );
                      if (
                        !isNaN(pageNum) &&
                        pageNum >= 1 &&
                        pageNum <= totalPages
                      ) {
                        setCurrentPage(pageNum);
                        (e.target as HTMLInputElement).value = ""; // clear input after jump
                      }
                    }
                  }}
                  className="w-16 border border-gray-300 rounded px-2 py-1 text-center text-sm ml-2"
                />
              </span>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition ${
                  currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminExamsAccepted;

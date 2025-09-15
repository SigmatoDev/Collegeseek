"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { api_url } from "@/utils/apiCall";
import { toast } from "react-hot-toast";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

interface Enrollment {
  _id: string;
  name: string;
  email: string;
  phone: string;
  course: string;
  createdAt: string;
}

const AdminEnrollments = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 10;

  const router = useRouter();

  const fetchEnrollments = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${api_url}/enrollments?page=${page}&limit=${limit}`
      );

      if (!data || !Array.isArray(data.data)) {
        console.error("Unexpected API response format:", data);
        setError("Invalid data format received.");
        return;
      }

      setEnrollments(data.data);
      setTotalPages(data.pagination.totalPages);
    } catch (err: any) {
      console.error("API Fetch Error:", err);
      setError(err.response?.data?.message || "Failed to load enrollments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, [page]);

  const handleDelete = async (enrollmentId: string) => {
    if (!window.confirm("Are you sure you want to delete this enrollment?"))
      return;

    try {
      await axios.delete(`${api_url}/enrollments/${enrollmentId}`);
      toast.success("Enrollment deleted successfully!");
      fetchEnrollments();
    } catch (err) {
      console.error("Error deleting enrollment:", err);
      toast.error("Error deleting enrollment. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Enrollment List</h1>
      </header>

      {loading && (
        <p className="text-center text-gray-500">Loading enrollments...</p>
      )}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && (
        <>
          <div className="overflow-x-auto shadow-md rounded bg-white">
            <table className="table-auto w-full text-left border-collapse">
              <thead className="bg-gray-200 text-gray-600">
                <tr>
                  {[
                    "Name",
                    "Email",
                    "Phone",
                    "Course",
                    "Created At",
                    "Actions",
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-sm font-semibold"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {enrollments.length > 0 ? (
                  enrollments.map((enrollment) => (
                    <tr
                      key={enrollment._id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="px-6 py-3 text-sm text-gray-700">
                        {enrollment.name}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-700">
                        {enrollment.email}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-700">
                        {enrollment.phone}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-700">
                        {enrollment.course}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-700">
                        {new Date(enrollment.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-3 flex space-x-2">
                        <button
                          onClick={() =>
                            router.push(
                              `/admin/leads/enrolledStudents/${enrollment._id}`
                            )
                          }
                          className="bg-blue-500 text-white px-3 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-600 transition"
                        >
                          <PencilSquareIcon className="h-5 w-5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(enrollment._id)}
                          className="bg-red-500 text-white px-3 py-2 rounded-lg flex items-center space-x-2 hover:bg-red-600 transition"
                        >
                          <TrashIcon className="h-5 w-5" />
                          <span>Delete</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-4 text-gray-500">
                      No enrollments found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center p-4 border-t bg-gray-50">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className={`px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition ${
                  page === 1 ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Previous
              </button>

              <span className="flex items-center space-x-2 text-sm text-gray-700">
                Page {page} of {totalPages}
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
                        setPage(pageNum);
                      }
                    }
                  }}
                  className="w-16 border border-gray-300 rounded px-2 py-1 text-center text-sm ml-2"
                />
              </span>

              <button
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={page === totalPages}
                className={`px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition ${
                  page === totalPages ? "opacity-50 cursor-not-allowed" : ""
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

export default AdminEnrollments;

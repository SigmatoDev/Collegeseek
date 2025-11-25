"use client";

import { useEffect, useMemo, useState } from "react";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "name">("newest");

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

  const filteredEnrollments = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();
    const matches = enrollments.filter((enrollment) => {
      if (!normalized) return true;
      return [enrollment.name, enrollment.email, enrollment.phone, enrollment.course]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalized));
    });

    const sorted = [...matches];
    sorted.sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      const diff =
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return sortBy === "oldest" ? diff : -diff;
    });
    return sorted;
  }, [enrollments, searchTerm, sortBy]);

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-6 space-y-4">
        <div className="flex flex-col items-start justify-between gap-3 text-gray-800 sm:flex-row sm:items-center">
          <h1 className="text-2xl font-bold">Enrollment List</h1>
        </div>
        <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white/80 p-4 shadow-sm md:flex-row md:items-center md:justify-between">
          <div className="flex w-full items-center gap-3">
            <label className="text-sm font-semibold text-gray-500">
              Search
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, phone or course..."
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-blue-400 focus:outline-none"
            />
          </div>
          <div className="flex w-full items-center gap-3 md:w-auto">
            <label className="text-sm font-semibold text-gray-500">
              Sort by
            </label>
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "newest" | "oldest" | "name")
              }
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-blue-400 focus:outline-none"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>
        </div>
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
                {filteredEnrollments.length > 0 ? (
                  filteredEnrollments.map((enrollment) => (
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
                        {/* <button
                          onClick={() =>
                            router.push(
                              `/admin/leads/enrolledStudents/${enrollment._id}`
                            )
                          }
                          className="bg-blue-500 text-white px-3 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-600 transition"
                        >
                          <PencilSquareIcon className="h-5 w-5" />
                          <span>Edit</span>
                        </button> */}
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

"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { api_url } from "@/utils/apiCall";
import { toast } from "react-hot-toast";
import {
  PencilSquareIcon,
  PlusCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

interface Specialization {
  _id: string;
  name: string;
}

const AdminSpecializations = () => {
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 10;

  const router = useRouter();

  const fetchSpecializations = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(
        `${api_url}get/Specialization?page=${page}&limit=${limit}`
      );

      if (!Array.isArray(data.specializations)) {
        setError("No specialization data received.");
        return;
      }

      setSpecializations(data.specializations);
      setTotalPages(data.totalPages || 1);
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(
        err.response?.data?.message || "Failed to load specializations."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      fetchSpecializations();
    }
  }, [page]);

  const handleDelete = async (specializationId: string) => {
    if (!window.confirm("Are you sure you want to delete this specialization?"))
      return;

    try {
      await axios.delete(`${api_url}d/Specialization/${specializationId}`);
      setSpecializations((prev) =>
        prev.filter((item) => item._id !== specializationId)
      );
      toast.success("Specialization deleted successfully!");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete specialization.");
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Specializations List
        </h1>
        <button
          onClick={() => router.push("/admin/specialization/new")}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          <PlusCircleIcon className="w-5 h-5 mr-2" />
          Add Specialization
        </button>
      </header>

      {loading && (
        <p className="text-center text-gray-500">Loading specializations...</p>
      )}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && (
        <>
          <div className="overflow-x-auto shadow-md rounded bg-white">
            <table className="table-auto w-full text-left border-collapse">
              <thead className="bg-gray-200 text-gray-600">
                <tr>
                  <th className="px-6 py-3 text-sm font-semibold">Name</th>
                  <th className="px-6 py-3 text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {specializations.length > 0 ? (
                  specializations.map((specialization) => (
                    <tr
                      key={specialization._id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="px-6 py-3 text-sm text-gray-700">
                        {specialization.name}
                      </td>
                      <td className="px-6 py-3 flex space-x-2">
                        <button
                          onClick={() =>
                            router.push(
                              `/admin/specialization/${specialization._id}`
                            )
                          }
                          className="bg-blue-500 text-white px-3 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-600 transition"
                        >
                          <PencilSquareIcon className="h-5 w-5" />
                          <span>Edit</span>
                        </button>
                        {/* <button
                          onClick={() => handleDelete(specialization._id)}
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
                    <td colSpan={2} className="text-center py-4 text-gray-500">
                      No specializations found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-between items-center p-4 border-t bg-gray-50">
              <button
                onClick={() => handlePageChange(page - 1)}
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
                        handlePageChange(pageNum);
                        (e.target as HTMLInputElement).value = ""; // clear input after jump
                      }
                    }
                  }}
                  className="w-16 border border-gray-300 rounded px-2 py-1 text-center text-sm ml-2"
                />
              </span>

              <button
                onClick={() => handlePageChange(page + 1)}
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

export default AdminSpecializations;

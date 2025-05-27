"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { api_url } from "@/utils/apiCall";
import { toast } from "react-hot-toast";
import { PencilSquareIcon, PlusCircleIcon } from "@heroicons/react/24/outline";

interface Stream {
  _id: string;
  name: string;
}

interface Pagination {
  totalStreams: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

const AdminStreams = () => {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [pagination, setPagination] = useState<Pagination>({
    totalStreams: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 10,
  });

  const router = useRouter();

  const fetchStreams = async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${api_url}get/streams`, {
        params: { page, limit: pagination.limit },
      });

      if (!data || !data.data || !Array.isArray(data.data)) {
        setError("No stream data received.");
        setStreams([]);
        return;
      }

      setStreams(data.data);
      setPagination({
        totalStreams: data.pagination.totalStreams,
        totalPages: data.pagination.totalPages,
        currentPage: data.pagination.currentPage,
        limit: data.pagination.limit,
      });
      setError(null);
    } catch (err: any) {
      console.error("API Fetch Error:", err);
      setError(err.response?.data?.message || "Failed to load streams.");
      setStreams([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      fetchStreams(pagination.currentPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    fetchStreams(newPage);
  };

  // Destructure currentPage and totalPages for easier use in JSX
  const { currentPage, totalPages } = pagination;

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Streams List</h1>
        <button
          onClick={() => router.push("/admin/streams/new")}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          <PlusCircleIcon className="w-5 h-5 mr-2" />
          Add Stream
        </button>
      </header>

      {loading && <p className="text-center text-gray-500">Loading streams...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && (
        <>
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
                {streams.length > 0 ? (
                  streams.map((stream) => (
                    <tr key={stream._id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-3 text-sm text-gray-700">{stream.name}</td>
                      <td className="px-6 py-3 flex space-x-2">
                        <button
                          onClick={() => router.push(`/admin/streams/${stream._id}`)}
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
                    <td colSpan={2} className="text-center py-4 text-gray-500">
                      No streams found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center p-4 border-t bg-gray-50">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition ${
                  currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Previous
              </button>

              <span className="text-gray-700 text-sm">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition ${
                  currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
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

export default AdminStreams;

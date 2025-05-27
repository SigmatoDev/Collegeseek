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

interface Upload {
  _id: string;
  fileName: string;
  filePath: string;
  college_id: { _id: string; name: string };
  createdAt: string;
}

const AdminUploads = () => {
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 10; // number of items per page

  const router = useRouter();

  // Fetch uploads with pagination
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data } = await axios.get(`${api_url}/brochure`, {
          params: { page, limit },
        });

        // API should return { files: Upload[], total, page, totalPages }
        if (!data.files || !Array.isArray(data.files)) {
          setError("Invalid data format received.");
          return;
        }

        setUploads(data.files);
        setTotalPages(data.totalPages || 1);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load uploads.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page]);

  const getCollegeName = (collegeId: { _id: string; name: string }): string => {
    return collegeId?.name || "Unknown College";
  };

  const handleDelete = async (uploadId: string) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;

    try {
      await axios.delete(`${api_url}/brochure/${uploadId}`);

      setUploads((prev) => prev.filter((upload) => upload._id !== uploadId));
      toast.success("File deleted successfully!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error deleting file. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Uploaded Files</h1>
        <button
          onClick={() => router.push("/admin/addBrochure/new")}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          <PlusCircleIcon className="w-5 h-5 mr-2" />
          Upload File
        </button>
      </header>

      {loading && <p className="text-center text-gray-500">Loading files...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && (
        <>
          <div className="overflow-x-auto shadow-md rounded bg-white">
            <table className="table-auto w-full text-left border-collapse">
              <thead className="bg-gray-200 text-gray-600">
                <tr>
                  <th className="px-6 py-3 text-sm font-semibold">College</th>
                  <th className="px-6 py-3 text-sm font-semibold">File Name</th>
                  <th className="px-6 py-3 text-sm font-semibold">Uploaded At</th>
                  <th className="px-6 py-3 text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {uploads.length > 0 ? (
                  uploads.map((upload) => (
                    <tr key={upload._id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-3 text-sm text-gray-700">
                        {getCollegeName(upload.college_id)}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-700">{upload.fileName}</td>
                      <td className="px-6 py-3 text-sm text-gray-700">
                        {new Date(upload.createdAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-3 flex space-x-2">
                        <button
                          onClick={() => router.push(`/admin/addBrochure/${upload._id}`)}
                          className="bg-blue-500 text-white px-3 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-600 transition"
                        >
                          <PencilSquareIcon className="h-5 w-5" />
                          <span>Edit</span>
                        </button>
                        {/* <button
                          onClick={() => handleDelete(upload._id)}
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
                    <td colSpan={4} className="text-center py-4 text-gray-500">
                      No files uploaded.
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
              <span className="text-gray-700 text-sm">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
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

export default AdminUploads;

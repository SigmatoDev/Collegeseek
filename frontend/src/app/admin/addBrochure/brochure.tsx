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
  college_id: { _id: string; name: string }; // Updated type for college_id to include name
  createdAt: string;
}

const AdminUploads = () => {
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch uploads data
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching uploads from:", `${api_url}/brochure`);
        const { data } = await axios.get(`${api_url}/brochure`);

        if (!Array.isArray(data)) {
          console.error("Unexpected API response format");
          setError("Invalid data format received.");
          return;
        }

        setUploads(data);
      } catch (err: any) {
        console.error("API Fetch Error:", err);
        setError(err.response?.data?.message || "Failed to load uploads.");
      } finally {
        setLoading(false);
      }
    };

    if (typeof window !== "undefined") {
      fetchData();
    }
  }, []);

  // Get college name from the upload's college_id
  const getCollegeName = (collegeId: { _id: string; name: string }): string => {
    return collegeId?.name || "Unknown College";
  };

  const handleDelete = async (uploadId: string) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;

    try {
      console.log("Deleting file with ID:", uploadId);
      const response = await axios.delete(`${api_url}/brochure/${uploadId}`);

      console.log("Delete response:", response.data);
      setUploads((prev) => prev.filter((upload) => upload._id !== uploadId));
      toast.success("File deleted successfully!");
    } catch (err: any) {
      console.error("Error deleting file:", err.response?.data || err.message);
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
                      {getCollegeName(upload.college_id)} {/* Display the college name first */}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-700">
                      <a
                        href={`${api_url}${upload.filePath}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {upload.fileName}
                      </a>
                    </td>
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
        </div>
      )}
    </div>
  );
};

export default AdminUploads;

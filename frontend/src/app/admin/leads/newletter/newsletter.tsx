"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { api_url } from "@/utils/apiCall";
import { TrashIcon } from "@heroicons/react/24/solid";

interface Callback {
  _id: string;
  name: string;
  mobile: string;
  email: string;
  stream: string;
}

const AdminCallbacks = () => {
  const [callbacks, setCallbacks] = useState<Callback[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCallbacks = async () => {
      try {
        const { data } = await axios.get(`${api_url}/callbacks`);

        if (!data.success || !Array.isArray(data.data)) {
          console.error("Unexpected API response:", data);
          setError("Invalid data format received.");
          return;
        }

        setCallbacks(data.data);
      } catch (err: any) {
        console.error("API Error:", err);
        setError(err.response?.data?.message || "Failed to load callbacks.");
      } finally {
        setLoading(false);
      }
    };

    fetchCallbacks();
  }, []);

  const handleDelete = async (callbackId: string) => {
    if (!window.confirm("Are you sure you want to delete this callback request?")) return;

    try {
      await axios.delete(`${api_url}/callbacks/${callbackId}`);
      setCallbacks((prev) => prev.filter((callback) => callback._id !== callbackId));
      toast.success("Callback request deleted successfully!");
    } catch (err: any) {
      console.error("Error deleting callback:", err);
      toast.error("Failed to delete callback request.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Manage Callback Requests</h1>

      {loading && (
        <div className="flex justify-center items-center py-6">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold">Error:</strong> <span className="block sm:inline">{error}</span>
          <button onClick={() => setError(null)} className="absolute top-0 bottom-0 right-0 px-4 py-3">✖</button>
        </div>
      )}

      {!loading && !error && (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100 border-b-2 border-gray-300">
              <tr>
                {["Name", "Mobile", "Email", "Stream", "Actions"].map((header) => (
                  <th key={header} className="px-6 py-3 text-left text-gray-600 font-semibold text-sm">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {callbacks.length > 0 ? (
                callbacks.map((callback) => (
                  <tr key={callback._id} className="border-b hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-gray-700">{callback.name}</td>
                    <td className="px-6 py-4 text-gray-700">{callback.mobile}</td>
                    <td className="px-6 py-4 text-gray-700">{callback.email}</td>
                    <td className="px-6 py-4 text-gray-700">{callback.stream}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(callback._id)}
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
                  <td colSpan={5} className="text-center py-6 text-gray-500">No callback requests found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminCallbacks;
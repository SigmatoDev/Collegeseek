"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { api_url } from "@/utils/apiCall";
import { toast } from "react-hot-toast";
import { PencilSquareIcon, PlusCircleIcon, TrashIcon } from "@heroicons/react/24/outline";

interface Specialization {
  _id: string;
  name: string;
}

const AdminSpecializations = () => {
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const { data } = await axios.get(`${api_url}get/Specialization`);
        if (!Array.isArray(data) || data.length === 0) {
          setError("No specialization data received.");
          return;
        }
        setSpecializations(data);
      } catch (err: any) {
        console.error("Fetch error:", err);
        setError(err.response?.data?.message || "Failed to load specializations.");
      } finally {
        setLoading(false);
      }
    };

    if (typeof window !== "undefined") {
      fetchSpecializations();
    }
  }, []);

  const handleDelete = async (specializationId: string) => {
    if (!window.confirm("Are you sure you want to delete this specialization?")) return;

    try {
      await axios.delete(`${api_url}d/Specialization/${specializationId}`);
      setSpecializations((prev) => prev.filter((item) => item._id !== specializationId));
      toast.success("Specialization deleted successfully!");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete specialization.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Specializations List</h1>
        <button
          onClick={() => router.push("/admin/specialization/new")}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          <PlusCircleIcon className="w-5 h-5 mr-2" />
          Add Specialization
        </button>
      </header>

      {loading && <p className="text-center text-gray-500">Loading specializations...</p>}
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
              {specializations.length > 0 ? (
                specializations.map((specialization) => (
                  <tr key={specialization._id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm text-gray-700">{specialization.name}</td>
                    <td className="px-6 py-3 flex space-x-2">
                      <button
                        onClick={() => router.push(`/admin/specialization/${specialization._id}`)}
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
        </div>
      )}
    </div>
  );
};

export default AdminSpecializations;

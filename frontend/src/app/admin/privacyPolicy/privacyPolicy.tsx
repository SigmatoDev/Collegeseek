"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { api_url } from "@/utils/apiCall";
import { toast } from "react-hot-toast";
import { PencilSquareIcon, PlusCircleIcon, TrashIcon } from "@heroicons/react/24/outline";

interface PrivacyPolicy {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
}

const AdminPrivacyPolicy = () => {
  const [privacyPolicies, setPrivacyPolicies] = useState<PrivacyPolicy[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPrivacyPolicies = async () => {
      try {
        const { data } = await axios.get(`${api_url}privacy-policy`); // Adjusted endpoint
        if (!data || !Array.isArray(data)) {
          setError("Invalid response format.");
          return;
        }
        setPrivacyPolicies(data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch privacy policies.");
      } finally {
        setLoading(false);
      }
    };

    if (typeof window !== "undefined") {
      fetchPrivacyPolicies();
    }
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this privacy policy?")) return;

    try {
      await axios.delete(`${api_url}privacy-policy/${id}`); // Adjusted endpoint
      setPrivacyPolicies((prev) => prev.filter((policy) => policy._id !== id));
      toast.success("Privacy policy deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete privacy policy.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Privacy Policy</h1>
        <button
          onClick={() => router.push("/admin/privacyPolicy/new")}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          <PlusCircleIcon className="w-5 h-5 mr-2" />
          Create Privacy Policy
        </button>
      </header>

      {loading && <p className="text-center text-gray-500">Loading privacy policies...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto shadow-md rounded bg-white">
          <table className="table-auto w-full text-left border-collapse">
            <thead className="bg-gray-200 text-gray-600">
              <tr>
                {["Title", "Created At", "Actions"].map((header) => (
                  <th key={header} className="px-6 py-3 text-sm font-semibold">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {privacyPolicies.length > 0 ? (
                privacyPolicies.map((policy) => (
                  <tr key={policy._id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm text-gray-700">{policy.title}</td>
                    <td className="px-6 py-3 text-sm text-gray-700">
                      {new Date(policy.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-3 flex space-x-2">
                      <button
                        onClick={() => router.push(`/admin/privacyPolicy/${policy._id}`)}
                        className="bg-blue-500 text-white px-3 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-600 transition"
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(policy._id)}
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
                  <td colSpan={3} className="text-center py-4 text-gray-500">
                    No privacy policies found.
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

export default AdminPrivacyPolicy;

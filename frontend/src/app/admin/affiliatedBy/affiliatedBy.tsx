"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { api_url } from "@/utils/apiCall";
import { toast } from "react-hot-toast";
import { PencilSquareIcon, PlusCircleIcon, TrashIcon } from "@heroicons/react/24/outline";

interface AffiliatedBy {
  _id: string;
  name: string;
  code: string;
}

const AdminAffiliatedBy = () => {
  const [affiliations, setAffiliations] = useState<AffiliatedBy[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchAffiliations = async () => {
      try {
        console.log("Fetching affiliations...");
  
        const { data } = await axios.get(`${api_url}get/affiliated`);
        console.log("API Response:", data);
  
        // Ensure data is an object with a "data" field that contains an array
        if (!data.success || !Array.isArray(data.data) || data.data.length === 0) {
          console.error("Unexpected API response or empty affiliations:", data);
          setError("No affiliation data received.");
          return;
        }
  
        setAffiliations(data.data); // Access the "data" field of the response object
      } catch (err: any) {
        console.error("API Fetch Error:", err);
        setError(err.response?.data?.message || "Failed to load affiliations.");
      } finally {
        setLoading(false);
      }
    };
  
    if (typeof window !== "undefined") {
      fetchAffiliations();
    }
  }, []);
  

  const handleDelete = async (affiliationId: string) => {
    if (!window.confirm("Are you sure you want to delete this affiliation?")) return;

    try {
      await axios.delete(`${api_url}d/affiliated/${affiliationId}`);
      setAffiliations((prev) => prev.filter((item) => item._id !== affiliationId));
      toast.success("Affiliation deleted successfully!");
    } catch (err) {
      console.error("Error deleting affiliation:", err);
      toast.error("Error deleting affiliation. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Affiliated By List</h1>
        <button
          onClick={() => router.push("/admin/affiliatedBy/new")}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          <PlusCircleIcon className="w-5 h-5 mr-2" />
          Add Affiliation
        </button>
      </header>

      {loading && <p className="text-center text-gray-500">Loading affiliations...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && (
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
              {affiliations.length > 0 ? (
                affiliations.map((affiliation) => (
                  <tr key={affiliation._id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm text-gray-700">{affiliation.name}</td>
                    <td className="px-6 py-3 text-sm text-gray-700">{affiliation.code}</td>
                    <td className="px-6 py-3 flex space-x-2">
                      <button
                        onClick={() => router.push(`/admin/affiliatedBy/${affiliation._id}`)}
                        className="bg-blue-500 text-white px-3 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-600 transition"
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(affiliation._id)}
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
                    No affiliations found.
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

export default AdminAffiliatedBy;

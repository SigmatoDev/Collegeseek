"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { api_url } from "@/utils/apiCall"; // Assuming you have the api_url set up
import { toast } from "react-hot-toast";
import { PencilSquareIcon, PlusCircleIcon, TrashIcon } from "@heroicons/react/24/outline";

interface Approval {
  _id: string;
  name: string;
  code: string;
}

const AdminApprovals = () => {
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchApprovals = async () => {
      try {
        console.log("Fetching approvals..."); // Log before API call
  
        const { data } = await axios.get(`${api_url}get/approvals`);
        console.log("API Response:", data); // Log the API response
  
        // Check if data is an array and not empty
        if (!Array.isArray(data) || data.length === 0) {
          console.error("Unexpected API response format or empty data:", data);
          setError("No approvals data received.");
          return;
        }
  
        setApprovals(data);
        console.log("Approvals set:", data); // Log after setting approvals
      } catch (err: any) {
        console.error("API Fetch Error:", err);
        setError(err.response?.data?.message || "Failed to load approvals.");
      } finally {
        console.log("Finished fetching approvals."); // Log when finished
        setLoading(false);
      }
    };
  
    if (typeof window !== "undefined") {
      console.log("Window is defined, fetching approvals..."); // Log before calling fetchApprovals
      fetchApprovals();
    }
  }, []);
  
  

  const handleDelete = async (approvalId: string) => {
    if (!window.confirm("Are you sure you want to delete this approval?")) return;

    try {
      await axios.delete(`${api_url}d/approvals/${approvalId}`);
      setApprovals((prev) => prev.filter((approval) => approval._id !== approvalId));
      toast.success("Approval deleted successfully!");
    } catch (err) {
      console.error("Error deleting approval:", err);
      toast.error("Error deleting approval. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Approvals List</h1>
        <button
          onClick={() => router.push("/admin/approvels/new")}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          <PlusCircleIcon className="w-5 h-5 mr-2" />
          Add Approval
        </button>
      </header>

      {loading && <p className="text-center text-gray-500">Loading approvals...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto shadow-md rounded bg-white">
          <table className="table-auto w-full text-left border-collapse">
            <thead className="bg-gray-200 text-gray-600">
              <tr>
                {["Name", "Code", "Actions"].map((header) => (
                  <th key={header} className="px-6 py-3 text-sm font-semibold">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.isArray(approvals) && approvals.length > 0 ? (
                approvals.map((approval) => (
                  <tr key={approval._id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm text-gray-700">{approval.name}</td>
                    <td className="px-6 py-3 text-sm text-gray-700">{approval.code}</td>
                    <td className="px-6 py-3 flex space-x-2">
                      <button
                        onClick={() => router.push(`/admin/approvels/${approval._id}`)}
                        className="bg-blue-500 text-white px-3 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-600 transition"
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(approval._id)}
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
                    No approvals found.
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

export default AdminApprovals;

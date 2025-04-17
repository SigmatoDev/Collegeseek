"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { api_url } from "@/utils/apiCall";
import { toast } from "react-hot-toast";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

interface CounsellingRequest {
  _id: string;
  name: string;
  email: string;
  phone: string;
  college: string;
  message: string;
  createdAt: string;
}

const AdminCounselling = () => {
  const [counsellingRequests, setCounsellingRequests] = useState<CounsellingRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCounsellingRequests = async () => {
      try {
        const { data } = await axios.get(`${api_url}/counselling`);
  
        // Check if data is an object and if it has a key `data` containing an array
        if (!data || !Array.isArray(data.data)) {
          console.error("Unexpected API response format:", data);
          setError("Invalid data format received.");
          return;
        }
  
        setCounsellingRequests(data.data); // Access data from the 'data' key
      } catch (err: any) {
        console.error("API Fetch Error:", err);
        setError(err.response?.data?.message || "Failed to load counselling requests.");
      } finally {
        setLoading(false);
      }
    };
  
    if (typeof window !== "undefined") {
      fetchCounsellingRequests();
    }
  }, []);
  

  const handleDelete = async (counsellingId: string) => {
    if (!window.confirm("Are you sure you want to delete this counselling request?")) return;

    try {
      await axios.delete(`${api_url}/counselling/${counsellingId}`);
      setCounsellingRequests((prev) => prev.filter((request) => request._id !== counsellingId));
      toast.success("Counselling request deleted successfully!");
    } catch (err) {
      console.error("Error deleting counselling request:", err);
      toast.error("Error deleting counselling request. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Counselling Requests</h1>
      </header>

      {/* Loading & Error Messages */}
      {loading && <p className="text-center text-gray-500">Loading counselling requests...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Counselling Requests Table */}
      {!loading && !error && (
        <div className="overflow-x-auto shadow-md rounded bg-white">
          <table className="table-auto w-full text-left border-collapse">
            <thead className="bg-gray-200 text-gray-600">
              <tr>
                {["Name", "Email", "Phone", "College", "Message", "Created At", "Actions"].map((header) => (
                  <th key={header} className="px-6 py-3 text-sm font-semibold">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {counsellingRequests.length > 0 ? (
                counsellingRequests.map((request) => (
                  <tr key={request._id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm text-gray-700">{request.name}</td>
                    <td className="px-6 py-3 text-sm text-gray-700">{request.email}</td>
                    <td className="px-6 py-3 text-sm text-gray-700">{request.phone}</td>
                    <td className="px-6 py-3 text-sm text-gray-700">{request.college}</td>
                    <td className="px-6 py-3 text-sm text-gray-700">{request.message}</td>
                    <td className="px-6 py-3 text-sm text-gray-700">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-3 flex space-x-2">
                      <button
                        onClick={() => router.push(`/admin/leads/getFreeCounselling/${request._id}`)}
                        className="bg-blue-500 text-white px-3 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-600 transition"
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(request._id)}
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
                  <td colSpan={7} className="text-center py-4 text-gray-500">
                    No counselling requests found.
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

export default AdminCounselling;

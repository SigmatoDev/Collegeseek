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

  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 10; // You can adjust this or make it dynamic

  const router = useRouter();

  const fetchAffiliations = async (pageNumber: number = 1) => {
    setLoading(true);
    setError(null);

    try {
      console.log(`Fetching affiliations for page ${pageNumber}...`);

      // Pass page and limit as query parameters
      const { data } = await axios.get(
        `${api_url}get/affiliated?page=${pageNumber}&limit=${limit}`
      );
      console.log("API Response:", data);

      if (!data.success || !Array.isArray(data.data)) {
        console.error("Unexpected API response or empty affiliations:", data);
        setError("No affiliation data received.");
        setAffiliations([]);
        setTotalPages(1);
        return;
      }

      setAffiliations(data.data);
      setTotalPages(data.pagination?.totalPages || 1);
      setPage(data.pagination?.currentPage || 1);
    } catch (err: any) {
      console.error("API Fetch Error:", err);
      setError(err.response?.data?.message || "Failed to load affiliations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      fetchAffiliations(page);
    }
  }, [page]);

  const handleDelete = async (affiliationId: string) => {
    if (!window.confirm("Are you sure you want to delete this affiliation?")) return;

    try {
      await axios.delete(`${api_url}d/affiliated/${affiliationId}`);
      toast.success("Affiliation deleted successfully!");
      // Refresh current page data after deletion
      fetchAffiliations(page);
    } catch (err) {
      console.error("Error deleting affiliation:", err);
      toast.error("Error deleting affiliation. Please try again.");
    }
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
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
        <>
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
                        {/* Uncomment below to enable delete */}
                        {/* <button
                          onClick={() => handleDelete(affiliation._id)}
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
                    <td colSpan={3} className="text-center py-4 text-gray-500">
                      No affiliations found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {/* Pagination Controls */}
            <div className="flex justify-between items-center p-4 border-t bg-gray-50">
              <button
                onClick={handlePrevPage}
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
                onClick={handleNextPage}
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

export default AdminAffiliatedBy;

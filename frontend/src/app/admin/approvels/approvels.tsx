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

interface Approval {
  _id: string;
  name: string;
  code: string;
}

const AdminApprovals = () => {
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 10; // items per page

  const router = useRouter();

  useEffect(() => {
    const fetchApprovals = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${api_url}get/approvals`, {
          params: {
            page: currentPage,
            limit,
          },
        });

        if (!data.success || !Array.isArray(data.data)) {
          setError("Invalid data format received.");
          setApprovals([]);
          setTotalPages(1);
          return;
        }

        setApprovals(data.data);
        setTotalPages(data.pagination?.totalPages || 1);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load approvals.");
        setApprovals([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovals();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
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

      {loading && (
        <p className="text-center text-gray-500">Loading approvals...</p>
      )}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && (
        <>
          <div className="overflow-x-auto shadow-md rounded bg-white">
            <table className="table-auto w-full text-left border-collapse">
              <thead className="bg-gray-200 text-gray-600">
                <tr>
                  {["Name", "Code", "Actions"].map((header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-sm font-semibold"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {approvals.length > 0 ? (
                  approvals.map((approval) => (
                    <tr
                      key={approval._id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="px-6 py-3 text-sm text-gray-700">
                        {approval.name}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-700">
                        {approval.code}
                      </td>
                      <td className="px-6 py-3 flex space-x-2">
                        <button
                          onClick={() =>
                            router.push(`/admin/approvels/${approval._id}`)
                          }
                          className="bg-blue-500 text-white px-3 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-600 transition"
                        >
                          <PencilSquareIcon className="h-5 w-5" />
                          <span>Edit</span>
                        </button>
                        {/* Uncomment below if you want delete functionality */}
                        {/* <button
                          onClick={() => handleDelete(approval._id)}
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
                      No approvals found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center p-4 border-t bg-gray-50">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition ${
                  currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Previous
              </button>

              <span className="flex items-center space-x-2 text-sm text-gray-700">
                Page {currentPage} of {totalPages}
                <span className="p-2">/ Go to page:</span>
                <input
                  type="number"
                  min={1}
                  max={totalPages}
                  placeholder="Page #"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const pageNum = Number(
                        (e.target as HTMLInputElement).value
                      );
                      if (
                        !isNaN(pageNum) &&
                        pageNum >= 1 &&
                        pageNum <= totalPages
                      ) {
                        setCurrentPage(pageNum);
                        (e.target as HTMLInputElement).value = ""; // clear input after jump
                      }
                    }
                  }}
                  className="w-16 border border-gray-300 rounded px-2 py-1 text-center text-sm ml-2"
                />
              </span>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition ${
                  currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : ""
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

export default AdminApprovals;

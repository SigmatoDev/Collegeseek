"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { api_url } from "@/utils/apiCall";
import { TrashIcon } from "@heroicons/react/24/solid";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";

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

  // Pagination states
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 10; // Items per page

  useEffect(() => {
    const fetchCallbacks = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `${api_url}/callbacks?page=${page}&limit=${limit}`
        );

        if (!data.success || !Array.isArray(data.data)) {
          console.error("Unexpected API response:", data);
          setError("Invalid data format received.");
          return;
        }

        setCallbacks(data.data);
        setTotalPages(data.totalPages || 1);
      } catch (err: any) {
        console.error("API Error:", err);
        setError(err.response?.data?.message || "Failed to load callbacks.");
      } finally {
        setLoading(false);
      }
    };

    fetchCallbacks();
  }, [page]); // refetch when page changes

  const handleDelete = async (callbackId: string) => {
    if (
      !window.confirm("Are you sure you want to delete this callback request?")
    )
      return;

    try {
      await axios.delete(`${api_url}/callbacks/${callbackId}`);
      // Remove deleted callback locally
      setCallbacks((prev) =>
        prev.filter((callback) => callback._id !== callbackId)
      );
      toast.success("Callback request deleted successfully!");
    } catch (err: any) {
      console.error("Error deleting callback:", err);
      toast.error("Failed to delete callback request.");
    }
  };

  const goToPage = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setPage(pageNumber);
  };

  const exportCallbacks = async () => {
    try {
      const { data } = await axios.get(
        `${api_url}/callbacks?page=1&limit=1000`
      );
      const rows: Callback[] = Array.isArray(data.data) ? data.data : [];
      if (!rows.length) {
        toast.error("No newsletter records to export.");
        return;
      }

      const csvHeader = ["Name", "Mobile", "Email", "Stream"].join(",");
      const escapeValue = (value: string | number) =>
        `"${(value ?? "")
          .toString()
          .replace(/\r?\n|\r/g, " ")
          .replace(/"/g, '""')}"`;
      const csvRows = rows
        .map((row) =>
          [
            escapeValue(row.name),
            escapeValue(row.mobile),
            escapeValue(row.email),
            escapeValue(row.stream),
          ].join(",")
        )
        .join("\n");

      const csvContent = `${csvHeader}\n${csvRows}`;
      const blob = new Blob([csvContent], {
        type: "text/csv;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `newsletter-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("Newsletter list exported.");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export newsletter list.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex flex-col gap-3 text-gray-800 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold">Manage Newsletter List</h1>
        <button
          onClick={exportCallbacks}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
        >
          <ArrowDownTrayIcon className="h-5 w-5" />
          Export CSV
        </button>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-6">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold">Error:</strong>{" "}
          <span className="block sm:inline">{error}</span>
          <button
            onClick={() => setError(null)}
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
          >
            ✖
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="w-full border-collapse">
              <thead className="bg-gray-100 border-b-2 border-gray-300">
                <tr>
                  {["Name", "Mobile", "Email", "Stream", "Actions"].map(
                    (header) => (
                      <th
                        key={header}
                        className="px-6 py-3 text-left text-gray-600 font-semibold text-sm"
                      >
                        {header}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {callbacks.length > 0 ? (
                  callbacks.map((callback) => (
                    <tr
                      key={callback._id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 text-gray-700">
                        {callback.name}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {callback.mobile}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {callback.email}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {callback.stream}
                      </td>
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
                    <td colSpan={5} className="text-center py-6 text-gray-500">
                      No callback requests found.
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

              <span className="flex items-center space-x-2 text-sm text-gray-700">
                Page {page} of {totalPages}
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
                        setPage(pageNum);
                        (e.target as HTMLInputElement).value = ""; // clear input after jump
                      }
                    }
                  }}
                  className="w-16 border border-gray-300 rounded px-2 py-1 text-center text-sm ml-2"
                />
              </span>

              <button
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, totalPages))
                }
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

export default AdminCallbacks;

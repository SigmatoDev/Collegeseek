"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { api_url } from "@/utils/apiCall";
import { PencilSquareIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";

interface CounsellingRequest {
  _id: string;
  name: string;
  email: string;
  phone: string;
  college: string;
  message: string;
  createdAt: string;
  status: "pending" | "contacted" | "in-progress" | "closed";
}

interface PaginationInfo {
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

const AdminCounselling = () => {
  const [counsellingRequests, setCounsellingRequests] = useState<
    CounsellingRequest[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "name" | "status">(
    "newest"
  );
  const [statusFilter, setStatusFilter] = useState<
    "all" | CounsellingRequest["status"]
  >("all");
  const router = useRouter();

  const fetchCounsellingRequests = async (currentPage: number) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${api_url}/counselling`, {
        params: { page: currentPage, limit: 10 },
      });

      if (!data || !Array.isArray(data.data)) {
        console.error("Unexpected API response format:", data);
        setError("Invalid data format received.");
        return;
      }

      setCounsellingRequests(
        data.data.map(
          (request: CounsellingRequest & { status?: CounsellingRequest["status"] }) => ({
            ...request,
            status: request.status || "pending",
          })
        )
      );
      setPagination(data.pagination);
      setError(null);
    } catch (err: any) {
      console.error("API Fetch Error:", err);
      setError(
        err.response?.data?.message || "Failed to load counselling requests."
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();
    const matches = counsellingRequests.filter((request) => {
      if (statusFilter !== "all" && request.status !== statusFilter) {
        return false;
      }
      if (!normalized) return true;
      return [
        request.name,
        request.email,
        request.phone,
        request.college,
        request.message,
        request.status,
      ]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalized));
    });

    const sorted = [...matches];
    sorted.sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === "status") {
        return a.status.localeCompare(b.status);
      }
      const dateDiff =
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return sortBy === "oldest" ? dateDiff : -dateDiff;
    });

    return sorted;
  }, [counsellingRequests, searchTerm, sortBy, statusFilter]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      fetchCounsellingRequests(page);
    }
  }, [page]);

  const exportCounselling = async () => {
    try {
      const { data } = await axios.get(`${api_url}/counselling`, {
        params: { page: 1, limit: 1000 },
      });
      const rows: CounsellingRequest[] = Array.isArray(data.data)
        ? data.data
        : [];
      if (!rows.length) {
        toast.error("No counselling requests to export.");
        return;
      }

      const escapeValue = (value: string | number) =>
        `"${(value ?? "")
          .toString()
          .replace(/\r?\n|\r/g, " ")
          .replace(/"/g, '""')}"`;
      const header = [
        "Name",
        "Email",
        "Phone",
        "College",
        "Message",
        "Status",
        "Created At",
      ].join(",");
      const csvRows = rows
        .map((row) =>
          [
            escapeValue(row.name),
            escapeValue(row.email),
            escapeValue(row.phone),
            escapeValue(row.college),
            escapeValue(row.message || ""),
            escapeValue((row.status || "pending").replace("-", " ")),
            escapeValue(new Date(row.createdAt).toLocaleString()),
          ].join(",")
        )
        .join("\n");

      const blob = new Blob([`${header}\n${csvRows}`], {
        type: "text/csv;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `counselling-requests-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("Counselling requests exported.");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export counselling requests.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-6 space-y-4 text-gray-800">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold">Counselling Requests</h1>
          <button
            onClick={exportCounselling}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
          >
            <ArrowDownTrayIcon className="h-5 w-5" />
            Export CSV
          </button>
        </div>
        <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white/80 p-4 shadow-sm md:flex-row md:flex-wrap md:items-center md:justify-between">
          <div className="flex w-full items-center gap-3 md:max-w-sm">
            <label className="text-sm font-semibold text-gray-500">
              Search
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, phone or note..."
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-blue-400 focus:outline-none"
            />
          </div>
          <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center">
            <div className="flex items-center gap-3">
              <label className="text-sm font-semibold text-gray-500">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value as
                      | "all"
                      | CounsellingRequest["status"]
                  )
                }
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-blue-400 focus:outline-none"
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="contacted">Contacted</option>
                <option value="in-progress">In progress</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm font-semibold text-gray-500">
                Sort by
              </label>
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(
                    e.target.value as "newest" | "oldest" | "name" | "status"
                  )
                }
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-blue-400 focus:outline-none"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="name">Name A-Z</option>
                <option value="status">Status</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {loading && (
        <p className="text-center text-gray-500">
          Loading counselling requests...
        </p>
      )}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && (
        <>
          <div className="overflow-x-auto shadow-md rounded bg-white">
            <table className="table-auto w-full text-left border-collapse">
              <thead className="bg-gray-200 text-gray-600">
                <tr>
                  {[
                    "Name",
                    "Email",
                    "Phone",
                    "Status",
                    "Created At",
                    "Actions",
                  ].map((header) => (
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
                {filteredRequests.length > 0 ? (
                  filteredRequests.map((request) => (
                    <tr key={request._id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-3 text-sm text-gray-700">
                        {request.name}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-700">
                        {request.email}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-700">
                        {request.phone}
                      </td>
                     
                      <td className="px-6 py-3 text-sm">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                            {
                              pending: "bg-amber-50 text-amber-700",
                              contacted: "bg-blue-50 text-blue-700",
                              "in-progress": "bg-purple-50 text-purple-700",
                              closed: "bg-emerald-50 text-emerald-700",
                            }[request.status] || "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {request.status.replace("-", " ")}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-700">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-3 flex space-x-2">
                        <button
                          onClick={() =>
                            router.push(
                              `/admin/leads/getFreeCounselling/${request._id}`
                            )
                          }
                          className="bg-blue-500 text-white px-3 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-600 transition"
                        >
                          <PencilSquareIcon className="h-5 w-5" />
                          <span>Edit</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center py-4 text-gray-500">
                      No counselling requests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination Controls */}
            {pagination && (
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
                  Page {page} of {pagination.totalPages}
                  <span className="p-2">/ Go to page:</span>
                  <input
                    type="number"
                    min={1}
                    max={pagination.totalPages}
                    placeholder="Page #"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const pageNum = Number(
                          (e.target as HTMLInputElement).value
                        );
                        if (
                          !isNaN(pageNum) &&
                          pageNum >= 1 &&
                          pageNum <= pagination.totalPages
                        ) {
                          setPage(pageNum);
                        }
                      }
                    }}
                    className="w-16 border border-gray-300 rounded px-2 py-1 text-center text-sm ml-2"
                  />
                </span>

                <button
                  onClick={() =>
                    setPage((prev) => Math.min(prev + 1, pagination.totalPages))
                  }
                  disabled={page === pagination.totalPages}
                  className={`px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition ${
                    page === pagination.totalPages
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminCounselling;

"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { api_url } from "@/utils/apiCall";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";
import CareerApplications from "./careerApplications";

interface ApplicationRow {
  _id: string;
  status: string;
  createdAt: string;
  applicant?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    mobile?: string;
  };
  registration?: {
    course?: string;
    program?: string;
    applicationNo?: string;
  };
}

interface PaginationInfo {
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

const ApplicationsList = () => {
  const [applications, setApplications] = useState<ApplicationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "name">("newest");
  const [activeTab, setActiveTab] = useState<"course" | "career">("course");
  const router = useRouter();

  const fetchApplications = async (currentPage: number) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${api_url}/applications`, {
        params: {
          page: currentPage,
          limit: 10,
          search: searchTerm || undefined,
          status: statusFilter !== "all" ? statusFilter : undefined,
        },
      });

      setApplications(Array.isArray(data.data) ? data.data : []);
      setPagination(data.pagination || null);
      setError(null);
    } catch (err: any) {
      console.error("API Fetch Error:", err);
      setError(err.response?.data?.message || "Failed to load applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      fetchApplications(page);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const filteredApplications = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();
    const matches = applications.filter((app) => {
      if (statusFilter !== "all" && app.status !== statusFilter) return false;
      if (!normalized) return true;
      const fullName = `${app.applicant?.firstName || ""} ${app.applicant?.lastName || ""}`.trim();
      return [
        fullName,
        app.applicant?.email,
        app.applicant?.mobile,
        app.registration?.course,
        app.registration?.program,
        app.registration?.applicationNo,
        app.status,
      ]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(normalized));
    });

    const sorted = [...matches];
    sorted.sort((a, b) => {
      if (sortBy === "name") {
        const nameA = `${a.applicant?.firstName || ""} ${a.applicant?.lastName || ""}`.trim();
        const nameB = `${b.applicant?.firstName || ""} ${b.applicant?.lastName || ""}`.trim();
        return nameA.localeCompare(nameB);
      }
      const dateDiff =
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return sortBy === "oldest" ? dateDiff : -dateDiff;
    });

    return sorted;
  }, [applications, searchTerm, statusFilter, sortBy]);

  const exportApplications = async () => {
    try {
      const { data } = await axios.get(`${api_url}/applications`, {
        params: { page: 1, limit: 2000 },
      });
      const rows: ApplicationRow[] = Array.isArray(data.data) ? data.data : [];
      if (!rows.length) {
        toast.error("No applications to export.");
        return;
      }

      const escapeValue = (value: string | number) =>
        `"${(value ?? "")
          .toString()
          .replace(/\r?\n|\r/g, " ")
          .replace(/"/g, '""')}"`;

      const header = [
        "Application No",
        "Name",
        "Email",
        "Mobile",
        "Course",
        "Program",
        "Status",
        "Created At",
      ].join(",");

      const csvRows = rows
        .map((row) =>
          [
            escapeValue(row.registration?.applicationNo || ""),
            escapeValue(
              `${row.applicant?.firstName || ""} ${row.applicant?.lastName || ""}`.trim()
            ),
            escapeValue(row.applicant?.email || ""),
            escapeValue(row.applicant?.mobile || ""),
            escapeValue(row.registration?.course || ""),
            escapeValue(row.registration?.program || ""),
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
      link.setAttribute("download", `applications-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("Applications exported.");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export applications.");
    }
  };

  useEffect(() => {
    fetchApplications(1);
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, statusFilter]);

  if (activeTab === "career") return <CareerApplications onCourseApplications={() => setActiveTab("course")} />;

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-6 space-y-4 text-gray-800">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold">Applications</h1>
          <button
            onClick={exportApplications}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
          >
            <ArrowDownTrayIcon className="h-5 w-5" />
            Export CSV
          </button>
        </div>
        <div className="flex border-b border-gray-200"><button className="border-b-2 border-[#441A6B] px-4 py-2 text-sm font-semibold text-[#441A6B]">College Applications</button><button onClick={() => setActiveTab("career")} className="border-b-2 border-transparent px-4 py-2 text-sm font-semibold text-gray-500 hover:text-gray-800">Career</button></div>
        <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white/80 p-4 shadow-sm md:flex-row md:flex-wrap md:items-center md:justify-between">
          <div className="flex w-full items-center gap-3 md:max-w-sm">
            <label className="text-sm font-semibold text-gray-500">Search</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, course, program"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-blue-400 focus:outline-none"
            />
          </div>
          <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center">
            <div className="flex items-center gap-3">
              <label className="text-sm font-semibold text-gray-500">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-blue-400 focus:outline-none"
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="reviewing">Reviewing</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm font-semibold text-gray-500">Sort</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "newest" | "oldest" | "name")}
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-blue-400 focus:outline-none"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {loading ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-6 text-center text-gray-500">
          Loading applications...
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-600">
          {error}
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-6 text-center text-gray-500">
          No applications found.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">Applicant</th>
                <th className="px-4 py-3">Course / Program</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Submitted</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredApplications.map((app) => (
                <tr key={app._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-gray-800">
                      {`${app.applicant?.firstName || ""} ${app.applicant?.lastName || ""}`.trim() || "N/A"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {app.applicant?.email || ""} {app.applicant?.mobile ? `• ${app.applicant.mobile}` : ""}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-gray-700">{app.registration?.course || "-"}</div>
                    <div className="text-xs text-gray-500">{app.registration?.program || ""}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                      {(app.status || "pending").replace("-", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {new Date(app.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => router.push(`/admin/leads/applications/${app._id}`)}
                      className="rounded-lg border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-100"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pagination && pagination.totalPages > 1 && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <button
            className="px-3 py-1 border rounded bg-white text-black disabled:opacity-50"
            disabled={page <= 1}
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          >
            Prev
          </button>
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              className={`px-3 py-1 border rounded ${page === p ? "bg-black text-white" : "bg-white text-black"}`}
              onClick={() => setPage(p)}
            >
              {p}
            </button>
          ))}
          <button
            className="px-3 py-1 border rounded bg-white text-black disabled:opacity-50"
            disabled={page >= pagination.totalPages}
            onClick={() => setPage((prev) => Math.min(pagination.totalPages, prev + 1))}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ApplicationsList;

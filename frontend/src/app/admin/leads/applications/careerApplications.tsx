"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";
import { api_url } from "@/utils/apiCall";

type CareerApplication = { _id: string; fullName: string; email: string; phone: string; positionApplyingFor: string; jobLocation: string; status: string; createdAt: string };
type Pagination = { total: number; page: number; totalPages: number; limit: number };

export default function CareerApplications({ onCourseApplications }: { onCourseApplications: () => void }) {
  const router = useRouter();
  const [items, setItems] = useState<CareerApplication[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState<"newest" | "oldest" | "name">("newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getToken = () => typeof window === "undefined" ? "" : sessionStorage.getItem("token") || "";
  const load = async (requestedPage = page, exportAll = false) => {
    try {
      setLoading(!exportAll);
      const { data } = await axios.get(`${api_url}admin/career-applications`, { headers: { Authorization: `Bearer ${getToken()}` }, params: { page: requestedPage, limit: exportAll ? 2000 : 10, search: search || undefined, status: status === "all" ? undefined : status } });
      if (!exportAll) { setItems(data.data || []); setPagination(data.pagination || null); setError(""); }
      return data.data || [];
    } catch (requestError: any) {
      const message = requestError.response?.data?.message || "Failed to load career applications.";
      if (!exportAll) setError(message);
      throw requestError;
    } finally { if (!exportAll) setLoading(false); }
  };

  useEffect(() => { load(page).catch(() => undefined); }, [page]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { setPage(1); load(1).catch(() => undefined); }, [search, status]); // eslint-disable-line react-hooks/exhaustive-deps
  const visible = useMemo(() => [...items].sort((a, b) => sort === "name" ? a.fullName.localeCompare(b.fullName) : (sort === "oldest" ? 1 : -1) * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())), [items, sort]);
  const exportCsv = async () => {
    try {
      const rows = await load(1, true);
      if (!rows.length) return toast.error("No career applications to export.");
      const escape = (value: unknown) => `"${String(value || "").replace(/"/g, '""')}"`;
      const csv = ["Applicant,Email,Phone,Position,Location,Status,Submitted", ...rows.map((row: CareerApplication) => [row.fullName, row.email, row.phone, row.positionApplyingFor, row.jobLocation, row.status, new Date(row.createdAt).toLocaleString()].map(escape).join(","))].join("\n");
      const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
      const link = document.createElement("a"); link.href = url; link.download = `career-applications-${Date.now()}.csv`; link.click(); URL.revokeObjectURL(url);
      toast.success("Career applications exported.");
    } catch { toast.error("Failed to export career applications."); }
  };
  return <div className="container mx-auto px-4 py-8">
    <header className="mb-6 space-y-4 text-gray-800">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Applications</h1>
          <p className="mt-1 text-sm text-gray-500">Manage career applications separately from course and program applications.</p>
          </div>
          <button onClick={exportCsv} className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50">
            <ArrowDownTrayIcon className="h-5 w-5" />Export CSV</button>
          </div>
          <div className="flex border-b border-gray-200">
            <button onClick={onCourseApplications} className="border-b-2 border-transparent px-4 py-2 text-sm font-semibold text-gray-500 hover:text-gray-800">College Applications</button>
            <button className="border-b-2 border-[#441A6B] px-4 py-2 text-sm font-semibold text-[#441A6B]">Career</button>
          </div>
            <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white/80 p-4 shadow-sm md:flex-row md:flex-wrap md:items-center md:justify-between">
            <div className="flex w-full items-center gap-3 md:max-w-sm">
              <label className="text-sm font-semibold text-gray-500">Search</label>
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search applicant or job" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm focus:border-blue-400 focus:outline-none" />
            </div>
              <div className="flex items-center gap-3">
                <label className="text-sm font-semibold text-gray-500">Status</label>
                <select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm">
                  <option value="all">All</option>
                  <option value="pending">Pending</option>
                  <option value="reviewing">Reviewing</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="rejected">Rejected</option>
                  <option value="hired">Hired</option>
                </select>
                <select value={sort} onChange={(event) => setSort(event.target.value as typeof sort)} className="rounded-lg border border-gray-200 px-3 py-2 text-sm shadow-sm">
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="name">Name</option>
                </select>
              </div>
              </div>
                </header>{loading ? <State text="Loading career applications..." /> : error ? <State text={error} error /> : !visible.length ? <State text="No career applications found." /> : <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm"><table className="min-w-full text-left text-sm"><thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500"><tr><th className="px-4 py-3">Applicant</th><th className="px-4 py-3">Position</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Submitted</th><th className="px-4 py-3">Action</th></tr></thead><tbody className="divide-y divide-gray-100">{visible.map((item) => <tr key={item._id} className="hover:bg-gray-50"><td className="px-4 py-3"><p className="font-semibold text-gray-800">{item.fullName}</p><p className="text-xs text-gray-500">{item.email} · {item.phone}</p></td><td className="px-4 py-3"><p className="text-gray-700">{item.positionApplyingFor}</p><p className="text-xs text-gray-500">{item.jobLocation}</p></td><td className="px-4 py-3"><span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold capitalize text-gray-700">{item.status}</span></td><td className="px-4 py-3 text-gray-600">{new Date(item.createdAt).toLocaleString()}</td><td className="px-4 py-3"><button onClick={() => router.push(`/admin/leads/applications/careers/${item._id}`)} className="rounded-lg border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-100">View</button></td></tr>)}</tbody></table></div>}{pagination && pagination.totalPages > 1 && <div className="mt-6 flex justify-center gap-2"><button disabled={page <= 1} onClick={() => setPage((value) => value - 1)} className="rounded border bg-white px-3 py-1 disabled:opacity-50">Prev</button><span className="px-3 py-1 text-sm text-gray-600">Page {pagination.page} of {pagination.totalPages}</span><button disabled={page >= pagination.totalPages} onClick={() => setPage((value) => value + 1)} className="rounded border bg-white px-3 py-1 disabled:opacity-50">Next</button></div>}</div>;
}
function State({ text, error = false }: { text: string; error?: boolean }) { return <div className={`rounded-2xl border p-6 text-center ${error ? "border-red-200 bg-red-50 text-red-600" : "border-dashed border-gray-200 bg-white text-gray-500"}`}>{text}</div>; }

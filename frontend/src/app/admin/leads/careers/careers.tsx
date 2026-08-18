"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { api_url } from "@/utils/apiCall";
import { toast } from "react-hot-toast";
import {
  EyeIcon,
  PencilSquareIcon,
  PlusCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

type Career = {
  _id: string;
  title: string;
  slug: string;
  location: string;
  employmentType: string;
  experienceRequired: string;
  applicationDeadline: string;
  isPublished: boolean;
};

type Pagination = {
  total: number;
  page: number;
  totalPages: number;
  limit: number;
};

const authHeaders = () => {
  const token = sessionStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const CareersList = () => {
  const router = useRouter();
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const fetchCareers = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${api_url}admin/careers`, {
        headers: authHeaders(),
        params: { page, limit: 10, search: search || undefined, status: status === "all" ? undefined : status },
      });
      setCareers(Array.isArray(data.data) ? data.data : []);
      setPagination(data.pagination || null);
      setError("");
    } catch (err: any) {
      setCareers([]);
      setError(err.response?.data?.message || "Failed to load careers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCareers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, status]);

  const togglePublished = async (career: Career) => {
    try {
      await axios.patch(
        `${api_url}admin/careers/${career._id}/publish`,
        { isPublished: !career.isPublished },
        { headers: authHeaders() },
      );
      toast.success(career.isPublished ? "Job unpublished." : "Job published.");
      fetchCareers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update job status.");
    }
  };

  const deleteCareer = async (career: Career) => {
    if (!window.confirm(`Delete “${career.title}”? This cannot be undone.`)) return;
    try {
      await axios.delete(`${api_url}admin/careers/${career._id}`, { headers: authHeaders() });
      toast.success("Job deleted successfully.");
      if (careers.length === 1 && page > 1) setPage((current) => current - 1);
      else fetchCareers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete job.");
    }
  };

  const deadline = (value: string) =>
    new Date(value).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Careers</h1>
          <p className="mt-1 text-sm text-gray-500">Create and manage published job openings.</p>
        </div>
        <button
          onClick={() => router.push("/admin/leads/careers/new")}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700"
        >
          <PlusCircleIcon className="h-5 w-5" /> Add Job
        </button>
      </header>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          value={search}
          onChange={(event) => { setSearch(event.target.value); setPage(1); }}
          placeholder="Search by title, location, or type"
          className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none sm:max-w-md"
        />
        <select
          value={status}
          onChange={(event) => { setStatus(event.target.value); setPage(1); }}
          className="rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        >
          <option value="all">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {loading ? <p className="text-center text-gray-500">Loading jobs...</p> : null}
      {!loading && error ? <p className="text-center text-red-500">{error}</p> : null}
      {!loading && !error ? (
        <div className="overflow-x-auto rounded bg-white shadow-md">
          <table className="w-full table-auto border-collapse text-left">
            <thead className="bg-gray-200 text-gray-600">
              <tr>
                <th className="px-6 py-3 text-sm font-semibold">Job</th>
                <th className="px-6 py-3 text-sm font-semibold">Location</th>
                <th className="px-6 py-3 text-sm font-semibold">Type</th>
                <th className="px-6 py-3 text-sm font-semibold">Deadline</th>
                <th className="px-6 py-3 text-sm font-semibold">Status</th>
                <th className="px-6 py-3 text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {careers.map((career) => (
                <tr key={career._id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 text-sm text-gray-700"><div className="font-semibold">{career.title}</div><div className="text-xs text-gray-500">{career.experienceRequired}</div></td>
                  <td className="px-6 py-3 text-sm text-gray-700">{career.location}</td>
                  <td className="px-6 py-3 text-sm capitalize text-gray-700">{career.employmentType.replace("-", " ")}</td>
                  <td className="px-6 py-3 text-sm text-gray-700">{deadline(career.applicationDeadline)}</td>
                  <td className="px-6 py-3"><button onClick={() => togglePublished(career)} className={`rounded px-3 py-2 text-xs font-semibold ${career.isPublished ? "bg-blue-100 text-blue-700" : "bg-gray-200 text-gray-700"}`}>{career.isPublished ? "Published" : "Draft"}</button></td>
                  <td className="flex space-x-2 px-6 py-3">
                    {/* {career.isPublished ? <button title="View public job" onClick={() => window.open(`/careers/${career.slug}`, "_blank")} className="flex items-center rounded-lg bg-gray-500 px-3 py-2 text-white hover:bg-gray-600"><EyeIcon className="h-4 w-4" /></button> : null} */}
                    <button title="Edit job" onClick={() => router.push(`/admin/leads/careers/${career._id}`)} className="flex items-center rounded-lg bg-blue-500 px-3 py-2 text-white hover:bg-blue-600"><PencilSquareIcon className="h-4 w-4" /></button>
                    <button title="Delete job" onClick={() => deleteCareer(career)} className="flex items-center rounded-lg bg-red-500 px-3 py-2 text-white hover:bg-red-600"><TrashIcon className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
              {careers.length === 0 ? <tr><td colSpan={6} className="py-4 text-center text-gray-500">No jobs found.</td></tr> : null}
            </tbody>
          </table>
        </div>
      ) : null}

      {pagination && pagination.totalPages > 1 ? <div className="mt-6 flex items-center justify-center gap-3">
        <button disabled={page === 1} onClick={() => setPage((current) => current - 1)} className="rounded border bg-white px-3 py-1 text-sm disabled:opacity-50">Previous</button>
        <span className="text-sm text-gray-600">Page {page} of {pagination.totalPages}</span>
        <button disabled={page === pagination.totalPages} onClick={() => setPage((current) => current + 1)} className="rounded border bg-white px-3 py-1 text-sm disabled:opacity-50">Next</button>
      </div> : null}
    </div>
  );
};

export default CareersList;

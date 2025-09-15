"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { api_url } from "@/utils/apiCall";
import { toast } from "react-hot-toast";
import {
  MagnifyingGlassIcon,
  PencilSquareIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import ImportColleges from "./importCollege";
import ExportCollegesButton from "./exportColleges";

interface College {
  _id: string;
  name: string;
  location: string;
  rank?: number;
  courses: string[];
  website: string;
  selected?: boolean;
}

interface Pagination {
  total: number;
  page: number;
  pages: number;
  limit: number;
}

const AdminColleges = () => {
  const [colleges, setColleges] = useState<College[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    pages: 1,
    limit: 10,
  });
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchColleges = async (
    page: number = 1,
    limit: number = 10,
    query: string = ""
  ) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(
        `${api_url}search/colleges?page=${page}&limit=${limit}&search=${encodeURIComponent(
          query
        )}`
      );

      if (!data.success || !Array.isArray(data.data)) {
        throw new Error("Unexpected API response format.");
      }

      setColleges(data.data.map((c: College) => ({ ...c, selected: false })));
      setPagination(data.pagination);
    } catch (err: any) {
      console.error("Error fetching colleges:", err);
      setError(err.response?.data?.message || "Failed to load colleges.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchColleges(pagination.page, pagination.limit, search);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [search, pagination.page, pagination.limit]);

  const goToPage = (page: number) => {
    if (page < 1 || page > pagination.pages) return;
    setPagination((prev) => ({ ...prev, page }));
  };

  const selectedIds = colleges.filter((c) => c.selected).map((c) => c._id);

  if (!mounted) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Colleges List</h1>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <button
            onClick={() => router.push("/admin/manageColleges/new")}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            <PlusCircleIcon className="w-5 h-5 mr-2" />
            Add College
          </button>
          <ImportColleges />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative w-[440px]">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>

            <ExportCollegesButton selectedCollegeIds={selectedIds} />
          </div>

          <div className="flex items-center space-x-3 py-2">
            <label htmlFor="limit" className="text-sm text-gray-600">
              Rows per page
            </label>
            <select
              id="limit"
              value={pagination.limit}
              onChange={(e) =>
                setPagination((prev) => ({
                  ...prev,
                  limit: parseInt(e.target.value, 10),
                  page: 1,
                }))
              }
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              {[10, 20, 50].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
            <label htmlFor="limit" className="text-sm text-gray-600">
              Entries
            </label>
          </div>
        </div>
      </div>

      {loading && (
        <p className="text-center text-gray-500">Loading colleges...</p>
      )}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && (
        <>
          <div className="overflow-x-auto shadow-md rounded bg-white">
            <table className="table-auto w-full text-left border-collapse">
              <thead className="bg-gray-200 text-gray-600">
                <tr>
                  <th className="px-4 py-3">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setColleges((prev) =>
                          prev.map((college) => ({
                            ...college,
                            selected: checked,
                          }))
                        );
                      }}
                    />
                  </th>
                  {["Name", "Location", "Rank", "Website", "Actions"].map(
                    (header) => (
                      <th
                        key={header}
                        className="px-6 py-3 text-sm font-semibold"
                      >
                        {header}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {colleges.length > 0 ? (
                  colleges.map((college) => (
                    <tr key={college._id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={college.selected || false}
                          onChange={() =>
                            setColleges((prev) =>
                              prev.map((c) =>
                                c._id === college._id
                                  ? { ...c, selected: !c.selected }
                                  : c
                              )
                            )
                          }
                        />
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-700">
                        {college.name}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-700">
                        {college.location}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-700">
                        {college.rank ? `#${college.rank}` : "N/A"}
                      </td>
                      <td className="px-6 py-3 text-sm text-blue-500 hover:underline">
                        <a
                          href={college.website}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Visit
                        </a>
                      </td>
                      <td className="px-6 py-3 flex space-x-2">
                        <button
                          onClick={() =>
                            router.push(`/admin/manageColleges/${college._id}`)
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
                    <td colSpan={6} className="text-center py-4 text-gray-500">
                      No colleges found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="flex justify-between items-center p-4 border-t bg-gray-50">
              <button
                onClick={() => goToPage(pagination.page - 1)}
                disabled={pagination.page === 1}
                className={`px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition ${
                  pagination.page === 1 ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Prev
              </button>
              <span className="flex items-center space-x-2 text-sm">
                Page {pagination.page} of {pagination.pages}
                <span className="p-2"> / Go to page:</span>
                <input
                  type="number"
                  min={1}
                  max={pagination.pages}
                  placeholder="Page #"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const pageNum = Number(
                        (e.target as HTMLInputElement).value
                      );
                      if (
                        !isNaN(pageNum) &&
                        pageNum >= 1 &&
                        pageNum <= pagination.pages
                      ) {
                        goToPage(pageNum);
                      }
                    }
                  }}
                  className="w-16 border border-gray-300 rounded px-2 py-1 text-center text-sm ml-2"
                />
              </span>

              <button
                onClick={() => goToPage(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className={`px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition ${
                  pagination.page === pagination.pages
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

export default AdminColleges;

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
  TrashIcon,
} from "@heroicons/react/24/outline";
import ImportColleges from "./importCollege";

interface College {
  _id: string;
  name: string;
  location: string;
  rank?: number;
  courses: string[];
  website: string;
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
  const router = useRouter();

  const fetchColleges = async (
    page: number = 1,
    limit: number = 10,
    query: string = ""
  ) => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${api_url}search/colleges?page=${page}&limit=${limit}&search=${query}`
      );

      if (!data.success || !Array.isArray(data.data)) {
        throw new Error("Unexpected API response format.");
      }

      setColleges(data.data);
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
      fetchColleges(1, pagination.limit, search);
    }, 500); // debounce delay

    return () => clearTimeout(delayDebounce);
  }, [search]);

  const handleDelete = async (collegeId: string) => {
    if (!window.confirm("Are you sure you want to delete this college?")) return;

    try {
      await axios.delete(`${api_url}college/${collegeId}`);
      toast.success("College deleted successfully!");
      fetchColleges(pagination.page, pagination.limit, search);
    } catch (err) {
      console.error("Error deleting college:", err);
      toast.error("Error deleting college. Please try again.");
    }
  };

  const goToPage = (page: number) => {
    fetchColleges(page, pagination.limit, search);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Colleges List</h1>

 {/* Controls */}
<div className="mb-6">
  {/* Buttons container: Add College left, ImportColleges right */}
  <div className="flex justify-between items-center mb-2 max-w-[80px]xl">
    <button
      onClick={() => router.push("/admin/manageColleges/new")}
      className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
    >
      <PlusCircleIcon className="w-5 h-5 mr-2" />
      Add College
    </button>
    <ImportColleges />
  </div>

  {/* Search bar below ImportColleges, aligned left under it */}
  <div className="relative w-full max-w-sm ml-auto">
    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
    <input
      type="text"
      placeholder="Search by name..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
    />
  </div>
</div>




      {/* Data Table */}
      {loading && <p className="text-center text-gray-500">Loading colleges...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && (
        <>
          <div className="overflow-x-auto shadow-md rounded bg-white">
            <table className="table-auto w-full text-left border-collapse">
              <thead className="bg-gray-200 text-gray-600">
                <tr>
                  {["Name", "Location", "Rank", "Courses", "Website", "Actions"].map(
                    (header) => (
                      <th key={header} className="px-6 py-3 text-sm font-semibold">
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
                      <td className="px-6 py-3 text-sm text-gray-700">{college.name}</td>
                      <td className="px-6 py-3 text-sm text-gray-700">{college.location}</td>
                      <td className="px-6 py-3 text-sm text-gray-700">
                        {college.rank ? `#${college.rank}` : "N/A"}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-700">
                        {college.courses?.length > 0
                          ? college.courses.join(", ")
                          : "No Courses"}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-700">
                        <a
                          href={college.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
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
                        {/* Uncomment for delete option
                        <button
                          onClick={() => handleDelete(college._id)}
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
                    <td colSpan={6} className="text-center py-4 text-gray-500">
                      No colleges found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination Controls */}
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
              <span>
                Page {pagination.page} of {pagination.pages}
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

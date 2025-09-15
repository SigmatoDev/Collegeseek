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
import ExportCoursesButton from "./exportCourses";

interface Specialization {
  _id: string;
  name: string;
}

interface Course {
  _id: string;
  specialization: Specialization;
  description: string;
  duration: string;
  fees: number;
}

const AdminCourses = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [coursesPerPage, setCoursesPerPage] = useState(10);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const fetchCourses = async (page: number) => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${api_url}/courses?page=${page}&limit=${coursesPerPage}`
      );
      const fetchedCourses = data?.courses || [];
      setCourses(
        fetchedCourses.map((course: any) => ({
          ...course,
          fees:
            typeof course.fees === "object" ? course.fees.amount : course.fees,
          specialization: course.specialization || { _id: "", name: "N/A" },
        }))
      );
      setTotalPages(data?.totalPages || 1);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch courses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isMounted) fetchCourses(currentPage);
  }, [currentPage, isMounted, coursesPerPage]);

  const toggleSelectCourse = (id: string) => {
    setSelectedCourses((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    const filtered = courses.filter(
      (course) =>
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.duration.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.specialization?.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
    const allIds = filtered.map((c) => c._id);
    const isAllSelected = allIds.every((id) => selectedCourses.includes(id));
    if (isAllSelected) {
      setSelectedCourses((prev) => prev.filter((id) => !allIds.includes(id)));
    } else {
      setSelectedCourses((prev) => Array.from(new Set([...prev, ...allIds])));
    }
  };

  const filteredCourses = courses.filter((course) => {
    const term = searchTerm.toLowerCase();
    return (
      course.description.toLowerCase().includes(term) ||
      course.duration.toLowerCase().includes(term) ||
      course.specialization?.name.toLowerCase().includes(term)
    );
  });

  if (!isMounted) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Courses List</h1>
        <button
          onClick={() => router.push("/admin/manageCourses/new")}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          <PlusCircleIcon className="w-5 h-5 mr-2" />
          Add Course
        </button>
      </div>

      {/* Export + Search */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <ExportCoursesButton selectedCourseIds={selectedCourses} />

        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-[440px] border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
      </div>

      {/* Rows Per Page + Entries */}
      <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div className="flex items-center gap-2">
          <span className="text-sm text-black">Rows per page</span>
          <select
            value={coursesPerPage}
            onChange={(e) => {
              setCoursesPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border-[1px] border-black rounded-md px-3 py-2 text-sm"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <span className="text-sm text-black ">Entries</span>
        </div>
      </div>

      {/* Course Table */}
      {loading && (
        <p className="text-center text-gray-500">Loading courses...</p>
      )}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto shadow-md rounded bg-white mt-4">
          <table className="table-auto w-full text-left border-collapse">
            <thead className="bg-gray-200 text-gray-600">
              <tr>
                <th className="px-4 py-3">
                  <input
                    type="checkbox"
                    onChange={toggleSelectAll}
                    checked={
                      filteredCourses.length > 0 &&
                      filteredCourses.every((course) =>
                        selectedCourses.includes(course._id)
                      )
                    }
                  />
                </th>
                <th className="px-6 py-3 text-sm font-semibold">
                  Specialization
                </th>
                <th className="px-6 py-3 text-sm font-semibold">Description</th>
                <th className="px-6 py-3 text-sm font-semibold">Duration</th>
                <th className="px-6 py-3 text-sm font-semibold">Fees</th>
                <th className="px-6 py-3 text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.map((course) => (
                <tr key={course._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedCourses.includes(course._id)}
                      onChange={() => toggleSelectCourse(course._id)}
                    />
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {course.specialization?.name || "N/A"}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700 max-w-[400px] whitespace-pre-wrap">
                    {course.description}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {course.duration}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    ₹{course.fees}
                  </td>
                  <td className="px-6 py-3">
                    <button
                      onClick={() =>
                        router.push(`/admin/manageCourses/${course._id}`)
                      }
                      className="bg-blue-500 text-white px-3 py-1.5 rounded-lg flex items-center space-x-1 hover:bg-blue-600"
                    >
                      <PencilSquareIcon className="h-4 w-4" />
                      <span>Edit</span>
                    </button>
                  </td>
                </tr>
              ))}
              {filteredCourses.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-500">
                    No courses found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
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
      )}
    </div>
  );
};

export default AdminCourses;

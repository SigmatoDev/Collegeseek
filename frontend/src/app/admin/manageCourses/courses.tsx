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
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

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
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const coursesPerPage = 100;
  const router = useRouter();

  const fetchCourses = async (page: number) => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${api_url}/courses?page=${page}&limit=${coursesPerPage}`
      );

      const fetchedCourses = data?.courses || [];

      const processedCourses = fetchedCourses.map((course: any) => ({
        ...course,
        fees: typeof course.fees === "object" ? course.fees.amount : course.fees,
        specialization: course.specialization || { _id: "", name: "N/A" },
      }));

      setCourses(processedCourses);
      setTotalPages(data?.totalPages || 1);
      setError(null);
    } catch (err: any) {
      console.error("Error fetching courses:", err);
      setError(err.response?.data?.message || "Failed to fetch courses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses(currentPage);
  }, [currentPage]);

  const handleDelete = async (courseId: string) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      await axios.delete(`${api_url}/courses/${courseId}`);
      toast.success("Course deleted successfully!");
      fetchCourses(currentPage); // Refresh after deletion
    } catch (err) {
      console.error("Error deleting course:", err);
      toast.error("Failed to delete course.");
    }
  };

  const filteredCourses = courses.filter((course) =>
    course.specialization.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header and Add Button */}
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Courses List</h1>
        <button
          onClick={() => router.push("/admin/manageCourses/new")}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          <PlusCircleIcon className="w-5 h-5 mr-2" />
          Add Course
        </button>
      </header>

      {/* Search Input - Right aligned */}
      <div className="flex justify-end mb-6">
        <div className="relative w-full max-w-sm">
          <input
            type="text"
            placeholder="Search by specialization or description"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Loading and Error States */}
      {loading && <p className="text-center text-gray-500">Loading courses...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Course Table */}
      {!loading && !error && (
        <div className="overflow-x-auto shadow-md rounded bg-white">
          <table className="table-auto w-full text-left border-collapse">
            <thead className="bg-gray-200 text-gray-600">
              <tr>
                {["Specialization", "Description", "Duration", "Fees", "Actions"].map(
                  (header) => (
                    <th key={header} className="px-6 py-3 text-sm font-semibold">
                      {header}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <tr key={course._id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm text-gray-700">
                      {course.specialization?.name || "N/A"}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-700">{course.description}</td>
                    <td className="px-6 py-3 text-sm text-gray-700">{course.duration}</td>
                    <td className="px-6 py-3 text-sm text-gray-700">₹{course.fees}</td>
                    <td className="px-6 py-3 flex space-x-2">
                      <button
                        onClick={() => router.push(`/admin/manageCourses/${course._id}`)}
                        className="bg-blue-500 text-white px-3 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-600 transition"
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                        <span>Edit</span>
                      </button>
                      {/* Uncomment to enable delete
                      <button
                        onClick={() => handleDelete(course._id)}
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
                  <td colSpan={5} className="text-center py-4 text-gray-500">
                    No courses found.
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
            <span className="text-gray-700 text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition ${
                currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
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

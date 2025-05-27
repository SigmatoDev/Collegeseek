"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { api_url } from "@/utils/apiCall"; // Assuming you have the api_url set up
import { toast } from "react-hot-toast";
import { PencilSquareIcon, PlusCircleIcon } from "@heroicons/react/24/outline";

interface Course {
  _id: string;
  name: string;
  code: string;
}

const AdminCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 10; // number of courses per page

  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${api_url}course-list`, {
          params: {
            page: currentPage,
            limit,
          },
        });

        if (!data.success || !Array.isArray(data.data)) {
          console.error("Unexpected API response format:", data);
          setError("Invalid data format received.");
          setCourses([]);
          setTotalPages(1);
          return;
        }

        setCourses(data.data);
        setTotalPages(data.pagination?.totalPages || 1);
        setError(null);
      } catch (err: any) {
        console.error("API Fetch Error:", err);
        setError(err.response?.data?.message || "Failed to load courses.");
        setCourses([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Courses List</h1>
        <button
          onClick={() => router.push("/admin/courseList/new")}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          <PlusCircleIcon className="w-5 h-5 mr-2" />
          Add Course
        </button>
      </header>

      {loading && <p className="text-center text-gray-500">Loading courses...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && (
        <>
          <div className="overflow-x-auto shadow-md rounded bg-white">
            <table className="table-auto w-full text-left border-collapse">
              <thead className="bg-gray-200 text-gray-600">
                <tr>
                  {["Name", "Code", "Actions"].map((header) => (
                    <th key={header} className="px-6 py-3 text-sm font-semibold">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {courses.length > 0 ? (
                  courses.map((course) => (
                    <tr key={course._id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-3 text-sm text-gray-700">{course.name}</td>
                      <td className="px-6 py-3 text-sm text-gray-700">{course.code}</td>
                      <td className="px-6 py-3 flex space-x-2">
                        <button
                          onClick={() => router.push(`/admin/courseList/${course._id}`)}
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
                    <td colSpan={3} className="text-center py-4 text-gray-500">
                      No courses found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center p-4 border-t bg-gray-50">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
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
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition ${
                  currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
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

export default AdminCourses;

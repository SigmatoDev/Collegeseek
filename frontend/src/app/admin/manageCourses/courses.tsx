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
} from "@heroicons/react/24/outline";

interface Course {
  _id: string;
  name: string;
  description: string;
  duration: string;
  fees: number | { amount: number; currency: string }; // Handle object case
}

const AdminCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        console.log("Fetching from:", `${api_url}/courses`);
        const { data } = await axios.get(`${api_url}/courses`);

        if (!Array.isArray(data)) {
          console.error("Unexpected API response format:", data);
          setError("Invalid data format received.");
          return;
        }

        setCourses(
          data.map((course) => ({
            ...course,
            fees:
              typeof course.fees === "object"
                ? course.fees.amount
                : course.fees,
          }))
        );
      } catch (err: any) {
        console.error("API Fetch Error:", err);
        setError(err.response?.data?.message || "Failed to load courses.");
      } finally {
        setLoading(false);
      }
    };

    if (typeof window !== "undefined") {
      fetchCourses();
    }
  }, []);

  const handleDelete = async (courseId: string) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      await axios.delete(`${api_url}/courses/${courseId}`);
      setCourses((prev) => prev.filter((course) => course._id !== courseId));
      toast.success("Course deleted successfully!");
    } catch (err) {
      console.error("Error deleting course:", err);
      toast.error("Error deleting course. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
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

      {loading && <p className="text-center text-gray-500">Loading courses...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto shadow-md rounded bg-white">
          <table className="table-auto w-full text-left border-collapse">
            <thead className="bg-gray-200 text-gray-600">
              <tr>
                {["Name", "Description", "Duration", "Fees", "Actions"].map(
                  (header) => (
                    <th key={header} className="px-6 py-3 text-sm font-semibold">
                      {header}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {courses.length > 0 ? (
                courses.map((course) => (
                  <tr key={course._id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm text-gray-700">
                      {course.name}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-700">
                      {course.description}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-700">
                      {course.duration}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-700">
                      {typeof course.fees === "object"
                        ? `₹ ${course.fees.amount} ${course.fees.currency}`
                        : `₹${course.fees}`}
                    </td>
                    <td className="px-6 py-3 flex space-x-2">
                      <button
                        onClick={() =>
                          router.push(`/admin/manageCourses/${course._id}`)
                        }
                        className="bg-blue-500 text-white px-3 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-600 transition"
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(course._id)}
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
                  <td colSpan={5} className="text-center py-4 text-gray-500">
                    No courses found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminCourses;

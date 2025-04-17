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
import ImportColleges from "./importCollege";

interface College {
  rank: any;
  _id: string;
  name: string;
  location: string;
  ranking?: number;
  courses: string[];
  website: string;
}

const AdminColleges = () => {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        console.log("Fetching from:", `${api_url}colleges`);
        const { data } = await axios.get(`${api_url}colleges`);

        if (!data.success || !Array.isArray(data.data)) {
          console.error("Unexpected API response format:", data);
          setError("Invalid data format received.");
          return;
        }

        setColleges(data.data);
      } catch (err: any) {
        console.error("API Fetch Error:", err);
        if (err.response) {
          console.error("Response Data:", err.response.data);
          console.error("Status Code:", err.response.status);
        }
        setError(err.response?.data?.message || "Failed to load colleges.");
      } finally {
        setLoading(false);
      }
    };

    if (typeof window !== "undefined") {
      fetchColleges();
    }
  }, []);

  const handleDelete = async (collegeId: string) => {
    if (!window.confirm("Are you sure you want to delete this college?"))
      return;

    try {
      await axios.delete(`${api_url}colleges/${collegeId}`);
      setColleges((prev) =>
        prev.filter((college) => college._id !== collegeId)
      );
      toast.success("College deleted successfully!");
    } catch (err) {
      console.error("Error deleting college:", err);
      toast.error("Error deleting college. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800">Colleges List</h1>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <button
          onClick={() => router.push("/admin/manageColleges/new")}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          <PlusCircleIcon className="w-5 h-5 mr-2" />
          Add College
        </button>

        {/* Import Colleges inline */}
        <div className="flex items-center space-x-3">
          <ImportColleges />
        </div>
      </div>

      {loading && (
        <p className="text-center text-gray-500">Loading colleges...</p>
      )}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto shadow-md rounded bg-white">
          <table className="table-auto w-full text-left border-collapse">
            <thead className="bg-gray-200 text-gray-600">
              <tr>
                {[
                  "Name",
                  "Location",
                  "Rank",
                  "Courses",
                  "Website",
                  "Actions",
                ].map((header) => (
                  <th key={header} className="px-6 py-3 text-sm font-semibold">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.isArray(colleges) && colleges.length > 0 ? (
                colleges.map((college) => (
                  <tr key={college._id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm text-gray-700">
                      {college.name}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-700">
                      {college.location}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-700">
                      {college.rank ? `#${college.rank}` : "N/A"}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-700">
                      {college.courses && college.courses.length > 0
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
                      <button
                        onClick={() => handleDelete(college._id)}
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
                  <td colSpan={6} className="text-center py-4 text-gray-500">
                    No colleges found.
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

export default AdminColleges;

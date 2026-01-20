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
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";
import ExportCoursesButton from "./exportCourses";
import ImportCourses from "./importCourses";

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
  college_id?: { _id: string; name: string };
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
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);
  const [showImportPanel, setShowImportPanel] = useState(false);
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
          college_id: course.college_id || null,
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

  const handleDuplicateCourse = async (courseId: string) => {
    try {
      setDuplicatingId(courseId);
      const { data } = await axios.get(`${api_url}/courses/${courseId}`);
      const courseData = data;

      const resolveStream = () => {
        if (!courseData.streams) return undefined;
        if (Array.isArray(courseData.streams)) {
          const first =
            courseData.streams[0]?._id || courseData.streams[0] || null;
          return first || undefined;
        }
        if (typeof courseData.streams === "object") {
          return courseData.streams?._id || undefined;
        }
        return courseData.streams;
      };

      const payload: any = {
        ...courseData,
        name: courseData.name
          ? `${courseData.name} Copy`
          : `${courseData?.specialization?.name || "Course"} Copy`,
        college_id: courseData.college_id?._id || courseData.college_id,
        category: courseData.category?._id || courseData.category,
        programMode: courseData.programMode?._id || courseData.programMode,
        specialization:
          courseData.specialization?._id || courseData.specialization,
        streams: resolveStream(),
      };

      if (!payload.streams) {
        delete payload.streams;
      }
      delete payload._id;
      delete payload.slug;
      delete payload.createdAt;
      delete payload.updatedAt;
      delete payload.created_at;
      delete payload.updated_at;

      const response = await axios.post(`${api_url}/courses`, payload);
      const newCourse = response.data;
      const newCourseId = newCourse?._id || newCourse?.course?._id;
      toast.success("Course duplicated. You can edit it now.");
      if (newCourseId) {
        router.push(`/admin/manageCourses/${newCourseId}`);
      } else {
        fetchCourses(currentPage);
      }
    } catch (err: any) {
      console.error("Error duplicating course:", err);
      toast.error(
        err.response?.data?.message || "Failed to duplicate the course."
      );
    } finally {
      setDuplicatingId(null);
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

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm("Are you sure you want to delete this course?")) return;

    try {
      await axios.delete(`${api_url}/courses/${courseId}`);
      toast.success("Course deleted successfully.");
      // Refresh the list
      fetchCourses(currentPage);
      // Also remove from selectedCourses if it was selected
      setSelectedCourses((prev) => prev.filter((id) => id !== courseId));
    } catch (err: any) {
      console.error("Error deleting course:", err);
      toast.error(err.response?.data?.message || "Failed to delete course.");
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
    <div className="mx-auto max-w-[1400px] px-4 py-4">
      <div className="mb-3 flex flex-col gap-3 border-b border-slate-100 pb-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="text-3xl font-bold text-gray-900">Courses List</div>
        <div className="flex flex-1 items-center justify-center">
          <div className="relative w-full max-w-xl">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-200 pl-10 pr-4 py-2 text-sm focus:border-blue-400 focus:outline-none focus:ring"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowImportPanel((prev) => !prev)}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:border-slate-400"
          >
            {showImportPanel ? "Hide Import" : "Import"}
          </button>
          <ExportCoursesButton selectedCourseIds={selectedCourses} />
          <button
            onClick={() => router.push("/admin/manageCourses/new")}
            className="flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            <PlusCircleIcon className="mr-2 h-5 w-5" />
            Add Course
          </button>
        </div>
      </div>
      {showImportPanel && (
        <div className="mb-4 rounded-2xl border border-dashed border-slate-200 bg-white p-4 shadow-sm">
          <ImportCourses />
        </div>
      )}
      <div className="flex items-center justify-end gap-2 text-sm text-slate-600 pb-3">
        <span>Rows per page</span>
        <select
          value={coursesPerPage}
          onChange={(e) => {
            setCoursesPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="rounded-md border border-gray-300 px-3 py-1"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm">
        {loading && (
          <p className="text-center text-gray-500">Loading courses...</p>
        )}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!loading && !error && (
          <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
            <div className="max-h-[70vh] overflow-auto">
              <table className="w-full table-auto text-left text-sm">
                <thead className="bg-gray-100 text-gray-600">
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
                    <th className="px-6 py-3 font-semibold">Specialization</th>
                    <th className="px-6 py-3 font-semibold">Duration</th>
                    <th className="px-6 py-3 font-semibold">Fees</th>
                    <th className="px-6 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCourses.map((course) => (
                    <tr
                      key={course._id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedCourses.includes(course._id)}
                          onChange={() => toggleSelectCourse(course._id)}
                        />
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-700">
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {course.specialization?.name || "N/A"}
                          </span>
                          {course.college_id?.name && (
                            <span className="text-xs text-gray-500">
                              {course.college_id.name}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-700">
                        {course.duration}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-700">
                        ₹{course.fees}
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              router.push(`/admin/manageCourses/${course._id}`)
                            }
                            className="rounded-lg bg-blue-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteCourse(course._id)}
                            className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-600"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => handleDuplicateCourse(course._id)}
                            disabled={duplicatingId === course._id}
                            className={`rounded-lg p-1.5 text-purple-600 hover:bg-purple-50 ${
                              duplicatingId === course._id
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            title="Duplicate course"
                          >
                            <DocumentDuplicateIcon className="h-4 w-4" />
                            <span className="sr-only">Duplicate</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredCourses.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-6 text-center text-gray-500"
                      >
                        No courses found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-3 border-t bg-gray-50 px-4 py-3 text-sm text-gray-700 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2">
                Page {currentPage} of {totalPages}
                <span className="text-xs uppercase text-gray-500">Go to</span>
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
                  className="w-16 rounded border border-gray-300 px-2 py-1 text-center text-sm"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className={`rounded bg-gray-200 px-4 py-2 hover:bg-gray-300 ${
                    currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className={`rounded bg-gray-200 px-4 py-2 hover:bg-gray-300 ${
                    currentPage === totalPages
                      ? "cursor-not-allowed opacity-50"
                      : ""
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCourses;

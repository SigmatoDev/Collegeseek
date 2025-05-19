"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { img_url } from "@/utils/apiCall";
import { useRouter } from "next/navigation";

interface Course {
  _id: string;
  specialization?: { name: string }; // Add this if available
  description: string;
  college_id: { name: string; slug: string; rank: number; image?: string };
  fees: { amount: number; currency: string };
  eligibility: string;
  category: { name: string };
  programMode: { name: string };
  duration: string;
  enrollmentLink: string;
}

interface CourseDetailProps {
  courses: Course[];
  filters: any; // You can replace `any` with a proper type if needed
  totalPages: number;
  currentPage: number;
  onPageChange?: (page: number) => void; // Optional callback to fetch data from parent
}

const CourseDetail: React.FC<CourseDetailProps> = ({
  courses,
  filters,
  totalPages,
  currentPage,
  onPageChange,
}) => {
  const [page, setPage] = useState(currentPage);
  const router = useRouter();

  useEffect(() => {
    setPage(currentPage); // sync with prop changes
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
    if (onPageChange) {
      onPageChange(newPage);
    }
  };

  const getValidImageUrl = (image?: string) => {
    if (!image) return "/image/default-college.jpg";
    try {
      return new URL(image).href;
    } catch {
      return `${img_url}uploads/${image.replace(/^\/?uploads\//, "")}`;
    }
  };

  const collegeDetails = (course: Course) => {
    router.push(`/colleges/${course.college_id?.slug}`);
  };

  return (
    <div className="max-w-screen-3xl px-10 mx-auto mb-[110px] flex flex-col lg:flex-row gap-8">
      <main className="w-full overflow-x-auto">
        <div className="rounded-3xl shadow-2xl border border-gray-200 bg-white overflow-hidden">
          {courses.length === 0 ? (
            <div className="p-4 text-center text-lg text-gray-700">
              No courses found for this selection.
            </div>
          ) : (
            <table className="min-w-full table-auto text-sm">
              <thead className="bg-gray-100 sticky top-0 z-10 text-gray-700 text-xs uppercase tracking-wide font-semibold">
                <tr>
                  <th className="px-6 py-5 text-left border-b border-gray-300">NIRF</th>
                  <th className="px-6 py-5 text-left border-b border-gray-300 w-[120px]">Image</th>
                  <th className="px-6 py-5 text-left border-b border-gray-300">College & Details</th>
                  <th className="px-6 py-5 text-left border-b border-gray-300">Eligibility</th>
                  <th className="px-6 py-5 text-left border-b border-gray-300">Fees</th>
                  <th className="px-6 py-5 text-left border-b border-gray-300">Enroll</th>
                </tr>
              </thead>
              <tbody className="text-gray-800">
                {courses.map((course, index) => (
                  <tr
                    key={course._id}
                    className={`transition-all duration-300 ease-in-out ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-blue-50`}
                  >
                    <td className="px-6 py-5 border-b border-gray-200 text-center font-semibold text-sm text-gray-600">
                      {course.college_id?.rank ?? "-"}
                    </td>
                    <td className="px-6 py-5 border-b border-gray-200 text-center">
                      <Image
                        src={getValidImageUrl(course.college_id?.image)}
                        alt={course.college_id?.name || "College Image"}
                        width={70}
                        height={70}
                        className="w-[80px] h-[70px] mx-auto rounded-full object-cover"
                      />
                    </td>
                    <td className="px-6 py-5 border-b border-gray-200">
                      <div
                        onClick={() => collegeDetails(course)}
                        className="font-bold text-sm cursor-pointer hover:text-blue-700"
                      >
                        {course.college_id?.name}
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-medium px-3 py-1 rounded-full shadow-sm">
                          {course.category?.name}
                        </span>
                        <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-medium px-3 py-1 rounded-full shadow-sm">
                          Duration: {course.duration}
                        </span>
                        <span className="inline-block bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full shadow-sm">
                          {course.programMode?.name || "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 border-b border-gray-200 whitespace-nowrap">
                      {course.eligibility}
                    </td>
                    <td className="px-6 py-5 border-b border-gray-200 text-green-700 font-semibold whitespace-nowrap">
                      ₹ {course.fees?.amount || 0} {course.fees?.currency || "INR"}
                    </td>
                    <td className="px-6 py-5 border-b border-gray-200">
                      <a
                        href={course.enrollmentLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block w-full text-center bg-blue-600 hover:bg-blue-700 transition-colors duration-200 text-white text-sm font-semibold px-6 py-3 rounded-xl shadow-lg"
                      >
                        Enroll Now
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4 mt-6 p-4">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1}
                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
              >
                Prev
              </button>
              <span className="text-lg font-semibold">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= totalPages}
                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CourseDetail;

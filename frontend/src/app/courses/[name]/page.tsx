"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api_url } from "@/utils/apiCall";
import Header from "@/components/header/page";
import Footer from "@/components/footer/page";
import CoursesFilterSidebar from "@/components/coursesFilterbar/page";
import Image from "next/image";
import Breadcrumb from "@/components/breadcrumb/breadcrumb";

interface Course {
  _id: string;
  name: string;
  description: string;
  college_id: { name: string; rank: number };
  fees: { amount: number; currency: string };
  eligibility: string;
  category: { name: string };
  duration: string;
  mode: string;
  enrollmentLink: string;
}

const CourseDetail = () => {
  const params = useParams();
  const name = decodeURIComponent(params?.name as string);

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [appliedFilters, setAppliedFilters] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handleFilterChange = (newFilters: string[]) => {
    setAppliedFilters(newFilters);
  };

  const fetchCourses = async (page: number) => {
    try {
      const res = await fetch(
        `${api_url}courses/all/get/with/same/name?name=${encodeURIComponent(name)}&page=${page}&limit=10`
      );
      if (!res.ok) {
        throw new Error("Failed to fetch courses");
      }
      const data = await res.json();
      setCourses(data.courses);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchCourses(page);
  };

  useEffect(() => {
    if (name) fetchCourses(currentPage);
  }, [name, currentPage]);

  if (loading) return <p className="text-center text-lg">Loading courses...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (courses.length === 0) return <p className="text-center">No courses found.</p>;

  return (
    <>
      <Header />
       {/* 🧩 Breadcrumb Section */}
       <div className="py-3 px-6 ml-4 rounded-md mt-3">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Courses", href: "/courses" },
            { label: name, href: `/course/${encodeURIComponent(name)}` },
          ]}
        />
      </div>

      {/* Hero Section */}
      <div
        className="relative bg-cover bg-center bg-no-repeat py-32 px-6 mb-20 shadow-lg"
        style={{ backgroundImage: "url('/image/14.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent" />
        <div className="relative z-10 flex flex-col items-center text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
            <span className="inline-block px-6 py-4 bg-white/10 backdrop-blur-md rounded-2xl shadow-lg">
              Courses: {name}
            </span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 font-medium mb-8">
            Explore top colleges, fees, and eligibility for your selected course
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div id="courses-section" className="max-w-screen-2xl mx-auto px-4 mb-[110px] md:px-8 flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full lg:w-1/4 sticky top-20">
          <CoursesFilterSidebar onFilterChange={handleFilterChange} />
        </aside>

        {/* Course Table */}
        <main className="w-full lg:w-3/4 overflow-x-auto">
          <div className="rounded-3xl shadow-2xl border border-gray-200 bg-white overflow-hidden">
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
                  <React.Fragment key={course._id}>
                    <tr
                      className={`transition-all duration-300 ease-in-out ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-blue-50`}
                    >
                      <td className="px-6 py-5 border-b border-gray-200 text-center font-semibold text-sm text-gray-600">
                        {course.college_id?.rank || "-"}
                      </td>

                      <td className="px-6 py-5 border-b border-gray-200 text-center">
                        <Image
                          src="/image/14.jpg"
                          alt={course.college_id?.name || "College Image"}
                          width={70}
                          height={70}
                          className="w-[80px] h-[70px] mx-auto rounded-full"
                        />
                      </td>

                      <td className="px-6 py-5 border-b border-gray-200">
                        <div className="font-bold text-sm">
                          {course.college_id?.name}
                        </div>
                        <div className="mt-1flex flex-col items-start text-sm font-medium mt-3">
                          <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-medium px-3 py-1 rounded-full shadow-sm">
                            {course.category?.name}
                          </span>
                          <span className="inline-block ml-3 bg-indigo-100 text-indigo-700 text-xs font-medium px-3 py-1 rounded-full shadow-sm">
                            Duration: {course.duration}
                          </span>
                        </div>

                        <div className="flex flex-col items-start text-sm font-medium mt-3">
                          <span className="inline-block bg-yellow-100 text-yellow-700 text-xs font-medium px-3 py-1 rounded-full shadow-sm">
                            {course.mode}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-5 border-b border-gray-200 whitespace-nowrap">
                        {course.eligibility}
                      </td>

                      <td className="px-6 py-5 border-b border-gray-200 text-green-700 font-semibold whitespace-nowrap">
                        ₹{course.fees.amount.toLocaleString()} {course.fees.currency}
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
                  </React.Fragment>
                ))}
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
        </main>
      </div>

      <Footer />
    </>
  );
};

export default CourseDetail;

"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Footer from "@/components/footer/page";
import Header from "@/components/header/page";
import FilterSidebar from "./FilterSidebar";
import Breadcrumb from "@/components/breadcrumb/breadcrumb";
import { api_url } from "@/utils/apiCall";
import CourseDetail from "./courseList";

const CoursesFilterPage = () => {
  const [filters, setFilters] = useState<any>({});
  const [courses, setCourses] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0); // New state for total pages
  const [currentPage, setCurrentPage] = useState<number>(1); // New state for current page
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const params = useParams();
  const name = decodeURIComponent((params?.name as string) || "");

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters: any) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to the first page whenever filters change
  }, []);

  // Fetch courses based on filters and name
  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null); // Reset error state on each fetch attempt

      // Build query parameters for the request
      const queryParams = new URLSearchParams({ name, page: String(currentPage) });

      // If filters are applied, append them to the queryParams
      if (filters?.duration && filters?.duration.length > 0) {
        filters.duration.forEach((d: string) =>
          queryParams.append("duration", d)
        );
      }
      if (filters?.mode && filters?.mode.length > 0) {
        filters.mode.forEach((m: string) => queryParams.append("mode", m));
      }

      // Make the API call
      const res = await fetch(
        `${api_url}courses/all/get/with/same/name?${queryParams.toString()}`
      );
      if (!res.ok) {
        throw new Error("Failed to fetch courses");
      }

      const data = await res.json();
      setCourses(data.courses);
      setTotalPages(data.totalPages); // Set the total pages from the API response
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [filters, name, currentPage]); // Re-fetch when filters, name, or currentPage change

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]); // Trigger fetchCourses when the function is updated

  return (
    <>
      <Header />

      {/* Breadcrumb Section */}
      <div className="px-10 pt-6">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Courses", href: "/courses" },
            { label: name, href: `/course/${encodeURIComponent(name)}` },
          ]}
        />
      </div>

      {/* Background Section (Optional)
      <div
        className="relative bg-cover bg-center bg-no-repeat py-32 px-6 mb-20 shadow-lg"
        style={{ backgroundImage: "url('/image/14.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent" />
        <div className="relative z-10 flex flex-col items-center text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
            Explore Courses
          </h1>
          <span className="inline-block px-6 py-4 bg-white/10 backdrop-blur-md rounded-2xl shadow-lg">
            Courses: {name}
          </span>
          <p className="text-lg md:text-xl text-white/90 font-medium mb-8">
            Explore top colleges, fees, and eligibility for your selected course
          </p>
        </div>
      </div> */}

      {/* Main Content Section */}
      <div className="flex mx-auto px-10 py-5 justify-center gap-6">
        {/* Filter Sidebar */}
        <div>
          <FilterSidebar onFilterChange={handleFilterChange} courseName={name} />
        </div>

        {/* Course List */}
        <div className="flex-1">
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : error ? (
            <div className="text-red-500 text-center">{error}</div>
          ) : (
            <CourseDetail
              courses={courses}
              filters={filters}
              totalPages={totalPages} // Pass totalPages to CourseDetail
              currentPage={currentPage} // Pass currentPage to CourseDetail
            />
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default CoursesFilterPage;

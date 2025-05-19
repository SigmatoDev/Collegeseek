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
  const [totalPages, setTotalPages] = useState<number>(0); // Total number of pages from the backend response
  const [currentPage, setCurrentPage] = useState<number>(1); // Current page state
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
const params = useParams();
const specialization = decodeURIComponent((params?.specialization as string) || "");
  console.log("Received filters parent course page:", filters);
  // Handle filter changes
  const handleFilterChange = useCallback((newFilters: any) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to the first page whenever filters change
  }, []);
  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const queryParams = new URLSearchParams({
  specialization,  // changed from name
  page: String(currentPage),
});
      if (filters?.duration?.length > 0) {
        filters.duration.forEach((d: string) =>
          queryParams.append("duration", d)
        );
      }
      if (filters?.mode?.length > 0) {
        filters.mode.forEach((m: string) => queryParams.append("mode", m));
      }
      if (filters?.programMode?.length > 0) {
        filters.programMode.forEach((pm: string) =>
          queryParams.append("programMode", pm)
        );
      }
      if (filters?.colleges?.length > 0) {
        filters.colleges.forEach((id: string) =>
          queryParams.append("colleges", id)
        );
      }
      if (filters?.feeLevels?.length > 0) {
        filters.feeLevels.forEach((json: string) =>
          queryParams.append("feeLevels", json)
        );
      }
      if (filters?.ratingLevels?.length > 0) {
        filters.ratingLevels.forEach((json: string) =>
          queryParams.append("ratingLevels", json)
        );
      }
      const res = await fetch(
        `${api_url}/courses/all/get/by/specialization?${queryParams.toString()}`
      );
      if (res.status === 404) {
        // No data found – treat as empty result, not error
        setCourses([]);
        setTotalPages(0);
        return;
      }
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
  }, [filters, name, currentPage]);
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
    { label: specialization, href: `/courses/${encodeURIComponent(specialization)}` },
  ]}
/>
      </div>
      {/* Main Content Section */}
      <div className="flex mx-auto px-10 py-5 justify-center gap-6">
        {/* Filter Sidebar */}
        <div>
          {/* <FilterSidebar
            onFilterChange={handleFilterChange}
            courseName={specialization}
          /> */}
        </div>
        {/* Course List */}
        <div className="flex-1">
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : error ? (
            <div className="text-red-500 text-center">{error}</div>
          ) : courses.length === 0 ? (
            <div className="text-center text-gray-500">
              No courses found for your filters.
            </div>
          ) : (
            <CourseDetail
              courses={courses}
              filters={filters}
              totalPages={totalPages}
              currentPage={currentPage}
            />
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};
export default CoursesFilterPage;
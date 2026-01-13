"use client";

import React, { useEffect, useMemo, useState } from "react";
import CourseCard from "../coursesCard/coursesCard";
import { api_url } from "@/utils/apiCall";

interface Course {
  _id: string;
  name: string;
  title?: string;
  description: string;
  specialization:
    | string
    | {
        _id: string;
        name: string;
      };
  instructor?: string;
  duration?: string;
  durationRange?: string;
  mode?: string;
  slug: string;
  image?: string;
  fees?: { amount: number; currency: string; year: number };
  feesRange?: string;
  category?: { _id: string; name: string };
  programMode?: { _id: string; name: string } | string;
  streams?: { _id: string; name: string }[];
  eligibility?: string;
  entrance_exam?: string;
  focusAreas?: string[];
  examList?: string[];
  collegeCount?: number;
  college_id?: { _id: string; name: string };
}

export interface CourseListFilters {
  streams?: string[];
  feeRanges?: { min?: number; max?: number }[];
  courseTypes?: string[];
  durations?: { min?: number; max?: number }[];
}

interface CoursesListProps {
  filters?: CourseListFilters;
  searchTerm?: string;
}

const CourseCardSkeleton = () => (
  <div className="animate-pulse rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
    <div className="mb-4 h-6 w-2/3 rounded bg-slate-200" />
    <div className="mb-3 h-4 w-full rounded bg-slate-100" />
    <div className="mb-6 h-4 w-5/6 rounded bg-slate-100" />
    <div className="flex flex-wrap gap-3">
      <div className="h-8 w-28 rounded-full bg-slate-100" />
      <div className="h-8 w-28 rounded-full bg-slate-100" />
      <div className="h-8 w-28 rounded-full bg-slate-100" />
    </div>
  </div>
);

const CoursesList: React.FC<CoursesListProps> = ({ filters, searchTerm }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 10;

  const activeFiltersPayload = useMemo(() => {
    const payload: { field: string; value: any }[] = [];

    if (filters?.streams?.length) {
      payload.push({ field: "streams", value: filters.streams });
    }
    if (filters?.feeRanges?.length) {
      payload.push({ field: "avgFee", value: filters.feeRanges });
    }
    if (filters?.courseTypes?.length) {
      payload.push({ field: "courseType", value: filters.courseTypes });
    }
    if (filters?.durations?.length) {
      payload.push({ field: "duration", value: filters.durations });
    }

    return payload;
  }, [filters]);

  const filtersKey = useMemo(
    () => JSON.stringify(activeFiltersPayload),
    [activeFiltersPayload]
  );

  const normalizedSearch = useMemo(
    () => searchTerm?.trim().toLowerCase() || "",
    [searchTerm]
  );

 const fetchCourses = async (
  pageNumber: number,
  filterPayload: { field: string; value: unknown }[]
) => {
  setLoading(true);
  setError(null);

  // 🔍 Log request info
  console.log("📤 Fetching courses");
  console.log("➡️ Page:", pageNumber);
  console.log("➡️ Limit:", limit);
  console.log("➡️ Filters Payload:", filterPayload);

  try {
    const url = `${api_url}courses/filter/by/specializationpage?page=${pageNumber}&limit=${limit}`;
    console.log("🌐 API URL:", url);

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filters: filterPayload }),
    });

    console.log("📥 Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ API error response:", errorText);
      throw new Error(`Failed to fetch courses: ${response.status}`);
    }

    const data = await response.json();

    // ✅ Log response data
    console.log("✅ API Response:", data);
    console.log("📚 Courses count:", data?.courses?.length || 0);
    console.log("📄 Total pages:", data?.totalPages);

    setCourses(data.courses || []);
    setTotalPages(data.totalPages || 1);
  } catch (err) {
    console.error("🔥 Fetch courses error:", err);
    setError(err instanceof Error ? err.message : "An error occurred");
  } finally {
    setLoading(false);
    console.log("⏹ Fetch completed");
  }
};


  useEffect(() => {
    setPage(1);
  }, [filtersKey, normalizedSearch]);

  useEffect(() => {
    fetchCourses(page, activeFiltersPayload);
  }, [page, filtersKey, activeFiltersPayload]);

  const handlePageChange = (nextPage: number) => {
    if (nextPage === page || nextPage < 1 || nextPage > totalPages) return;
    setPage(nextPage);
  };

  const visibleCourses = useMemo(() => {
    if (!normalizedSearch) return courses;
    return courses.filter((course) => {
      const title =
        (typeof course.specialization === "object"
          ? course.specialization?.name
          : course.specialization) || course.name;
      const description = course.description || "";
      const combined = `${title} ${description}`.toLowerCase();
      return combined.includes(normalizedSearch);
    });
  }, [courses, normalizedSearch]);

  return (
    <div className="w-full rounded-3xl border border-transparent bg-[#f6f6f6cf] p-4 shadow-sm">
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <CourseCardSkeleton key={`skeleton-${index}`} />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      ) : visibleCourses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center text-slate-500">
          No courses match the current filters{normalizedSearch ? " or search" : ""}.
        </div>
      ) : (
        <div className="space-y-4">
          {visibleCourses.map((course) => {
            const specializationName =
              typeof course.specialization === "object"
                ? course.specialization?.name
                : course.specialization;

            const modeLabel =
              typeof course.programMode === "object"
                ? course.programMode?.name
                : course.programMode || course.mode;

            return (
              <CourseCard
                key={course._id}
                title={specializationName || course.name}
                description={course.description}
                slug={course.slug}
                durationLabel={course.durationRange || course.duration || "N/A"}
                degreeLabel={course.category?.name}
                modeLabel={modeLabel}
                eligibility={course.eligibility}
                entranceExam={course.entrance_exam}
                examList={course.examList}
                streams={course.streams || []}
                focusAreas={course.focusAreas}
                image={course.image || "/image/14.jpg"}
                collegeCount={course.collegeCount}
                collegeName={course.college_id?.name}
              />
            );
          })}
        </div>
      )}

      {totalPages > 1 && !loading && visibleCourses.length > 0 && (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          <button
            className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-600 disabled:opacity-40"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, index) => {
            const pageNumber = index + 1;
            const isActive = page === pageNumber;
            return (
              <button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                className={`rounded-full px-4 py-1 text-sm font-medium transition ${
                  isActive
                    ? "bg-[#635dc1] text-white shadow"
                    : "border border-slate-200 bg-white text-slate-700"
                }`}
              >
                {pageNumber}
              </button>
            );
          })}
          <button
            className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-600 disabled:opacity-40"
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default CoursesList;

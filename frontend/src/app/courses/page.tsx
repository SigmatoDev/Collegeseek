"use client";

import Footer from "@/components/footer/page";
import Header from "@/components/header/page";
import CoursesList, {
  CourseListFilters,
} from "@/components/courses/courseslist/coursesList";
import Breadcrumb from "@/components/breadcrumb/breadcrumb"; // 🧩 Import Breadcrumb
import { useMemo, useState } from "react";
import CallbackForm from "@/components/newsletters/page";
import CourseFiltersSidebar from "@/components/courses/courseFilter/CourseFiltersSidebar";
import {
  feeRangeOptions,
  durationRangeOptions,
} from "@/components/courses/courseFilter/filterOptions";

const CollegesPage = () => {
  const [selectedStreams, setSelectedStreams] = useState<string[]>([]);
  const [selectedFeeRanges, setSelectedFeeRanges] = useState<string[]>([]);
  const [selectedCourseTypes, setSelectedCourseTypes] = useState<string[]>([]);
  const [selectedDurations, setSelectedDurations] = useState<string[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const buildRangePayload = (selectedIds: string[], source: typeof feeRangeOptions) =>
    selectedIds
      .map((id) => source.find((option) => option.id === id))
      .filter((option): option is (typeof source)[number] => Boolean(option))
      .map((option) => {
        const payload: { min?: number; max?: number } = {};
        if (typeof option.min === "number") payload.min = option.min;
        if (typeof option.max === "number") payload.max = option.max;
        return payload;
      });

  const filtersPayload: CourseListFilters = useMemo(
    () => ({
      streams: selectedStreams,
      feeRanges: buildRangePayload(selectedFeeRanges, feeRangeOptions),
      courseTypes: selectedCourseTypes,
      durations: buildRangePayload(selectedDurations, durationRangeOptions),
    }),
    [selectedStreams, selectedFeeRanges, selectedCourseTypes, selectedDurations]
  );

  const activeFiltersCount =
    filtersPayload.streams?.length || 0 +
    (filtersPayload.courseTypes?.length ?? 0) +
    (filtersPayload.feeRanges?.length || 0) +
    (filtersPayload.durations?.length || 0);

  const clearAllFilters = () => {
    setSelectedStreams([]);
    setSelectedFeeRanges([]);
    setSelectedCourseTypes([]);
    setSelectedDurations([]);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(searchInput.trim());
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearchTerm("");
  };

  return (
    <>
      <Header />

      {/* 🧩 Breadcrumb Section */}
      <div className="px-4 pt-3 pb-2 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Courses", href: "/courses" },
          ]}
        />
      </div>

      <div className="px-3 py-4 sm:px-4 lg:px-6">
        <div className="flex flex-col gap-6 xl:flex-row">
          <div className="w-full xl:w-[260px] xl:shrink-0">
            <CourseFiltersSidebar
              selectedStreams={selectedStreams}
              onStreamsChange={setSelectedStreams}
              selectedFeeRanges={selectedFeeRanges}
              onFeeRangeChange={setSelectedFeeRanges}
              selectedCourseTypes={selectedCourseTypes}
              onCourseTypeChange={setSelectedCourseTypes}
              selectedDurations={selectedDurations}
              onDurationChange={setSelectedDurations}
              onClearFilters={clearAllFilters}
            />
          </div>

          <div className="flex-1 space-y-4">
            <form
              onSubmit={handleSearchSubmit}
              className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white/95 p-4 shadow-sm lg:flex-row lg:items-center bg-[radial-gradient(circle_at_top,_rgba(99,93,193,0.08),_transparent_50%),radial-gradient(circle_at_bottom,_rgba(207,94,68,0.08),_transparent_55%)]"
            >
              <div className="flex-1">
                <label className="block text-sm font-semibold text-slate-600">
                  Search courses by name or specialization
                </label>
                <div className="mt-2 flex items-center gap-3 rounded-2xl border-2 border-[#f37d5a]/60 bg-white px-4 py-3 shadow-inner">
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="e.g. MBA in Finance, B.Tech Computer Science..."
                    className="w-full border-none text-base text-slate-800 placeholder:text-slate-400 focus:outline-none"
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                    >
                      Clear
                    </button>
                  )}
                  <button
                    type="submit"
                    className="rounded-full bg-[#38337E] px-5 py-2 text-sm font-semibold text-white shadow hover:bg-[#2e2a63]"
                  >
                    Search
                  </button>
                </div>
                {searchTerm && (
                  <p className="mt-1 text-xs text-slate-500">
                    Showing results for: <span className="font-semibold">{searchTerm}</span>
                  </p>
                )}
              </div>
            </form>
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap items-center justify-between rounded-2xl border border-dashed border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-600">
                <p>
                  {activeFiltersCount} filter
                  {activeFiltersCount > 1 ? "s" : ""} applied
                </p>
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="text-xs font-semibold text-[#635dc1] underline-offset-4 hover:underline"
                >
                  Reset
                </button>
              </div>
            )}
            <CoursesList filters={filtersPayload} searchTerm={searchTerm} />
          </div>
        </div>
      </div>
      <CallbackForm />

      <Footer />
    </>
  );
};

export default CollegesPage;

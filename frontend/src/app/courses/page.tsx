// "use client";

// import { useEffect, useMemo, useState } from "react";
// import Footer from "@/components/footer/page";
// import Header from "@/components/header/page";
// import CoursesList, {
//   CourseListFilters,
// } from "@/components/courses/courseslist/coursesList";
// import Breadcrumb from "@/components/breadcrumb/breadcrumb";
// import CallbackForm from "@/components/newsletters/page";
// import CourseFiltersSidebar from "@/components/courses/courseFilter/CourseFiltersSidebar";
// import {
//   feeRangeOptions,
//   durationRangeOptions,
// } from "@/components/courses/courseFilter/filterOptions";

// const CollegesPage = () => {
//   // States
//   const [selectedStreams, setSelectedStreams] = useState<string[]>([]);
//   const [selectedFeeRanges, setSelectedFeeRanges] = useState<string[]>([]);
//   const [selectedCourseTypes, setSelectedCourseTypes] = useState<string[]>([]);
//   const [selectedDurations, setSelectedDurations] = useState<string[]>([]);
//    // ✅ NEW
//   const [selectedStates, setSelectedStates] = useState<string[]>([]);
//   const [selectedCities, setSelectedCities] = useState<string[]>([]);
//   const [searchInput, setSearchInput] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [mounted, setMounted] = useState(false); // hydration-safe flag

//   // Mark component as mounted
//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   // Build range payload for fee/duration filters
//   const buildRangePayload = (
//     selectedIds: string[],
//     source: typeof feeRangeOptions
//   ) =>
//     selectedIds
//       .map((id) => source.find((option) => option.id === id))
//       .filter((option): option is (typeof source)[number] => Boolean(option))
//       .map((option) => {
//         const payload: { min?: number; max?: number } = {};
//         if (typeof option.min === "number") payload.min = option.min;
//         if (typeof option.max === "number") payload.max = option.max;
//         return payload;
//       });

//   // Memoized filters payload
//   const filtersPayload: CourseListFilters = useMemo(
//     () => ({
//       streams: selectedStreams,
//       feeRanges: buildRangePayload(selectedFeeRanges, feeRangeOptions),
//       courseTypes: selectedCourseTypes,
//       durations: buildRangePayload(selectedDurations, durationRangeOptions),
//         // ✅ NEW
//       states: selectedStates,
//       cities: selectedCities,
//     }),
//     [selectedStreams, selectedFeeRanges, selectedCourseTypes, selectedDurations, selectedStates,
//       selectedCities,]
    
//   );

//   // Count active filters (hydration-safe)
//   const activeFiltersCount =
//     (filtersPayload.streams?.length ?? 0) +
//     (filtersPayload.courseTypes?.length ?? 0) +
//     (filtersPayload.feeRanges?.length ?? 0) +
//     (filtersPayload.durations?.length ?? 0) +
//      (filtersPayload.states?.length ?? 0) +
//     (filtersPayload.cities?.length ?? 0);

//   // Clear all filters
//   const clearAllFilters = () => {
//     setSelectedStreams([]);
//     setSelectedFeeRanges([]);
//     setSelectedCourseTypes([]);
//     setSelectedDurations([]);
//     setSelectedStates([]);
//     setSelectedCities([]);
//   };

//   // Search form handlers
//   const handleSearchSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     setSearchTerm(searchInput.trim());
//   };

//   const handleClearSearch = () => {
//     setSearchInput("");
//     setSearchTerm("");
//   };

//   return (
//     <>
//       <Header />

//       {/* Breadcrumb Section */}
//       <div className="px-4 pt-3 pb-2 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
//         <Breadcrumb
//           items={[
//             { label: "Home", href: "/" },
//             { label: "Courses", href: "/courses" },
//           ]}
//         />
//       </div>

//       <div className="px-3 py-4 sm:px-4 lg:px-6">
//         <div className="flex flex-col gap-6 xl:flex-row">
//           {/* Sidebar Filters */}
//           <div className="w-full xl:w-[260px] xl:shrink-0">
//             <CourseFiltersSidebar
//               selectedStreams={selectedStreams}
//               onStreamsChange={setSelectedStreams}
//               selectedFeeRanges={selectedFeeRanges}
//               onFeeRangeChange={setSelectedFeeRanges}
//               selectedCourseTypes={selectedCourseTypes}
//               onCourseTypeChange={setSelectedCourseTypes}
//               selectedDurations={selectedDurations}
//               onDurationChange={setSelectedDurations}
//               selectedStates={selectedStates}
//               onStatesChange={setSelectedStates}
//               selectedCities={selectedCities}
//               onCitiesChange={setSelectedCities}
//               onClearFilters={clearAllFilters}
//             />
//           </div>

//           {/* Main Content */}
//           <div className="flex-1 space-y-4">
//             {/* Search Form */}
//             <form
//               onSubmit={handleSearchSubmit}
//               className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white/95 p-4 shadow-sm lg:flex-row lg:items-center search-form-bg"
//             >
//               <div className="flex-1">
//                 <label className="block text-sm font-semibold text-slate-600">
//                   Search courses by name or specialization
//                 </label>
//                 <div className="mt-2 flex items-center gap-3 rounded-2xl border-2 border-[#f37d5a]/60 bg-white px-4 py-3 shadow-inner">
//                   {mounted && (
//                     <input
//                       type="text"
//                       value={searchInput}
//                       onChange={(e) => setSearchInput(e.target.value)}
//                       placeholder="e.g. MBA in Finance, B.Tech Computer Science..."
//                       className="w-full border-none text-base text-slate-800 placeholder:text-slate-400 focus:outline-none"
//                     />
//                   )}

//                   {mounted && searchTerm && (
//                     <button
//                       type="button"
//                       onClick={handleClearSearch}
//                       className="text-xs font-semibold text-slate-500 hover:text-slate-800"
//                     >
//                       Clear
//                     </button>
//                   )}
//                   <button
//                     type="submit"
//                     className="rounded-full bg-[#38337E] px-5 py-2 text-sm font-semibold text-white shadow hover:bg-[#2e2a63]"
//                   >
//                     Search
//                   </button>
//                 </div>
//                 {mounted && searchTerm && (
//                   <p className="mt-1 text-xs text-slate-500">
//                     Showing results for:{" "}
//                     <span className="font-semibold">{searchTerm}</span>
//                   </p>
//                 )}
//               </div>
//             </form>

//             {/* Active Filters Indicator */}
//             {mounted && activeFiltersCount > 0 && (
//               <div className="flex flex-wrap items-center justify-between rounded-2xl border border-dashed border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-600">
//                 <p>
//                   {activeFiltersCount} filter
//                   {activeFiltersCount > 1 ? "s" : ""} applied
//                 </p>
//                 <button
//                   type="button"
//                   onClick={clearAllFilters}
//                   className="text-xs font-semibold text-[#635dc1] underline-offset-4 hover:underline"
//                 >
//                   Reset
//                 </button>
//               </div>
//             )}

//             {/* Courses List */}
//             <CoursesList filters={filtersPayload} searchTerm={searchTerm} />
//           </div>
//         </div>
//       </div>

//       <CallbackForm />
//       <Footer />
//     </>
//   );
// };

// export default CollegesPage;
"use client";

import { useEffect, useMemo, useState } from "react";
import Footer from "@/components/footer/page";
import Header from "@/components/header/page";
import CoursesList, { CourseListFilters } from "@/components/courses/courseslist/coursesList";
import Breadcrumb from "@/components/breadcrumb/breadcrumb";
import CallbackForm from "@/components/newsletters/page";
import CourseFiltersSidebar from "@/components/courses/courseFilter/CourseFiltersSidebar";
import { feeRangeOptions, durationRangeOptions } from "@/components/courses/courseFilter/filterOptions";

const CollegesPage = () => {
  const [selectedStreams, setSelectedStreams] = useState<string[]>([]);
  const [selectedFeeRanges, setSelectedFeeRanges] = useState<string[]>([]);
  const [selectedCourseTypes, setSelectedCourseTypes] = useState<string[]>([]);
  const [selectedDurations, setSelectedDurations] = useState<string[]>([]);
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const buildRangePayload = (selectedIds: string[], source: typeof feeRangeOptions) =>
    selectedIds
      .map((id) => source.find((o) => o.id === id))
      .filter((o): o is (typeof source)[number] => Boolean(o))
      .map((o) => {
        const p: { min?: number; max?: number } = {};
        if (typeof o.min === "number") p.min = o.min;
        if (typeof o.max === "number") p.max = o.max;
        return p;
      });

  const filtersPayload: CourseListFilters = useMemo(
    () => ({
      streams: selectedStreams,
      feeRanges: buildRangePayload(selectedFeeRanges, feeRangeOptions),
      courseTypes: selectedCourseTypes,
      durations: buildRangePayload(selectedDurations, durationRangeOptions),
      states: selectedStates,
      cities: selectedCities,
    }),
    [selectedStreams, selectedFeeRanges, selectedCourseTypes, selectedDurations, selectedStates, selectedCities]
  );

  const activeFiltersCount =
    (filtersPayload.streams?.length ?? 0) +
    (filtersPayload.courseTypes?.length ?? 0) +
    (filtersPayload.feeRanges?.length ?? 0) +
    (filtersPayload.durations?.length ?? 0) +
    (filtersPayload.states?.length ?? 0) +
    (filtersPayload.cities?.length ?? 0);

  const clearAllFilters = () => {
    setSelectedStreams([]);
    setSelectedFeeRanges([]);
    setSelectedCourseTypes([]);
    setSelectedDurations([]);
    setSelectedStates([]);
    setSelectedCities([]);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(searchInput.trim());
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearchTerm("");
  };

  // Shared sidebar props
  const sidebarProps = {
    selectedStreams, onStreamsChange: setSelectedStreams,
    selectedFeeRanges, onFeeRangeChange: setSelectedFeeRanges,
    selectedCourseTypes, onCourseTypeChange: setSelectedCourseTypes,
    selectedDurations, onDurationChange: setSelectedDurations,
    selectedStates, onStatesChange: setSelectedStates,
    selectedCities, onCitiesChange: setSelectedCities,
    onClearFilters: clearAllFilters,
  };

  return (
    <>
      <Header />

      {/* Breadcrumb */}
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

          {/* Desktop sidebar — left column, xl+ only */}
          <div className="hidden xl:block w-[260px] shrink-0">
            <CourseFiltersSidebar {...sidebarProps} />
          </div>

          {/* Main content */}
          <div className="flex-1 space-y-4">

            {/* Search form */}
            <form
              onSubmit={handleSearchSubmit}
              className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white/95 shadow-sm lg:flex-row lg:items-center search-form-bg
                p-3 sm:p-4
              "
            >
              <div className="flex-1">
                <label className="block font-semibold text-slate-600
                  text-xs sm:text-sm
                ">
                  Search courses by name or specialization
                </label>
                <div className="mt-2 flex items-center gap-2 rounded-2xl border-2 border-[#f37d5a]/60 bg-white shadow-inner
                  px-3 py-2 sm:px-4 sm:py-3 sm:gap-3
                ">
                  {mounted && (
                    <input
                      type="text"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      placeholder="e.g. MBA, B.Tech..."
                      className="w-full border-none text-slate-800 placeholder:text-slate-400 focus:outline-none
                        text-sm sm:text-base
                      "
                    />
                  )}
                  {mounted && searchTerm && (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="shrink-0 font-semibold text-slate-500 hover:text-slate-800
                        text-[11px] sm:text-xs
                      "
                    >
                      Clear
                    </button>
                  )}
                  <button
                    type="submit"
                    className="shrink-0 rounded-full bg-[#38337E] font-semibold text-white shadow hover:bg-[#2e2a63]
                      px-3 py-1.5 text-xs
                      sm:px-5 sm:py-2 sm:text-sm
                    "
                  >
                    Search
                  </button>
                </div>
                {mounted && searchTerm && (
                  <p className="mt-1 text-xs text-slate-500">
                    Showing results for: <span className="font-semibold">{searchTerm}</span>
                  </p>
                )}
              </div>
            </form>

            {/* Mobile filter button — sits right below search bar, hidden on xl+ */}
            <div className="xl:hidden">
              <CourseFiltersSidebar {...sidebarProps} />
            </div>

            {/* Active filters indicator */}
            {mounted && activeFiltersCount > 0 && (
              <div className="flex flex-wrap items-center justify-between rounded-2xl border border-dashed border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-600">
                <p>
                  {activeFiltersCount} filter{activeFiltersCount > 1 ? "s" : ""} applied
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

            {/* Courses list */}
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
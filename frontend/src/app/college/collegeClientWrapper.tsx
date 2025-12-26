"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import FilterCollegeCard from "@/components/college/collegeCard/filterCollgedata";
import AdBox1 from "@/components/adBox/adBox1";
import AdBox2 from "@/components/adBox/adBox2";
import { api_url } from "@/utils/apiCall";
import FilterSidebarNew from "./filterSidebarNew";
import AdBanner from "@/components/adBox/adBox5";
import CollegeListSkeleton from "@/components/college/CollegeListSkeleton";
const FILTER_LABELS: Record<string, string> = {
  states: "State",
  cities: "City",
  streams: "Stream",
  ownerships: "Ownership",
  exams: "Exam",
  approvals: "Approval",
  affiliatedBy: "Affiliation",
  categories: "Category",
  specializations: "Specialization",
  programModes: "Program Mode",
  fees: "Fee Range",
};

export default function CollegesClientWrapper() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [colleges, setColleges] = useState<any[]>([]);
  const [filters, setFilters] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;
  const lastFilterKeyRef = useRef<string | null>(null);
  const parseSearchParams = () => {
    const result: { [key: string]: string[] } = {};
    searchParams.forEach((value, key) => {
      if (!result[key]) result[key] = [];
      result[key].push(value);
    });
    if (!result["page"]) result["page"] = ["1"]; // default to page 1
    return result;
  };
  const buildQueryParams = (filters: { [key: string]: string[] }) => {
    const params = new URLSearchParams();
    for (const key in filters) {
      filters[key].forEach((val) => params.append(key, val));
    }
    return params.toString();
  };
  const buildFilterKey = (filters: { [key: string]: string[] }) => {
    const parts = Object.keys(filters)
      .filter((key) => key !== "page")
      .sort()
      .map((key) => {
        const values = [...filters[key]]
          .map((value) => value.toLowerCase())
          .sort();
        return `${key}:${values.join(",")}`;
      });
    return parts.join("|");
  };
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const filterObj = parseSearchParams();
      const page = parseInt(filterObj.page?.[0] || "1", 10);
      const hasFilters = Object.entries(filterObj).some(
        ([key, values]) => key !== "page" && values.length > 0
      );
      const filterKey = buildFilterKey(filterObj);
      const includeFilters = filterKey !== lastFilterKeyRef.current;
      lastFilterKeyRef.current = filterKey;
      const res = await fetch(`${api_url}get/colleges/filter-v2`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...filterObj,
          page,
          limit,
          includeFilters,
        }),
      });
      const data = await res.json();
      const filteredColleges = data.colleges || [];
      setColleges(filteredColleges);
      setCurrentPage(data.currentPage || page);
      setTotalPages(data.totalPages || 1);
      if (data.filters) {
        setFilters(data.filters);
      }
      setLoading(false);
    };
    fetchData();
  }, [searchParams]);
  const handleFilterChange = useCallback(
    (filters: { [key: string]: string[] }) => {
      const newQuery = buildQueryParams(filters);
      if (newQuery !== searchParams.toString()) {
        // Delay push until after current render
        setTimeout(() => {
          router.push(`?${newQuery}`);
        }, 0);
      }
    },
    [router, searchParams]
  );
  const selectedFilters = parseSearchParams();
  const activeFilterChips = Object.entries(selectedFilters)
    .filter(([key]) => key !== "page")
    .flatMap(([key, values]) =>
      values.map((value) => ({
        key,
        value,
        label: FILTER_LABELS[key] || key,
      }))
    );

  const handleRemoveFilter = (section: string, value: string) => {
    const updatedFilters = parseSearchParams();
    const nextValues = (updatedFilters[section] || []).filter(
      (item) => item !== value
    );
    if (nextValues.length) {
      updatedFilters[section] = nextValues;
    } else {
      delete updatedFilters[section];
    }
    updatedFilters.page = ["1"];
    handleFilterChange(updatedFilters);
  };

  const handleClearFilters = () => {
    handleFilterChange({});
  };

  const getVisiblePages = () => {
    const total = totalPages;
    const current = currentPage;
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages = new Set<number>();
    pages.add(1);
    pages.add(total);
    for (let i = current - 1; i <= current + 1; i += 1) {
      if (i > 1 && i < total) pages.add(i);
    }
    return Array.from(pages).sort((a, b) => a - b);
  };

  const visiblePages = getVisiblePages();
  const showLeftEllipsis = visiblePages[1] > 2;
  const showRightEllipsis =
    visiblePages[visiblePages.length - 2] < totalPages - 1;

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <FilterSidebarNew
        filters={filters}
        selectedFilters={selectedFilters}
        onFilterChange={handleFilterChange}
      />

      <div className="flex-1 space-y-6 order-first lg:order-none">
        <div className="rounded-2xl">
          <AdBanner />
        </div>

        {activeFilterChips.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white/90 p-3 text-xs shadow-sm">
            <span className="font-semibold text-slate-600">Active filters:</span>
            {activeFilterChips.map((chip) => (
              <button
                key={`${chip.key}-${chip.value}`}
                onClick={() => handleRemoveFilter(chip.key, chip.value)}
                className="inline-flex items-center gap-1 rounded-full border border-[#cbc4ff] bg-[#f6f5ff] px-3 py-1 text-[11px] font-medium text-[#44368a] hover:border-[#7a6be7]"
              >
                <span className="text-[10px] uppercase text-[#8b7ed9]">
                  {chip.label}:
                </span>
                <span>{chip.value}</span>
                <span className="text-xs text-[#7a6be7]">&times;</span>
              </button>
            ))}
            <button
              onClick={handleClearFilters}
              className="ml-auto text-[11px] font-semibold text-[#7a6be7] underline-offset-2 hover:underline"
            >
              Clear all
            </button>
          </div>
        )}

        {loading ? (
          <CollegeListSkeleton />
        ) : colleges.length === 0 ? (
          <div className="rounded-2xl bg-white p-6 text-center text-gray-500 shadow-sm">
            No colleges match the selected filters yet.
          </div>
        ) : (
          <>
            {colleges.map((college) => (
              <FilterCollegeCard key={college._id} college={college} />
            ))}
            {totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-center gap-2 mt-6 text-sm">
                <button
                  className="px-3 py-1 border rounded bg-white text-black disabled:opacity-50"
                  disabled={currentPage === 1}
                  onClick={() => {
                    const updatedFilters = parseSearchParams();
                    updatedFilters.page = [String(currentPage - 1)];
                    handleFilterChange(updatedFilters);
                  }}
                >
                  Prev
                </button>
                <button
                  className="px-3 py-1 border rounded bg-white text-black disabled:opacity-50"
                  disabled={currentPage === totalPages}
                  onClick={() => {
                    const updatedFilters = parseSearchParams();
                    updatedFilters.page = [String(currentPage + 1)];
                    handleFilterChange(updatedFilters);
                  }}
                >
                  Next
                </button>
                <div className="flex items-center gap-2">
                  {visiblePages.map((page, index) => {
                    const pageString = String(page);
                    return (
                      <button
                        key={pageString}
                        className={`px-3 py-1 border rounded ${
                          currentPage === page
                            ? "bg-black text-white"
                            : "bg-white text-black"
                        }`}
                        onClick={() => {
                          const updatedFilters = parseSearchParams();
                          updatedFilters.page = [pageString];
                          handleFilterChange(updatedFilters);
                        }}
                      >
                        {pageString}
                      </button>
                    );
                  })}
                  {showLeftEllipsis && <span className="px-2">...</span>}
                  {showRightEllipsis && <span className="px-2">...</span>}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="w-[320px] space-y-4 shrink-0 lg:sticky lg:top-6 h-fit">
        <AdBox1 />
        <AdBox2 />
      </div>
    </div>
  );
}

"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import FilterCollegeCard from "@/components/college/collegeCard/filterCollgedata";
import AdBox1 from "@/components/adBox/adBox1";
import AdBox2 from "@/components/adBox/adBox2";
import { api_url } from "@/utils/apiCall";
import FilterSidebarNew from "./filterSidebarNew";
import AdBanner from "@/components/adBox/adBox5";
import CollegeListSkeleton from "@/components/college/CollegeListSkeleton";
export default function CollegesClientWrapper() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [colleges, setColleges] = useState<any[]>([]);
  const [filters, setFilters] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;
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
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const filterObj = parseSearchParams();
      const page = parseInt(filterObj.page?.[0] || "1", 10);
      const res = await fetch(`${api_url}get/colleges/filter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...filterObj, page, limit }),
      });
      const data = await res.json();
      const filteredColleges = data.colleges || [];
      setColleges(filteredColleges);
      setCurrentPage(data.currentPage || page);
      setTotalPages(data.totalPages || 1);
      const collegeIds = data.allCollegeIds || [];
      if (collegeIds.length > 0) {
        const fRes = await fetch(`${api_url}get/filters/by-colleges`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ collegeIds }),
        });
        const dynamicFilters = await fRes.json();
        setFilters(dynamicFilters);
      } else {
        setFilters({});
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
  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <FilterSidebarNew
        filters={filters}
        selectedFilters={parseSearchParams()}
        onFilterChange={handleFilterChange}
      />

      <div className="flex-1 space-y-6 order-first lg:order-none">
        <div className="rounded-2xl">
          <AdBanner />
        </div>

        {loading ? (
          <CollegeListSkeleton />
        ) : colleges.length === 0 ? (
          <div className="rounded-2xl bg-white p-6 text-center text-gray-500 shadow-sm">
            No colleges match the selected filters yet.
          </div>
        ) : (
          <>
            {colleges.map((college) => (
              <FilterCollegeCard key={college._id} collegeId={college._id} />
            ))}
            {totalPages > 1 && (
              <div className="flex flex-wrap justify-center gap-2 mt-6">
                {[...Array(totalPages)].map((_, i) => {
                  const page = (i + 1).toString();
                  return (
                    <button
                      key={page}
                      className={`px-3 py-1 border rounded ${
                        currentPage === i + 1
                          ? "bg-black text-white"
                          : "bg-white text-black"
                      }`}
                      onClick={() => {
                        const updatedFilters = parseSearchParams();
                        updatedFilters.page = [page];
                        handleFilterChange(updatedFilters);
                      }}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      <div className="w-[275px] space-y-4 shrink-0">
        <AdBox1 />
        <AdBox2 />
      </div>
    </div>
  );
}

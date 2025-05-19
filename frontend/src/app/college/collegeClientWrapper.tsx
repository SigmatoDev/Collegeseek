// components/CollegesClientWrapper.tsx
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import FilterCollegeCard from "@/components/college/collegeCard/filterCollgedata";
import FilterSidebarNew from "./filterSidebarNew";
import AdBox1 from "@/components/adBox/adBox1";
import AdBox2 from "@/components/adBox/adBox2";
import { api_url } from "@/utils/apiCall";

export default function CollegesClientWrapper() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [colleges, setColleges] = useState<any[]>([]);
  const [filters, setFilters] = useState<any>({});
  const [loading, setLoading] = useState(true);

  const parseSearchParams = () => {
    const result: { [key: string]: string[] } = {};
    searchParams.forEach((value, key) => {
      if (!result[key]) result[key] = [];
      result[key].push(value);
    });
    return result;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const filterObj = parseSearchParams();
      const res = await fetch(`${api_url}get/colleges/filter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filterObj),
      });
      const data = await res.json();
      const filteredColleges = data.colleges || [];
      setColleges(filteredColleges);

      const collegeIds = filteredColleges.map((clg: any) => clg._id);
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

  const handleFilterChange = (filters: { [key: string]: string[] }) => {
    const params = new URLSearchParams();
    for (const key in filters) {
      filters[key].forEach((val) => params.append(key, val));
    }

    const newQuery = params.toString();
    if (newQuery !== searchParams.toString()) {
      router.push(`?${newQuery}`);
    }
  };

  return (
    <div className="flex gap-6">
      <FilterSidebarNew
        filters={filters}
        selectedFilters={parseSearchParams()}
        onFilterChange={handleFilterChange}
      />
      <div className="flex-1 space-y-6">
        {colleges.length === 0 ? (
          <p>No colleges found.</p>
        ) : (
          colleges.map((college) => (
            <FilterCollegeCard key={college._id} collegeId={college._id} />
          ))
        )}
      </div>
      <div className="w-[250px] space-y-4 shrink-0">
        <AdBox1 />
        <AdBox2 />
      </div>

      {loading && (
        <div className="fixed inset-0 z-50 bg-white/60 backdrop-blur-sm flex items-center justify-center">
          <div className="animate-spin h-10 w-10 border-4 border-black border-t-transparent rounded-full" />
        </div>
      )}
    </div>
  );
}

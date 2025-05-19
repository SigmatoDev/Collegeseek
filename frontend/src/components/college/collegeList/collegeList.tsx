// import { useState, useEffect } from "react";
// import axios from "axios";
// import { api_url } from "@/utils/apiCall";
// import FilterCollegeCard from "../collegeCard/filterCollgedata";

// interface College {
//   _id: string;
//   name: string;
//   image: string;
//   state: string;
//   city: string;
//   rank: number;
//   fees: number;
// }

// interface AppliedFilters {
//   degrees: string[];
//   states: string[];
//   cities: string[];
//   ranks: string[];
//   fees: string[];
// }

// interface CollegeListProps {
//   appliedFilters: AppliedFilters;
// }

// const CollegeList = ({ appliedFilters }: CollegeListProps) => {
//   const [colleges, setColleges] = useState<College[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [page, setPage] = useState<number>(1);
//   const [totalPages, setTotalPages] = useState<number>(1);
//   const limit = 10;

//   useEffect(() => {
//     const fetchColleges = async () => {
//       setLoading(true);
//       setError(null);

//       try {
//         const response = await axios.post(`${api_url}filter/colleges`, {
//           ...appliedFilters,
//           page,
//           limit,
//         });

//         console.log("college filter response", response);
//         if (response.data && response.data.success) {
//           setColleges(response.data.data);
//           setTotalPages(response.data.pagination.totalPages);
//         } else {
//           setError("No colleges found.");
//         }
//       } catch (error: any) {
//         setError("Failed to load college list.");
//         console.error(
//           "Error fetching data:",
//           error?.response?.data || error?.message
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchColleges();
//   }, [appliedFilters, page]);

//   const handlePrev = () => {
//     if (page > 1) setPage((prev) => prev - 1);
//   };

//   const handleNext = () => {
//     if (page < totalPages) setPage((prev) => prev + 1);
//   };

//   useEffect(() => {
//     console.log("Received filters:", appliedFilters);
//   }, [appliedFilters]);

//   const filteredColleges = colleges; // already filtered by backend

//   if (loading)
//     return <div className="text-center p-4">Loading colleges...</div>;
//   if (error) return <div className="text-center p-4 text-red-500">{error}</div>;

//   return (
//     <div className="max-w-6xl mx-auto px-4">
//       <div className="flex flex-col gap-6">
//         {filteredColleges.length > 0 ? (
//           filteredColleges.map((college) => (
//             <FilterCollegeCard key={college._id} collegeId={college._id} />
//           ))
//         ) : (
//           <div className="text-center text-gray-500">
//             No colleges available.
//           </div>
//         )}
//       </div>
//       {totalPages > 1 && (
//         <div className="flex items-center justify-center gap-4 mt-6">
//           <button
//             onClick={handlePrev}
//             disabled={page === 1}
//             className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
//           >
//             ⬅ Prev
//           </button>

//           <span className="text-gray-700 font-medium">
//             Page <span className="font-bold text-blue-600">{page}</span> of{" "}
//             <span className="font-bold">{totalPages}</span>
//           </span>

//           <button
//             onClick={handleNext}
//             disabled={page === totalPages}
//             className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
//           >
//             Next ➡
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CollegeList;
"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import axios from "axios";
import { api_url } from "@/utils/apiCall";
import FilterCollegeCard from "../collegeCard/filterCollgedata";
interface College {
  _id: string;
  name: string;
  image: string;
  state: string;
  city: string;
  rank: number;
  fees: number;
}
interface AppliedFilters {
  [key: string]: string[];
}
interface CollegeListProps {
  appliedFilters: AppliedFilters;
}
const CollegeList = ({ appliedFilters }: CollegeListProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 10;
  // Get page from URL
  const page = parseInt(searchParams.get("page") || "1", 10);
  const updatePageInURL = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };
  useEffect(() => {
    const fetchColleges = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.post(`${api_url}filter/colleges`, {
          ...appliedFilters,
          page,
          limit,
        });
        if (response.data && response.data.success) {
          setColleges(response.data.data);
          setTotalPages(response.data.pagination.totalPages);
        } else {
          setError("No colleges found.");
        }
      } catch (error: any) {
        setError("Failed to load college list.");
        console.error("Error fetching data:", error?.response?.data || error?.message);
      } finally {
        setLoading(false);
      }
    };
    fetchColleges();
  }, [appliedFilters, page]);
  if (loading) return <div className="text-center p-4">Loading colleges...</div>;
  if (error) return <div className="text-center p-4 text-red-500">{error}</div>;
  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="flex flex-col gap-6">
        {colleges.length > 0 ? (
          colleges.map((college) => (
            <FilterCollegeCard key={college._id} collegeId={college._id} />
          ))
        ) : (
          <div className="text-center text-gray-500">No colleges available.</div>
        )}
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={() => updatePageInURL(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            :arrow_left: Prev
          </button>
          <span className="text-gray-700 font-medium">
            Page <span className="font-bold text-blue-600">{page}</span> of{" "}
            <span className="font-bold">{totalPages}</span>
          </span>
          <button
            onClick={() => updatePageInURL(page + 1)}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Next :arrow_right:
          </button>
        </div>
      )}
    </div>
  );
};
export default CollegeList;
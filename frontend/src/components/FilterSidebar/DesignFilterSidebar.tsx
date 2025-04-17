// "use client";

// import { useState, useEffect } from "react";
// import { api_url } from "@/utils/apiCall";

// const CollegeFilterSidebar = () => {
//   const [states, setStates] = useState<string[]>([]);
//   const [cities, setCities] = useState<string[]>([]);
//   const [ranks, setRanks] = useState<number[]>([]);
//   const [mounted, setMounted] = useState(false);

//   const feeRanges = [
//     "Below 1,000",
//     "1,000 - 2,000",
//     "2,000 - 3,000",
//     "3,000 - 5,000",
//     "Above 5,000",
//   ];

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   useEffect(() => {
//     const fetchColleges = async () => {
//       try {
//         const res = await fetch(`${api_url}colleges`);
//         const { data } = await res.json();

//         const stateSet = new Set<string>();
//         const citySet = new Set<string>();
//         const rankSet = new Set<number>();

//         data.forEach((college: any) => {
//           if (college.state) stateSet.add(college.state);
//           if (college.city) citySet.add(college.city);
//           if (college.rank) rankSet.add(college.rank);
//         });

//         setStates(Array.from(stateSet));
//         setCities(Array.from(citySet));
//         setRanks(Array.from(rankSet).sort((a, b) => a - b));
//       } catch (err) {
//         console.error("Error fetching colleges:", err);
//       }
//     };

//     fetchColleges();
//   }, []);

//   if (!mounted) return null;

//   return (
//     <div className="space-y-4 mt-4">
//       {/* State Filter Box */}
//       <div className="p-4 border rounded w-64 bg-white">
//         <h2 className="text-lg font-semibold mb-3">State</h2>
//         <div className="space-y-2 max-h-40 overflow-y-auto">
//           {states.map((state) => (
//             <div
//               key={state}
//               className="p-2 rounded bg-gray-50 hover:bg-gray-100 cursor-default"
//             >
//               {state}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* City Filter Box */}
//       <div className="p-4 border rounded w-64 bg-white">
//         <h2 className="text-lg font-semibold mb-3">City</h2>
//         <div className="space-y-2 max-h-40 overflow-y-auto">
//           {cities.map((city) => (
//             <div
//               key={city}
//               className="p-2 rounded bg-gray-50 hover:bg-gray-100 cursor-default"
//             >
//               {city}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Rank Filter Box */}
//       <div className="p-4 border rounded w-64 bg-white">
//         <h2 className="text-lg font-semibold mb-3">Rank</h2>
//         <div className="space-y-2 max-h-40 overflow-y-auto">
//           {ranks.map((rank) => (
//             <div
//               key={rank}
//               className="p-2 rounded bg-gray-50 hover:bg-gray-100 cursor-default"
//             >
//               {rank}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Fee Filter Box */}
//       <div className="p-4 border rounded w-64 bg-white">
//         <h2 className="text-lg font-semibold mb-3">Fee</h2>
//         <div className="space-y-2 max-h-40 overflow-y-auto">
//           {feeRanges.map((range, index) => (
//             <div
//               key={index}
//               className="p-2 rounded bg-gray-50 hover:bg-gray-100 cursor-default"
//             >
//               {range}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CollegeFilterSidebar;

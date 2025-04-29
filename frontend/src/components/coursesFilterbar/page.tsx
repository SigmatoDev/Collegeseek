// import { useState, useEffect } from "react";
// import { ChevronDown, ChevronUp } from "lucide-react";
// import { api_url } from "@/utils/apiCall";

// interface FilterSidebarProps {
//   onFilterChange: (newFilters: { duration: string[]; mode: string[] }) => void; // Specific type
// }

// const CoursesFilterSidebar = ({ onFilterChange }: FilterSidebarProps) => {
//   const [openSections, setOpenSections] = useState<Record<string, boolean>>({
//     duration: true,
//     mode: true,
//   });

//   const [search, setSearch] = useState<Record<string, string>>({
//     duration: "",
//     mode: "",
//   });

//   const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
//     duration: [],
//     mode: [],
//   });

//   const [filtersData, setFiltersData] = useState<Record<string, string[]>>({
//     duration: [],
//     mode: [],
//   });

//   useEffect(() => {
//     const fetchFilters = async () => {
//       try {
//         const res = await fetch(`${api_url}get/courses/filters`);
//         const data = await res.json();
//         setFiltersData({
//           duration: data.durations || [],
//           mode: data.modes || [],
//         });
//       } catch (error) {
//         console.error("Failed to fetch filter data", error);
//       }
//     };

//     fetchFilters();
//   }, []);

//   const toggleSection = (section: string) => {
//     setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
//   };

//   const handleFilterClick = (filterType: string, value: string) => {
//     const current = selectedFilters[filterType] || [];
//     const updated = current.includes(value)
//       ? current.filter((item) => item !== value)
//       : [...current, value];

//     const newFilters = {
//       ...selectedFilters,
//       [filterType]: updated,
//     };

//     setSelectedFilters(newFilters);
//     onFilterChange({ duration: newFilters.duration, mode: newFilters.mode }); // Ensure the correct shape
//   };

//   const FilterSectionWrapper = ({
//     title,
//     filterType,
//     children,
//   }: {
//     title: string;
//     filterType: string;
//     children: React.ReactNode;
//   }) => (
//     <div className="space-y-3">
//       <div
//         className="flex justify-between items-center cursor-pointer"
//         onClick={() => toggleSection(filterType)}
//       >
//         <h2 className="text-sm font-medium text-gray-700 uppercase tracking-wide border-b pb-1">
//           {title}
//         </h2>
//         {openSections[filterType] ? (
//           <ChevronUp className="w-4 h-4 text-gray-500" />
//         ) : (
//           <ChevronDown className="w-4 h-4 text-gray-500" />
//         )}
//       </div>
//       {openSections[filterType] && children}
//     </div>
//   );

//   return (
//     <aside className="w-80 max-w-sm bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-6">
//       <h1 className="text-xl font-semibold text-gray-800">Filter Courses</h1>

//       <div className="space-y-5 overflow-y-auto max-h-[calc(150vh-50px)] pr-2">
//         {Object.keys(filtersData).map((filterType) => (
//           <FilterSectionWrapper key={filterType} title={filterType} filterType={filterType}>
//             <input
//               type="text"
//               placeholder={`Search ${filterType}`}
//               value={search[filterType]}
//               onChange={(e) =>
//                 setSearch((prev) => ({ ...prev, [filterType]: e.target.value }))
//               }
//               className="w-full px-3 py-1 mb-2 border border-gray-300 rounded-md text-sm"
//             />
//             <div className="max-h-40 overflow-y-auto space-y-2">
//               {filtersData[filterType]
//                 .filter((item) =>
//                   item.toLowerCase().includes(search[filterType]?.toLowerCase())
//                 )
//                 .map((value) => (
//                   <label
//                     key={value}
//                     className="flex items-center space-x-3 py-1 px-2 rounded-lg cursor-pointer transition text-[15px]"
//                   >
//                     <input
//                       type="checkbox"
//                       checked={selectedFilters[filterType]?.includes(value)}
//                       onChange={() => handleFilterClick(filterType, value)}
//                       className="accent-blue-600 h-4 w-4 rounded"
//                     />
//                     <span
//                       className={`${
//                         selectedFilters[filterType]?.includes(value)
//                           ? "text-blue-600"
//                           : "text-gray-700 hover:bg-gray-100"
//                       }`}
//                     >
//                       {value}
//                     </span>
//                   </label>
//                 ))}
//             </div>
//           </FilterSectionWrapper>
//         ))}
//       </div>
//     </aside>
//   );
// };

// export default CoursesFilterSidebar;

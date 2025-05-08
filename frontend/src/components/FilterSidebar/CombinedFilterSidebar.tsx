// "use client";

// import { useState, useEffect } from "react";
// import { useCourseFilters } from "./useCourseFilters";
// import { useCollegeFilters } from "./useCollegeFilters";

// const feeRanges = [
//   "Below 50,000",
//   "50,000 - 1,00,000",
//   "1,00,000 - 1,50,000",
//   "Above 1,50,000",
// ];

// interface CombinedFilterSidebarProps {
//   onFilterChange: (filters: any) => void;
// }

// const CombinedFilterSidebar = ({ onFilterChange }: CombinedFilterSidebarProps) => {
//   const [mounted, setMounted] = useState(false);

//   const { degrees } = useCourseFilters();
//   const {
//     states,
//     cities,
//     ranks,
//     ownerships,
//     affiliations,
//     approvals,
//     exams,
//     streams,
//   } = useCollegeFilters();

//   const [selectedDegrees, setSelectedDegrees] = useState<string[]>([]);
//   const [selectedStates, setSelectedStates] = useState<string[]>([]);
//   const [selectedCities, setSelectedCities] = useState<string[]>([]);
//   const [selectedRanks, setSelectedRanks] = useState<number[]>([]);
//   const [selectedFees, setSelectedFees] = useState<string[]>([]);
//   const [selectedOwnerships, setSelectedOwnerships] = useState<string[]>([]);
//   const [selectedAffiliations, setSelectedAffiliations] = useState<string[]>([]);
//   const [selectedApprovals, setSelectedApprovals] = useState<string[]>([]);
//   const [selectedExams, setSelectedExams] = useState<string[]>([]);
//   const [selectedStreams, setSelectedStreams] = useState<string[]>([]);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   const toggle = <T extends string | number>(value: T, array: T[]): T[] =>
//     array.includes(value) ? array.filter((v) => v !== value) : [...array, value];

//   const handleCheckboxChange = <T extends string | number>(
//     value: T,
//     selected: T[],
//     setSelected: (val: T[]) => void,
//     updateFilterState: (updated: T[]) => void
//   ) => {
//     const updated = toggle(value, selected);
//     setSelected(updated);
//     updateFilterState(updated);
//   };

//   const handleFilterChange = (filters: any) => {
//     const combined = {
//       degrees: filters.degrees ?? selectedDegrees,
//       states: filters.states ?? selectedStates,
//       cities: filters.cities ?? selectedCities,
//       ranks: filters.ranks ?? selectedRanks,
//       fees: filters.fees ?? selectedFees,
//       ownerships: filters.ownerships ?? selectedOwnerships,
//       affiliations: filters.affiliations ?? selectedAffiliations,
//       approvals: filters.approvals ?? selectedApprovals,
//       exams: filters.exams ?? selectedExams,
//       streams: filters.streams ?? selectedStreams,
//     };
//     onFilterChange(combined);
//   };

//   if (!mounted) return null;

//   const FilterSectionWrapper = ({
//     title,
//     children,
//   }: {
//     title: string;
//     children: React.ReactNode;
//   }) => (
//     <div className="space-y-3">
//       <h2 className="text-sm font-medium text-gray-700 uppercase tracking-wide border-b pb-1">
//         {title}
//       </h2>
//       <div className="space-y-2">{children}</div>
//     </div>
//   );

//   const renderDegreeFilterSection = () => (
//     <FilterSectionWrapper title="Degree">
//       <div className="max-h-40 overflow-y-auto">
//         {degrees.map(({ _id, name }) => (
//           <label
//             key={_id}
//             className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
//           >
//             <input
//               type="checkbox"
//               checked={selectedDegrees.includes(_id)}
//               onChange={() =>
//                 handleCheckboxChange<string>(
//                   _id,
//                   selectedDegrees,
//                   setSelectedDegrees,
//                   (updated) => handleFilterChange({ degrees: updated })
//                 )
//               }
//               className="accent-blue-600 h-4 w-4 rounded"
//             />
//             {name}
//           </label>
//         ))}
//       </div>
//     </FilterSectionWrapper>
//   );

//   const renderFilterSection = <T extends string | number>(
//     title: string,
//     items: T[],
//     selected: T[],
//     setSelected: (val: T[]) => void,
//     filterKey: keyof typeof filterHandlers
//   ) => (
//     <FilterSectionWrapper title={title}>
//       <div className="max-h-40 overflow-y-auto">
//         {items.map((item, index) => (
//           <label
//             key={index}
//             className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
//           >
//             <input
//               type="checkbox"
//               checked={selected.includes(item)}
//               onChange={() =>
//                 handleCheckboxChange<T>(
//                   item,
//                   selected,
//                   setSelected,
//                   (updated) => handleFilterChange({ [filterKey]: updated })
//                 )
//               }
//               className="accent-blue-600 h-4 w-4 rounded"
//             />
//             {String(item)}
//           </label>
//         ))}
//       </div>
//     </FilterSectionWrapper>
//   );

//   const filterHandlers = {
//     degrees: setSelectedDegrees,
//     states: setSelectedStates,
//     cities: setSelectedCities,
//     ranks: setSelectedRanks,
//     fees: setSelectedFees,
//     ownerships: setSelectedOwnerships,
//     affiliations: setSelectedAffiliations,
//     approvals: setSelectedApprovals,
//     exams: setSelectedExams,
//     streams: setSelectedStreams,
//   };

//   return (
//     <div className="w-[300px] max-w-sm bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-6">
//       <h1 className="text-xl font-semibold text-gray-800">Filter Colleges</h1>

//       <div className="space-y-5 overflow-y-auto max-h-[calc(150vh-50px)] pr-2">
//         {renderDegreeFilterSection()}
//         {renderFilterSection("State", states, selectedStates, setSelectedStates, "states")}
//         {renderFilterSection("City", cities, selectedCities, setSelectedCities, "cities")}
//         {renderFilterSection("Rank", ranks, selectedRanks, setSelectedRanks, "ranks")}
//         {renderFilterSection("Fee", feeRanges, selectedFees, setSelectedFees, "fees")}
//         {renderFilterSection("Ownership", ownerships, selectedOwnerships, setSelectedOwnerships, "ownerships")}
//         {renderFilterSection("Affiliation", affiliations, selectedAffiliations, setSelectedAffiliations, "affiliations")}
//         {renderFilterSection("Approval", approvals, selectedApprovals, setSelectedApprovals, "approvals")}
//         {renderFilterSection("Exam", exams, selectedExams, setSelectedExams, "exams")}
//         {renderFilterSection("Stream", streams, selectedStreams, setSelectedStreams, "streams")}
//       </div>
//     </div>
//   );
// };

// export default CombinedFilterSidebar;

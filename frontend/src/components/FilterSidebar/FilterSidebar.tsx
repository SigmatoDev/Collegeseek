// "use client";

// import { useState, useEffect } from "react";
// import { useCourseFilters } from "./useCourseFilters";
// import { useCollegeFilters } from "./useCollegeFilters";
// import {
//   FilterSectionWrapper,
//   renderFilterSection,
//   handleCheckboxChange,
// } from "./filterHelpers";

// const feeRanges = [
//   "Below 50,000",
//   "50,000 - 1,00,000",
//   "1,00,000 - 1,50,000",
//   "Above 1,50,000",
// ];

// const rankRanges = [
//   "Below 50",
//   "50 - 100",
//   "Above 100",
// ];

// interface CombinedFilterSidebarProps {
//   onFilterChange: (filters: any) => void;
// }

// const CombinedFilterSidebar = ({ onFilterChange }: CombinedFilterSidebarProps) => {
//   const [mounted, setMounted] = useState(false);

//   const { degrees, programModes, courseNames } = useCourseFilters();
//   const {
//     states,
//     cities,
//     ownerships,
//     affiliations,
//     approvals,
//     exams,
//     streams,
//   } = useCollegeFilters();

//   const [selectedDegrees, setSelectedDegrees] = useState<string[]>([]);
//   const [selectedStates, setSelectedStates] = useState<string[]>([]);
//   const [selectedCities, setSelectedCities] = useState<string[]>([]);
//   const [selectedRanks, setSelectedRanks] = useState<string[]>([]); // Changed to string[]
//   const [selectedFees, setSelectedFees] = useState<string[]>([]);
//   const [selectedOwnerships, setSelectedOwnerships] = useState<string[]>([]);
//   const [selectedAffiliations, setSelectedAffiliations] = useState<string[]>([]);
//   const [selectedApprovals, setSelectedApprovals] = useState<string[]>([]);
//   const [selectedExams, setSelectedExams] = useState<string[]>([]);
//   const [selectedStreams, setSelectedStreams] = useState<string[]>([]);
//   const [selectedProgramModes, setSelectedProgramModes] = useState<string[]>([]);
//   const [selectedCourseNames, setSelectedCourseNames] = useState<string[]>([]);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   const handleFilterChange = (filters: any) => {
//     const combined = {
//       degrees: filters.degrees ?? selectedDegrees,
//       programModes: filters.programModes ?? selectedProgramModes,
//       courseNames: filters.courseNames ?? selectedCourseNames,
//       states: filters.states ?? selectedStates,
//       cities: filters.cities ?? selectedCities,
//       ranks: filters.ranks ?? selectedRanks, // Still using string format
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

//   return (
//     <div className="w-[300px] max-w-sm bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-6">
//       <h1 className="text-xl font-semibold text-gray-800">Filter Colleges</h1>

//       <div className="space-y-5 overflow-y-auto max-h-[calc(190vh-50px)] pr-2">
//         <FilterSectionWrapper title="Courses">
//           <div className="max-h-40 overflow-y-auto">
//             {degrees.map(({ _id, name }) => (
//               <label
//                 key={_id}
//                 className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
//               >
//                 <input
//                   type="checkbox"
//                   checked={selectedDegrees.includes(_id)}
//                   onChange={() =>
//                     handleCheckboxChange<string>(
//                       _id,
//                       selectedDegrees,
//                       setSelectedDegrees,
//                       (updated: string[]) => handleFilterChange({ degrees: updated })
//                     )
//                   }
//                   className="accent-blue-600 h-4 w-4 rounded"
//                 />
//                 {name}
//               </label>
//             ))}
//           </div>
//         </FilterSectionWrapper>

//         {/* Program Mode */}
//         <FilterSectionWrapper title="Program Mode">
//           <div className="max-h-40 overflow-y-auto">
//             {programModes.map(({ _id, name }) => (
//               <label key={_id} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800">
//                 <input
//                   type="checkbox"
//                   checked={selectedProgramModes.includes(_id)}
//                   onChange={() =>
//                     handleCheckboxChange<string>(
//                       _id,
//                       selectedProgramModes,
//                       setSelectedProgramModes,
//                       (updated) => handleFilterChange({ programModes: updated })
//                     )
//                   }
//                   className="accent-blue-600 h-4 w-4 rounded"
//                 />
//                 {name}
//               </label>
//             ))}
//           </div>
//         </FilterSectionWrapper>

//         {renderFilterSection("Specialization", courseNames, selectedCourseNames, setSelectedCourseNames, handleFilterChange)}
//         {renderFilterSection("State", states, selectedStates, setSelectedStates, handleFilterChange)}
//         {renderFilterSection("City", cities, selectedCities, setSelectedCities, handleFilterChange)}

//         {/* Ranks like Fees */}
//         {renderFilterSection("Rank", rankRanges, selectedRanks, setSelectedRanks, handleFilterChange)}

//         {renderFilterSection("Total Fees", feeRanges, selectedFees, setSelectedFees, handleFilterChange)}

//         <FilterSectionWrapper title="Ownership">
//           <div className="max-h-40 overflow-y-auto">
//             {ownerships.map(({ _id, name }) => (
//               <label key={_id} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800">
//                 <input
//                   type="checkbox"
//                   checked={selectedOwnerships.includes(_id)}
//                   onChange={() =>
//                     handleCheckboxChange<string>(
//                       _id,
//                       selectedOwnerships,
//                       setSelectedOwnerships,
//                       (updated) => handleFilterChange({ ownerships: updated })
//                     )
//                   }
//                   className="accent-blue-600 h-4 w-4 rounded"
//                 />
//                 {name}
//               </label>
//             ))}
//           </div>
//         </FilterSectionWrapper>

//         <FilterSectionWrapper title="Affiliated By">
//           <div className="max-h-40 overflow-y-auto">
//             {affiliations.map(({ _id, name }) => (
//               <label key={_id} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800">
//                 <input
//                   type="checkbox"
//                   checked={selectedAffiliations.includes(_id)}
//                   onChange={() =>
//                     handleCheckboxChange<string>(
//                       _id,
//                       selectedAffiliations,
//                       setSelectedAffiliations,
//                       (updated) => handleFilterChange({ affiliations: updated })
//                     )
//                   }
//                   className="accent-blue-600 h-4 w-4 rounded"
//                 />
//                 {name}
//               </label>
//             ))}
//           </div>
//         </FilterSectionWrapper>

//         <FilterSectionWrapper title="Approval">
//           <div className="max-h-40 overflow-y-auto">
//             {approvals.map(({ _id, code }) => (
//               <label key={_id} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800">
//                 <input
//                   type="checkbox"
//                   checked={selectedApprovals.includes(_id)}
//                   onChange={() =>
//                     handleCheckboxChange<string>(
//                       _id,
//                       selectedApprovals,
//                       setSelectedApprovals,
//                       (updated) => handleFilterChange({ approvals: updated })
//                     )
//                   }
//                   className="accent-blue-600 h-4 w-4 rounded"
//                 />
//                 {code}
//               </label>
//             ))}
//           </div>
//         </FilterSectionWrapper>

//         <FilterSectionWrapper title="Exams Accepted">
//           <div className="max-h-40 overflow-y-auto">
//             {exams.map(({ _id, code }) => (
//               <label key={_id} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800">
//                 <input
//                   type="checkbox"
//                   checked={selectedExams.includes(_id)}
//                   onChange={() =>
//                     handleCheckboxChange<string>(
//                       _id,
//                       selectedExams,
//                       setSelectedExams,
//                       (updated) => handleFilterChange({ exams: updated })
//                     )
//                   }
//                   className="accent-blue-600 h-4 w-4 rounded"
//                 />
//                 {code}
//               </label>
//             ))}
//           </div>
//         </FilterSectionWrapper>

//         <FilterSectionWrapper title="Stream">
//           <div className="max-h-40 overflow-y-auto">
//             {streams.map(({ _id, name }) => (
//               <label key={_id} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800">
//                 <input
//                   type="checkbox"
//                   checked={selectedStreams.includes(_id)}
//                   onChange={() =>
//                     handleCheckboxChange<string>(
//                       _id,
//                       selectedStreams,
//                       setSelectedStreams,
//                       (updated) => handleFilterChange({ streams: updated })
//                     )
//                   }
//                   className="accent-blue-600 h-4 w-4 rounded"
//                 />
//                 {name}
//               </label>
//             ))}
//           </div>
//         </FilterSectionWrapper>
//       </div>
//     </div>
//   );
// };

// export default CombinedFilterSidebar;
"use client";
import { useEffect, useState } from "react";
import { useCourseFilters } from "./useCourseFilters";
import { useCollegeFilters } from "./useCollegeFilters";
import {
  FilterSectionWrapper,
  renderFilterSection,
  handleCheckboxChange,
} from "./filterHelpers";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const feeRanges = [
  "Below 50,000",
  "50,000 - 1,00,000",
  "1,00,000 - 1,50,000",
  "Above 1,50,000",
];

const rankRanges = ["Below 50", "50 - 100", "Above 100"];

interface CombinedFilterSidebarProps {
  onFilterChange: (filters: any) => void;
}

const CombinedFilterSidebar = ({ onFilterChange }: CombinedFilterSidebarProps) => {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { degrees, programModes, courseNames } = useCourseFilters();
  const {
    states,
    cities,
    ownerships,
    affiliations,
    approvals,
    exams,
    streams,
  } = useCollegeFilters();

  const [selectedDegrees, setSelectedDegrees] = useState<string[]>([]);
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectedRanks, setSelectedRanks] = useState<string[]>([]);
  const [selectedFees, setSelectedFees] = useState<string[]>([]);
  const [selectedOwnerships, setSelectedOwnerships] = useState<string[]>([]);
  const [selectedAffiliations, setSelectedAffiliations] = useState<string[]>([]);
  const [selectedApprovals, setSelectedApprovals] = useState<string[]>([]);
  const [selectedExams, setSelectedExams] = useState<string[]>([]);
  const [selectedStreams, setSelectedStreams] = useState<string[]>([]);
  const [selectedProgramModes, setSelectedProgramModes] = useState<string[]>([]);
  const [selectedCourseNames, setSelectedCourseNames] = useState<string[]>([]);

  // Hydrate from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSelectedDegrees(params.getAll("degrees"));
    setSelectedStates(params.getAll("states"));
    setSelectedCities(params.getAll("cities"));
    setSelectedRanks(params.getAll("ranks"));
    setSelectedFees(params.getAll("fees"));
    setSelectedOwnerships(params.getAll("ownerships"));
    setSelectedAffiliations(params.getAll("affiliations"));
    setSelectedApprovals(params.getAll("approvals"));
    setSelectedExams(params.getAll("exams"));
    setSelectedStreams(params.getAll("streams"));
    setSelectedProgramModes(params.getAll("programModes"));
    setSelectedCourseNames(params.getAll("courseNames"));
    setMounted(true);
    console.log("Initial filters from URL:", {
      degrees: params.getAll("degrees"),
      states: params.getAll("states"),
      cities: params.getAll("cities"),
      ranks: params.getAll("ranks"),
      fees: params.getAll("fees"),
      ownerships: params.getAll("ownerships"),
      affiliations: params.getAll("affiliations"),
      approvals: params.getAll("approvals"),
      exams: params.getAll("exams"),
      streams: params.getAll("streams"),
      programModes: params.getAll("programModes"),
      courseNames: params.getAll("courseNames"),
    });
  }, []);

  // Update URL when any filter changes
  const handleFilterChange = (filters: any) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.keys(filters).forEach((key) => {
      params.delete(key);
      filters[key].forEach((val: string) => {
        if (val) params.append(key, val);
      });
    });

    console.log("Updated filters:", filters);
    console.log("Final filter payload sent to backend:", filters);

    router.push(`${pathname}?${params.toString()}`);
    onFilterChange(filters); // Optional: inform parent if needed
  };

  // Clear all filters handler
  const clearAllFilters = () => {
    setSelectedDegrees([]);
    setSelectedStates([]);
    setSelectedCities([]);
    setSelectedRanks([]);
    setSelectedFees([]);
    setSelectedOwnerships([]);
    setSelectedAffiliations([]);
    setSelectedApprovals([]);
    setSelectedExams([]);
    setSelectedStreams([]);
    setSelectedProgramModes([]);
    setSelectedCourseNames([]);

    // Clear all params from URL
    router.push(pathname);
    onFilterChange({}); // Notify parent with empty filters
  };

  if (!mounted) return null;

   return (
   <div className="w-[300px] max-w-sm bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-800">Filter Colleges</h1>
        <button
          onClick={clearAllFilters}
          className="text-sm text-blue-600 hover:underline"
          aria-label="Clear all filters"
        >
          Clear Filter
        </button>
      </div>
      <div className="space-y-5 overflow-y-auto max-h-[calc(190vh-50px)] pr-2">
        <FilterSectionWrapper title="Courses">
          <div className="max-h-40 overflow-y-auto">
            {degrees.map(({ _id, name }) => (
              <label key={_id} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800">
                <input
                  type="checkbox"
                  checked={selectedDegrees.includes(_id)}
                  onChange={() =>
                    handleCheckboxChange(
                      _id,
                      selectedDegrees,
                      setSelectedDegrees,
                      (updated) => handleFilterChange({ degrees: updated })
                    )
                  }
                  className="accent-blue-600 h-4 w-4 rounded"
                />
                {name}
              </label>
            ))}
          </div>
        </FilterSectionWrapper>
        <FilterSectionWrapper title="Program Mode">
          <div className="max-h-40 overflow-y-auto">
            {programModes.map(({ _id, name }) => (
              <label key={_id} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800">
                <input
                  type="checkbox"
                  checked={selectedProgramModes.includes(_id)}
                  onChange={() =>
                    handleCheckboxChange(
                      _id,
                      selectedProgramModes,
                      setSelectedProgramModes,
                      (updated) => handleFilterChange({ programModes: updated })
                    )
                  }
                  className="accent-blue-600 h-4 w-4 rounded"
                />
                {name}
              </label>
            ))}
          </div>
        </FilterSectionWrapper>
        {renderFilterSection("Specialization", courseNames, selectedCourseNames, setSelectedCourseNames, handleFilterChange)}
        {renderFilterSection("State", states, selectedStates, setSelectedStates, handleFilterChange)}
        {renderFilterSection("City", cities, selectedCities, setSelectedCities, handleFilterChange)}
        {renderFilterSection("Rank", rankRanges, selectedRanks, setSelectedRanks, handleFilterChange)}
        {renderFilterSection("Total Fees", feeRanges, selectedFees, setSelectedFees, handleFilterChange)}
        <FilterSectionWrapper title="Ownership">
          <div className="max-h-40 overflow-y-auto">
            {ownerships.map(({ _id, name }) => (
              <label key={_id} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800">
                <input
                  type="checkbox"
                  checked={selectedOwnerships.includes(_id)}
                  onChange={() =>
                    handleCheckboxChange(
                      _id,
                      selectedOwnerships,
                      setSelectedOwnerships,
                      (updated) => handleFilterChange({ ownerships: updated })
                    )
                  }
                  className="accent-blue-600 h-4 w-4 rounded"
                />
                {name}
              </label>
            ))}
          </div>
        </FilterSectionWrapper>
        <FilterSectionWrapper title="Affiliated By">
          <div className="max-h-40 overflow-y-auto">
            {affiliations.map(({ _id, name }) => (
              <label key={_id} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800">
                <input
                  type="checkbox"
                  checked={selectedAffiliations.includes(_id)}
                  onChange={() =>
                    handleCheckboxChange(
                      _id,
                      selectedAffiliations,
                      setSelectedAffiliations,
                      (updated) => handleFilterChange({ affiliations: updated })
                    )
                  }
                  className="accent-blue-600 h-4 w-4 rounded"
                />
                {name}
              </label>
            ))}
          </div>
        </FilterSectionWrapper>
        <FilterSectionWrapper title="Approval">
          <div className="max-h-40 overflow-y-auto">
            {approvals.map(({ _id, code }) => (
              <label key={_id} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800">
                <input
                  type="checkbox"
                  checked={selectedApprovals.includes(_id)}
                  onChange={() =>
                    handleCheckboxChange(
                      _id,
                      selectedApprovals,
                      setSelectedApprovals,
                      (updated) => handleFilterChange({ approvals: updated })
                    )
                  }
                  className="accent-blue-600 h-4 w-4 rounded"
                />
                {code}
              </label>
            ))}
          </div>
        </FilterSectionWrapper>
        <FilterSectionWrapper title="Exams Accepted">
          <div className="max-h-40 overflow-y-auto">
            {exams.map(({ _id, code }) => (
              <label key={_id} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800">
                <input
                  type="checkbox"
                  checked={selectedExams.includes(_id)}
                  onChange={() =>
                    handleCheckboxChange(
                      _id,
                      selectedExams,
                      setSelectedExams,
                      (updated) => handleFilterChange({ exams: updated })
                    )
                  }
                  className="accent-blue-600 h-4 w-4 rounded"
                />
                {code}
              </label>
            ))}
          </div>
        </FilterSectionWrapper>
        <FilterSectionWrapper title="Stream">
          <div className="max-h-40 overflow-y-auto">
            {streams.map(({ _id, name }) => (
              <label key={_id} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800">
                <input
                  type="checkbox"
                  checked={selectedStreams.includes(_id)}
                  onChange={() =>
                    handleCheckboxChange(
                      _id,
                      selectedStreams,
                      setSelectedStreams,
                      (updated) => handleFilterChange({ streams: updated })
                    )
                  }
                  className="accent-blue-600 h-4 w-4 rounded"
                />
                {name}
              </label>
            ))}
          </div>
        </FilterSectionWrapper>
      </div>
    </div>
  );
};
export default CombinedFilterSidebar;

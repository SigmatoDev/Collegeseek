"use client";

import { useState, useEffect } from "react";
import { useCourseFilters } from "./useCourseFilters";
import { useCollegeFilters } from "./useCollegeFilters";
import { FilterSectionWrapper, renderFilterSection, handleCheckboxChange } from "./filterHelpers";

const feeRanges = [
  "Below 50,000",
  "50,000 - 1,00,000",
  "1,00,000 - 1,50,000",
  "Above 1,50,000",
];

interface CombinedFilterSidebarProps {
  onFilterChange: (filters: any) => void;
}

const CombinedFilterSidebar = ({ onFilterChange }: CombinedFilterSidebarProps) => {
  const [mounted, setMounted] = useState(false);

  const { degrees, modes, courseNames } = useCourseFilters();
  const {
    states,
    cities,
    ranks,
    ownerships,
    affiliations,
    approvals,
    exams,
    streams,
  } = useCollegeFilters();

  const [selectedDegrees, setSelectedDegrees] = useState<string[]>([]);
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectedRanks, setSelectedRanks] = useState<number[]>([]);
  const [selectedFees, setSelectedFees] = useState<string[]>([]);
  const [selectedOwnerships, setSelectedOwnerships] = useState<string[]>([]);
  const [selectedAffiliations, setSelectedAffiliations] = useState<string[]>([]);
  const [selectedApprovals, setSelectedApprovals] = useState<string[]>([]);
  const [selectedExams, setSelectedExams] = useState<string[]>([]);
  const [selectedStreams, setSelectedStreams] = useState<string[]>([]);
  const [selectedModes, setSelectedModes] = useState<string[]>([]);
  const [selectedCourseNames, setSelectedCourseNames] = useState<string[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleFilterChange = (filters: any) => {
    const combined = {
      degrees: filters.degrees ?? selectedDegrees,
      modes: filters.modes ?? selectedModes,
      courseNames: filters.courseNames ?? selectedCourseNames,
      states: filters.states ?? selectedStates,
      cities: filters.cities ?? selectedCities,
      ranks: filters.ranks ?? selectedRanks,
      fees: filters.fees ?? selectedFees,
      ownerships: filters.ownerships ?? selectedOwnerships,
      affiliations: filters.affiliations ?? selectedAffiliations,
      approvals: filters.approvals ?? selectedApprovals,
      exams: filters.exams ?? selectedExams,
      streams: filters.streams ?? selectedStreams,
    };
    onFilterChange(combined);
  };

  if (!mounted) return null;

  return (
    <div className="w-[300px] max-w-sm bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-6">
      <h1 className="text-xl font-semibold text-gray-800">Filter Colleges</h1>

      <div className="space-y-5 overflow-y-auto max-h-[calc(150vh-50px)] pr-2">
        <FilterSectionWrapper title="Degree">
          <div className="max-h-40 overflow-y-auto">
            {degrees.map(({ _id, name }) => (
              <label
                key={_id}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
              >
                <input
                  type="checkbox"
                  checked={selectedDegrees.includes(_id)}
                  onChange={() =>
                    handleCheckboxChange<string>(
                      _id,
                      selectedDegrees,
                      setSelectedDegrees,
                      (updated: string[]) => handleFilterChange({ degrees: updated })
                    )
                  }
                  className="accent-blue-600 h-4 w-4 rounded"
                />
                {name}
              </label>
            ))}
          </div>
        </FilterSectionWrapper>
        {renderFilterSection("Mode", modes, selectedModes, setSelectedModes, handleFilterChange)}
        {renderFilterSection("Course", courseNames, selectedCourseNames, setSelectedCourseNames, handleFilterChange)}
        {renderFilterSection("State", states, selectedStates, setSelectedStates, handleFilterChange)}
        {renderFilterSection("City", cities, selectedCities, setSelectedCities, handleFilterChange)}
        {renderFilterSection("Rank", ranks, selectedRanks, setSelectedRanks, handleFilterChange)}
        {renderFilterSection("Fee", feeRanges, selectedFees, setSelectedFees, handleFilterChange)}
        {renderFilterSection("Ownership", ownerships.map(({ _id }) => _id), selectedOwnerships, setSelectedOwnerships, handleFilterChange)}
        {renderFilterSection("Affiliation", affiliations.map(({ _id }) => _id), selectedAffiliations, setSelectedAffiliations, handleFilterChange)}
        {renderFilterSection("Approval", approvals.map(({ _id }) => _id), selectedApprovals, setSelectedApprovals, handleFilterChange)}
        {renderFilterSection("Exam", exams.map(({ _id }) => _id), selectedExams, setSelectedExams, handleFilterChange)}
        {renderFilterSection("Stream", streams.map(({ _id }) => _id), selectedStreams, setSelectedStreams, handleFilterChange)}
      </div>
    </div>
  );
};

export default CombinedFilterSidebar;

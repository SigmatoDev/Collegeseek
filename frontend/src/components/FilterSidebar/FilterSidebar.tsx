"use client";

import { useState, useEffect } from "react";
import { api_url } from "@/utils/apiCall";

const feeRanges = [
  "Below 50,000",
  "50,000 - 1,00,000",
  "1,00,000 - 1,50,000",
  "Above 1,50,000",
];

interface CombinedFilterSidebarProps {
  onFilterChange: (filters: any) => void;
}

interface DegreeOption {
  _id: string;
  name: string;
}

const CombinedFilterSidebar = ({ onFilterChange }: CombinedFilterSidebarProps) => {
  const [mounted, setMounted] = useState(false);
  const [degrees, setDegrees] = useState<DegreeOption[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [ranks, setRanks] = useState<number[]>([]);

  const [selectedDegrees, setSelectedDegrees] = useState<string[]>([]);
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectedRanks, setSelectedRanks] = useState<number[]>([]);
  const [selectedFees, setSelectedFees] = useState<string[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const courseRes = await fetch(`${api_url}c/courses`);
        const courseData = await courseRes.json();

        const degreeMap = new Map<string, string>();
        courseData.forEach((course: any) => {
          if (course.category && course.category._id && course.category.name) {
            degreeMap.set(course.category._id, course.category.name);
          }
        });

        const degreeList = Array.from(degreeMap.entries()).map(([id, name]) => ({
          _id: id,
          name,
        }));
        setDegrees(degreeList);

        const collegeRes = await fetch(`${api_url}f/college`);
        const { data } = await collegeRes.json();

        const stateSet = new Set<string>();
        const citySet = new Set<string>();
        const rankSet = new Set<number>();

        data.forEach((college: any) => {
          if (college.state) stateSet.add(college.state);
          if (college.city) citySet.add(college.city);
          if (college.rank) rankSet.add(college.rank);
        });

        setStates(Array.from(stateSet));
        setCities(Array.from(citySet));
        setRanks(Array.from(rankSet).sort((a, b) => a - b));
      } catch (error) {
        console.error("Error fetching filter data:", error);
      }
    };

    fetchFilters();
  }, []);

  const toggle = <T extends string | number>(value: T, array: T[]): T[] =>
    array.includes(value) ? array.filter((v) => v !== value) : [...array, value];

  const handleCheckboxChange = <T extends string | number>(
    value: T,
    selected: T[],
    setSelected: (val: T[]) => void,
    updateFilterState: (updated: T[]) => void
  ) => {
    const updated = toggle(value, selected);
    setSelected(updated);
    updateFilterState(updated);
  };

  const handleFilterChange = (filters: any) => {
    const combined = {
      degrees: filters.degrees ?? selectedDegrees,
      states: filters.states ?? selectedStates,
      cities: filters.cities ?? selectedCities,
      ranks: filters.ranks ?? selectedRanks,
      fees: filters.fees ?? selectedFees,
    };
    onFilterChange(combined);
  };

  if (!mounted) return null;

  const FilterSectionWrapper = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <div className="space-y-3">
      <h2 className="text-sm font-medium text-gray-700 uppercase tracking-wide border-b pb-1">
        {title}
      </h2>
      <div className="space-y-2">{children}</div>
    </div>
  );
  const renderDegreeFilterSection = () => (
    <FilterSectionWrapper title="Degree">
      <div className="max-h-40 overflow-y-auto"> {/* Added scrollable area here */}
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
  );
  

  const renderFilterSection = <T extends string | number>(
    title: string,
    items: T[],
    selected: T[],
    setSelected: (val: T[]) => void,
    filterKey: keyof typeof filterHandlers
  ) => (
    <FilterSectionWrapper title={title}>
      <div className="max-h-40 overflow-y-auto"> {/* Added scrollable area here */}
        {items.map((item, index) => (
          <label
            key={index}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
          >
            <input
              type="checkbox"
              checked={selected.includes(item)}
              onChange={() =>
                handleCheckboxChange<T>(
                  item,
                  selected,
                  setSelected,
                  (updated) => handleFilterChange({ [filterKey]: updated })
                )
              }
              className="accent-blue-600 h-4 w-4 rounded"
            />
            {String(item)}
          </label>
        ))}
      </div>
    </FilterSectionWrapper>
  );

  const filterHandlers = {
    degrees: setSelectedDegrees,
    states: setSelectedStates,
    cities: setSelectedCities,
    ranks: setSelectedRanks,
    fees: setSelectedFees,
  };

  return (
    <div className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-6">
      <h1 className="text-xl font-semibold text-gray-800">Filter Colleges</h1>

      <div className="space-y-5 overflow-y-auto max-h-[calc(150vh-50px)] pr-2">
        {renderDegreeFilterSection()}
        {renderFilterSection("State", states, selectedStates, setSelectedStates, "states")}
        {renderFilterSection("City", cities, selectedCities, setSelectedCities, "cities")}
        {renderFilterSection("Rank", ranks, selectedRanks, setSelectedRanks, "ranks")}
        {renderFilterSection("Fee", feeRanges, selectedFees, setSelectedFees, "fees")}
      </div>
    </div>
  );
};

export default CombinedFilterSidebar;

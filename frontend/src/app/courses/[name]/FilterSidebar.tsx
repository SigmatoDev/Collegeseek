import React, { useState, useEffect, useCallback } from "react";
import { api_url } from "@/utils/apiCall";

interface FilterSidebarProps {
  onFilterChange: (filters: any) => void;
  courseName: string;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ onFilterChange, courseName }) => {
  const [durations, setDurations] = useState<string[]>([]);
  const [modes, setModes] = useState<string[]>([]);

  const [selectedDurations, setSelectedDurations] = useState<string[]>([]);
  const [selectedModes, setSelectedModes] = useState<string[]>([]);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        console.log("Fetching filters for course:", courseName);
        const res = await fetch(`${api_url}get/courses/filters?name=${courseName}`);
        const data = await res.json();
        console.log("Fetched data:", data);

        setDurations(data.durations || []);
        setModes(data.modes || []);
      } catch (error) {
        console.error("Failed to fetch filter data", error);
      }
    };

    if (courseName) {
      fetchFilters();
    }
  }, [courseName]);

  // Memoize the onFilterChange callback to prevent unnecessary renders
  const handleDurationChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSelectedDurations((prev) =>
        e.target.checked ? [...prev, value] : prev.filter((item) => item !== value)
      );
    },
    []
  );
  
  const handleModeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSelectedModes((prev) =>
        e.target.checked ? [...prev, value] : prev.filter((item) => item !== value)
      );
    },
    []
  );
  // Apply filters only when selectedDurations or selectedModes change
  useEffect(() => {
    const filters: any = {};
    if (selectedDurations.length) filters.duration = selectedDurations;
    if (selectedModes.length) filters.mode = selectedModes;

    // Only apply filters if there's any change in the selected filters
    if (Object.keys(filters).length > 0) {
      onFilterChange(filters);
    }
  }, [selectedDurations, selectedModes, onFilterChange]);

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

  return (
    <div className="w-[300px] max-w-sm bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-6">
      <h1 className="text-xl font-semibold text-gray-800">Filter Courses</h1>

      <div className="space-y-5 overflow-y-auto max-h-[calc(150vh-50px)] pr-2">
        {/* Duration Filter Section */}
        <FilterSectionWrapper title="Duration">
          <div className="max-h-40 overflow-y-auto">
            {durations.map((durationOption, index) => (
              <label
                key={index}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
              >
                <input
                  type="checkbox"
                  value={durationOption}
                  onChange={handleDurationChange}
                  id={`duration-${durationOption}`}
                  className="accent-blue-600 h-4 w-4 rounded"
                  checked={selectedDurations.includes(durationOption)}
                />
                {durationOption}
              </label>
            ))}
          </div>
        </FilterSectionWrapper>

        {/* Mode Filter Section */}
        <FilterSectionWrapper title="Mode">
          <div className="max-h-40 overflow-y-auto">
            {modes.map((modeOption, index) => (
              <label
                key={index}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
              >
                <input
                  type="checkbox"
                  value={modeOption}
                  onChange={handleModeChange}
                  id={`mode-${modeOption}`}
                  className="accent-blue-600 h-4 w-4 rounded"
                  checked={selectedModes.includes(modeOption)}
                />
                {modeOption}
              </label>
            ))}
          </div>
        </FilterSectionWrapper>
      </div>
    </div>
  );
};

export default FilterSidebar;

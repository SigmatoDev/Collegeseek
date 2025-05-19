"use client";
import React, { useState, useEffect, useCallback } from "react";
import { api_url } from "@/utils/apiCall";
interface FilterSidebarProps {
  onFilterChange: (filters: any) => void;
  courseName: string;
}
const FilterSidebar: React.FC<FilterSidebarProps> = ({
  onFilterChange,
  courseName,
}) => {
  const [durations, setDurations] = useState<string[]>([]);
  const [modes, setModes] = useState<string[]>([]);
  const [programModes, setProgramModes] = useState<
    { _id: string; name: string }[]
  >([]);
  const [colleges, setColleges] = useState<{ _id: string; name: string }[]>([]);
  const [feeLevels, setFeeLevels] = useState<
    { label: string; min: number; max: number }[]
  >([]);
  const [ratingLevels, setRatingLevels] = useState<
    { label: string; min: number; max: number }[]
  >([]);
  const [selectedDurations, setSelectedDurations] = useState<string[]>([]);
  const [selectedModes, setSelectedModes] = useState<string[]>([]);
  const [selectedProgramModes, setSelectedProgramModes] = useState<string[]>(
    []
  );
  const [selectedColleges, setSelectedColleges] = useState<string[]>([]);
  const [selectedFeeLevels, setSelectedFeeLevels] = useState<string[]>([]);
  const [selectedRatingLevels, setSelectedRatingLevels] = useState<string[]>(
    []
  );
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const res = await fetch(
          `${api_url}get/courses/filters?name=${courseName}`
        );
        const data = await res.json();
        setDurations(data.durations || []);
        setModes(data.modes || []);
        setProgramModes(data.programModes || []);
        setColleges(data.colleges || []);
        setFeeLevels(data.feeLevels || []);
        setRatingLevels(data.ratingLevels || []);
      } catch (error) {
        console.error("Failed to fetch filter data", error);
      }
    };
    if (courseName) {
      fetchFilters();
    }
  }, [courseName]);
  useEffect(() => {
    const filters: any = {};
    if (selectedDurations.length) filters.duration = selectedDurations;
    if (selectedModes.length) filters.mode = selectedModes;
    if (selectedProgramModes.length) filters.programMode = selectedProgramModes;
    if (selectedColleges.length) filters.colleges = selectedColleges;
    if (selectedFeeLevels.length) filters.feeLevels = selectedFeeLevels;
    if (selectedRatingLevels.length)
      filters.ratingLevels = selectedRatingLevels;
    onFilterChange(filters);
  }, [
    selectedDurations,
    selectedModes,
    selectedProgramModes,
    selectedColleges,
    selectedFeeLevels,
    selectedRatingLevels,
    onFilterChange,
  ]);
  const handleCheckboxChange = (
    value: string,
    state: string[],
    setState: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setState((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };
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
      <div className="space-y-5 pr-2 max-h-[80vh] overflow-y-auto">
        {/* Program Mode Filter */}
        <FilterSectionWrapper title="Program Mode">
          {programModes.map((p) => (
            <label
              key={p._id}
              className="flex items-center gap-2 text-sm text-gray-600"
            >
              <input
                type="checkbox"
                value={p._id}
                onChange={() =>
                  handleCheckboxChange(
                    p._id,
                    selectedProgramModes,
                    setSelectedProgramModes
                  )
                }
                className="accent-blue-600 h-4 w-4 rounded"
                checked={selectedProgramModes.includes(p._id)}
              />
              {p.name}
            </label>
          ))}
        </FilterSectionWrapper>
        {/* Duration Filter */}
        <FilterSectionWrapper title="Duration">
          {durations.map((d, i) => (
            <label
              key={i}
              className="flex items-center gap-2 text-sm text-gray-600"
            >
              <input
                type="checkbox"
                value={d}
                onChange={() =>
                  handleCheckboxChange(
                    d,
                    selectedDurations,
                    setSelectedDurations
                  )
                }
                className="accent-blue-600 h-4 w-4 rounded"
                checked={selectedDurations.includes(d)}
              />
              {d}
            </label>
          ))}
        </FilterSectionWrapper>
        {/* College Filter */}
        <FilterSectionWrapper title="College">
          <div className="max-h-40 overflow-y-auto pr-1">
            {colleges.map((c) => (
              <label
                key={c._id}
                className="flex items-center gap-2 text-sm text-gray-600"
              >
                <input
                  type="checkbox"
                  value={c._id}
                  onChange={() =>
                    handleCheckboxChange(
                      c._id,
                      selectedColleges,
                      setSelectedColleges
                    )
                  }
                  className="accent-blue-600 h-4 w-4 rounded"
                  checked={selectedColleges.includes(c._id)}
                />
                {c.name}
              </label>
            ))}
          </div>
        </FilterSectionWrapper>
        {/* Fee Levels */}
        <FilterSectionWrapper title="Fee Range">
          {feeLevels.map((f, i) => {
            const stringified = JSON.stringify(f);
            return (
              <label
                key={i}
                className="flex items-center gap-2 text-sm text-gray-600"
              >
                <input
                  type="checkbox"
                  value={stringified}
                  onChange={() =>
                    handleCheckboxChange(
                      stringified,
                      selectedFeeLevels,
                      setSelectedFeeLevels
                    )
                  }
                  className="accent-blue-600 h-4 w-4 rounded"
                  checked={selectedFeeLevels.includes(stringified)}
                />
                {f.label}
              </label>
            );
          })}
        </FilterSectionWrapper>
        {/* Rating Levels */}
        {/* <FilterSectionWrapper title="Rating">
         {ratingLevels.map((r, i) => {
  const stringified = JSON.stringify(r);
  return (
    <label key={i} className="flex items-center gap-2 text-sm text-gray-600">
      <input
        type="checkbox"
        value={stringified}
        onChange={() =>
          handleCheckboxChange(stringified, selectedRatingLevels, setSelectedRatingLevels)
        }
        className="accent-blue-600 h-4 w-4 rounded"
        checked={selectedRatingLevels.includes(stringified)}
      />
      {r.label}
    </label>
  );
})}
        </FilterSectionWrapper> */}
      </div>
    </div>
  );
};
export default FilterSidebar;
"use client";

import { useEffect, useState } from "react";
import { Loader2, SlidersHorizontal } from "lucide-react";
import { api_url } from "@/utils/apiCall";
import {
  FilterRangeOption,
  feeRangeOptions,
  durationRangeOptions,
} from "./filterOptions";

interface StreamOption {
  _id: string;
  name: string;
}

interface ProgramModeOption {
  _id: string;
  name: string;
}

interface CourseFiltersSidebarProps {
  selectedStreams: string[];
  onStreamsChange: (ids: string[]) => void;
  selectedFeeRanges: string[];
  onFeeRangeChange: (ids: string[]) => void;
  selectedCourseTypes: string[];
  onCourseTypeChange: (ids: string[]) => void;
  selectedDurations: string[];
  onDurationChange: (ids: string[]) => void;
  onClearFilters: () => void;
}

const CourseFiltersSidebar: React.FC<CourseFiltersSidebarProps> = ({
  selectedStreams,
  onStreamsChange,
  selectedFeeRanges,
  onFeeRangeChange,
  selectedCourseTypes,
  onCourseTypeChange,
  selectedDurations,
  onDurationChange,
  onClearFilters,
}) => {
  const [streams, setStreams] = useState<StreamOption[]>([]);
  const [programModes, setProgramModes] = useState<ProgramModeOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFilters = async () => {
      console.log("📡 Fetching course filter data...");

      try {
        const [streamsRes, programModeRes] = await Promise.all([
          fetch(`${api_url}get2/streams`),
          fetch(`${api_url}get/program/`),
        ]);

        const streamsData = await streamsRes.json();
        const modesData = await programModeRes.json();

        console.log("✅ Raw Streams API Response:", streamsData);
        console.log("✅ Raw Program Modes API Response:", modesData);

        const resolvedStreams = Array.isArray(streamsData)
          ? streamsData
          : Array.isArray(streamsData?.data)
          ? streamsData.data
          : [];

        const resolvedModes = Array.isArray(modesData)
          ? modesData
          : Array.isArray(modesData?.data)
          ? modesData.data
          : [];

        console.log("🔍 Resolved Streams:", resolvedStreams);
        console.log("🔍 Resolved Program Modes:", resolvedModes);

        setStreams(resolvedStreams);
        setProgramModes(resolvedModes);
      } catch (error) {
        console.error("❌ Failed to load course filters", error);
      } finally {
        setLoading(false);
        console.log("⏹️ Filter loading finished");
      }
    };

    fetchFilters();
  }, []);

  const toggleSelection = (
    currentValues: string[],
    setter: (next: string[]) => void,
    value: string
  ) => {
    const updatedValues = currentValues.includes(value)
      ? currentValues.filter((item) => item !== value)
      : [...currentValues, value];

    console.log("🔁 Toggled value:", value);
    console.log("📦 Updated values:", updatedValues);

    setter(updatedValues);
  };

  const renderCheckboxList = (
    options: { _id: string; name: string }[],
    selectedValues: string[],
    onChange: (value: string) => void
  ) => {
    if (loading) {
      return (
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading options
        </div>
      );
    }

    if (!options.length) {
      console.log("⚠️ No options available for checkbox list");
      return <p className="text-xs text-slate-500">No options available yet.</p>;
    }

    return (
      <div className="space-y-1.5">
        {options.map((option) => (
          <label
            key={option._id}
            className="flex cursor-pointer items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700 transition hover:bg-[#ede9fe]"
          >
            <input
              type="checkbox"
              className="h-4 w-4 cursor-pointer rounded border-slate-300 text-[#6a4de7] focus:ring-[#6a4de7]"
              checked={selectedValues.includes(option._id)}
              onChange={() => {
                console.log("☑️ Checkbox clicked:", option);
                onChange(option._id);
              }}
            />
            <span>{option.name}</span>
          </label>
        ))}
      </div>
    );
  };

  const renderRangeOptions = (
    options: FilterRangeOption[],
    selectedValues: string[],
    onChange: (value: string) => void
  ) => (
    <div className="space-y-1.5">
      {options.map((option) => (
        <label
          key={option.id}
          className={`flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
            selectedValues.includes(option.id)
              ? "bg-[#ede9fe] text-[#4c1d95]"
              : "bg-slate-50 text-slate-700"
          }`}
        >
          <input
            type="checkbox"
            className="h-4 w-4 cursor-pointer rounded border-slate-300 text-[#6a4de7] focus:ring-[#6a4de7]"
            checked={selectedValues.includes(option.id)}
            onChange={() => {
              console.log("📏 Range option selected:", option);
              onChange(option.id);
            }}
          />
          <span>{option.label}</span>
        </label>
      ))}
    </div>
  );

  return (
    <aside className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm lg:sticky lg:top-24">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
          <SlidersHorizontal className="h-4 w-4 text-[#635dc1]" />
          Refine Results
        </div>
        <button
          type="button"
          onClick={() => {
            console.log("🧹 Clear all filters clicked");
            onClearFilters();
          }}
          className="text-xs font-medium text-[#635dc1] underline-offset-2 hover:underline"
        >
          Clear all
        </button>
      </div>

      <div className="space-y-4">
        <section>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Stream
          </p>
          <div className="max-h-44 space-y-2 overflow-y-auto pr-1">
            {renderCheckboxList(streams, selectedStreams, (value) =>
              toggleSelection(selectedStreams, onStreamsChange, value)
            )}
          </div>
        </section>

        <section>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Avg Fee / Year
          </p>
          {renderRangeOptions(feeRangeOptions, selectedFeeRanges, (value) =>
            toggleSelection(selectedFeeRanges, onFeeRangeChange, value)
          )}
        </section>

        <section>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Course Type
          </p>
          {renderCheckboxList(programModes, selectedCourseTypes, (value) =>
            toggleSelection(selectedCourseTypes, onCourseTypeChange, value)
          )}
        </section>

        <section>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Course Duration
          </p>
          {renderRangeOptions(durationRangeOptions, selectedDurations, (value) =>
            toggleSelection(selectedDurations, onDurationChange, value)
          )}
        </section>
      </div>
    </aside>
  );
};

export default CourseFiltersSidebar;

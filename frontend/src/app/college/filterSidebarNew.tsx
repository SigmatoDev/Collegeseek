"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
interface FilterItem {
  name: string;
  count: number;
  state?: string;
}
interface CourseFeesItem {
  range: string;
  count: number;
}
interface CombinedFilterResponse {
  states?: FilterItem[];
  cities?: FilterItem[];
  streams?: FilterItem[];
  ownerships?: FilterItem[];
  exams?: FilterItem[];
  approvals?: FilterItem[];
  affiliatedBy?: FilterItem[];
  categories?: FilterItem[];
  specializations?: FilterItem[];
  programModes?: FilterItem[];
  fees?: CourseFeesItem[];
}
const FILTER_SECTIONS: { key: keyof CombinedFilterResponse; label: string }[] =
  [
    { key: "states", label: "State" },
    { key: "cities", label: "City" },
    { key: "streams", label: "Stream" },
    { key: "ownerships", label: "Ownership" },
    { key: "exams", label: "Exams Accepted" },
    { key: "approvals", label: "Approvals" },
    { key: "affiliatedBy", label: "Affiliated By" },
    { key: "categories", label: "Course Category" },
    { key: "specializations", label: "Specialization" },
    { key: "programModes", label: "Program Mode" },
  ];
export default function FilterSidebarNew({
  filters,
  selectedFilters = {},
  onFilterChange,
}: {
  filters: CombinedFilterResponse;
  selectedFilters?: { [key: string]: string[] };
  onFilterChange: (filters: { [key: string]: string[] }) => void;
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<{ [key: string]: Set<string> }>({});
  // Sync from URL (only when selectedFilters change)
  useEffect(() => {
    const converted: { [key: string]: Set<string> } = {};
    for (const key in selectedFilters) {
      converted[key] = new Set(selectedFilters[key]);
    }
    setSelected(converted);
  }, [selectedFilters]);
  const toggleSelect = (
    section: string,
    value: string,
    parentState?: string
  ) => {
    setSelected((prev) => {
      const newSet = new Set(prev[section] || []);
      if (newSet.has(value)) {
        newSet.delete(value);
      } else {
        newSet.add(value);
      }
      const updated = { ...prev, [section]: newSet };
      if (section === "cities" && parentState) {
        const stateSet = new Set(updated.states || []);
        stateSet.add(parentState);
        updated.states = stateSet;
      }
      // Construct plain object to pass up
      const filterObj: { [key: string]: string[] } = {};
      Object.entries(updated).forEach(([key, set]) => {
        if (set.size > 0) filterObj[key] = Array.from(set);
      });
      // Trigger only on user interaction
      onFilterChange(filterObj);
      return updated;
    });
  };
  const clearFilters = () => {
    setSelected({});
    onFilterChange({});
    router.push("/college");
  };
  if (!filters) return <div className="p-4">Loading filters...</div>;
  const hasActiveFilters = Object.values(selected).some((set) => set.size > 0);
  const getListClassName = (length: number) =>
    length > 5
      ? "space-y-1 max-h-48 overflow-y-auto border-t border-gray-100 pt-2 scrollbar-thin scrollbar-thumb-gray-300"
      : "space-y-1 max-h-48 overflow-y-auto border-t border-gray-100 pt-2 scrollbar-thin scrollbar-thumb-gray-300";
  return (
    <aside className="w-full lg:w-[300px] max-w-sm bg-white p-6 rounded-2xl border border-gray-200 space-y-6 overflow-y-auto max-h-[calc(235vh-50px)] shadow-lg lg:sticky lg:top-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Filters</h2>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:underline"
          >
            Clear All
          </button>
        )}
      </div>
      <div className="space-y-6">
        {FILTER_SECTIONS.map(({ key, label }) =>
          filters[key] && Array.isArray(filters[key]) ? (
            <div key={key}>
              <h3 className="font-medium text-gray-700 mb-2">{label}</h3>
              <ul
                className={`${getListClassName(
                  (filters[key] as FilterItem[]).length
                )} pl-0 space-y-2`}
              >
                {(filters[key] as FilterItem[]).map((item, index) => {
                  const isSelected = selected[key]?.has(item.name) || false;
                  return (
                    <li
                      key={`${key}-${item.name}-${index}`}
                      onClick={() =>
                        toggleSelect(
                          key,
                          item.name,
                          key === "cities" ? item.state : undefined
                        )
                      }
                      className={`flex cursor-pointer items-center justify-between py-0.8 font-semibold border px-3 text-sm text-gray-600 transition bg-[#eaeaea]/20 ${
                        isSelected
                          ? "border-[#7a6be7] bg-[#f0edff] text-[#2f2479]"
                          : "border-transparent bg-transparent text-gray-700"
                      }`}
                    >
                      <label className="flex flex-1 cursor-pointer items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => {
                            e.stopPropagation();
                            toggleSelect(
                              key,
                              item.name,
                              key === "cities" ? item.state : undefined
                            );
                          }}
                          className="h-4 w-4 rounded border-gray-300 accent-[#635dc1] focus:ring-[#635dc1]"
                        />
                        <span>
                          {item.name}{" "}
                          <span className="text-gray-500">({item.count})</span>
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null
        )}
        {filters.fees && filters.fees.length > 0 && (
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Fees</h3>
            <ul className={getListClassName(filters.fees.length)}>
              {filters.fees.map((item) => {
                const isSelected = selected["fees"]?.has(item.range) || false;
                return (
                  <li
                    key={item.range}
                    onClick={() => toggleSelect("fees", item.range)}
                    className={`flex cursor-pointer items-center justify-between rounded-xl border px-3 text-xs transition hover:border-[#b5a8ff] hover:bg-[#f6f5ff] ${
                      isSelected
                        ? "border-[#7a6be7] bg-[#f0edff] text-[#2f2479]"
                        : "border-transparent bg-transparent text-gray-700"
                    }`}
                  >
                    <label className="flex flex-1 cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => {
                          e.stopPropagation();
                          toggleSelect("fees", item.range);
                        }}
                        className="h-4 w-4 rounded border-gray-300 accent-[#635dc1] focus:ring-[#635dc1]"
                      />
                      <span>
                        {item.range}{" "}
                        <span className="text-gray-500">({item.count})</span>
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </aside>
  );
}

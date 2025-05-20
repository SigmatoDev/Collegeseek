"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface FilterItem {
  name: string;
  count: number;
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

const FILTER_SECTIONS: { key: keyof CombinedFilterResponse; label: string }[] = [
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

  const toggleSelect = (section: string, value: string) => {
    setSelected((prev) => {
      const newSet = new Set(prev[section] || []);
      if (newSet.has(value)) {
        newSet.delete(value);
      } else {
        newSet.add(value);
      }

      const updated = { ...prev, [section]: newSet };

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
      ? "space-y-1 max-h-32 overflow-y-auto border-t pt-2 scrollbar-thin scrollbar-thumb-gray-300"
      : "space-y-1";

  return (
    <aside className="w-[300px] max-w-sm bg-white p-6 rounded-2xl border border-gray-200 space-y-6 overflow-y-auto max-h-[calc(190vh-50px)] shadow-sm">
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
              <ul className={getListClassName((filters[key] as FilterItem[]).length)}>
                {(filters[key] as FilterItem[]).map((item) => (
                  <li
                    key={item.name}
                    className="flex items-center justify-between text-sm"
                  >
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selected[key]?.has(item.name) || false}
                        onChange={() => toggleSelect(key, item.name)}
                        className="form-checkbox accent-black"
                      />
                      <span>
                {item.name} <span className="text-gray-800">({item.count})</span>
              </span>
                    </label>
                   {/* <span className="text-gray-500">({item.count})</span> */}
                  </li>
                ))}
              </ul>
            </div>
          ) : null
        )}

        {filters.fees && filters.fees.length > 0 && (
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Fees</h3>
            <ul className={getListClassName(filters.fees.length)}>
              {filters.fees.map((item) => (
                <li
                  key={item.range}
                  className="flex items-center justify-between text-sm"
                >
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selected["fees"]?.has(item.range) || false}
                      onChange={() => toggleSelect("fees", item.range)}
                      className="form-checkbox accent-black"
                    />
                    <span>{item.range}</span>
                  </label>
                  <span className="text-gray-500">{item.count}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </aside>
  );
}

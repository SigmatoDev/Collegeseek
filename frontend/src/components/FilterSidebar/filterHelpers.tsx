import React from "react";

// Helper to toggle selection
export const toggle = <T extends string | number>(value: T, array: T[]): T[] =>
  array.includes(value) ? array.filter((v) => v !== value) : [...array, value];

// Wrapper for the filter sections
export const FilterSectionWrapper = ({
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

// Reusable function to render the filter sections
export const renderFilterSection = <T extends string | number>(
  title: string,
  items: T[],
  selected: T[],
  setSelected: (val: T[]) => void,
  handleFilterChange: (filters: any) => void
) => {
  // Explicit title-to-key mapping to match filter object keys
  const titleKeyMap: Record<string, string> = {
    Course: "courseNames",
    State: "states",
    City: "cities",
    Rank: "ranks",
    Fee: "fees",
  };

  const filterKey = titleKeyMap[title] || title.toLowerCase(); // Fallback to lowercase

  return (
    <FilterSectionWrapper title={title}>
      <div className="max-h-40 overflow-y-auto">
        {items.map((item, index) => (
          <label
            key={index}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
          >
            <input
              type="checkbox"
              checked={selected.includes(item)}
              onChange={() => {
                handleCheckboxChange<T>(
                  item,
                  selected,
                  setSelected,
                  (updated) => {
                    console.log(`Updating filter for ${filterKey}:`, updated);
                    handleFilterChange({ [filterKey]: updated });
                  }
                );
              }}
              className="accent-blue-600 h-4 w-4 rounded"
            />
            {String(item)}
          </label>
        ))}
      </div>
    </FilterSectionWrapper>
  );
};

// Helper for checkbox change
export const handleCheckboxChange = <T extends string | number>(
  value: T,
  selected: T[],
  setSelected: (val: T[]) => void,
  updateFilterState: (updated: T[]) => void
) => {
  const updated = toggle(value, selected);
  setSelected(updated);
  updateFilterState(updated); // Trigger immediate filter update
};

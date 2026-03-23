// "use client";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// interface FilterItem {
//   name: string;
//   count: number;
//   state?: string;
// }
// interface CourseFeesItem {
//   range: string;
//   count: number;
// }
// interface CombinedFilterResponse {
//   states?: FilterItem[];
//   cities?: FilterItem[];
//   streams?: FilterItem[];
//   ownerships?: FilterItem[];
//   exams?: FilterItem[];
//   approvals?: FilterItem[];
//   affiliatedBy?: FilterItem[];
//   categories?: FilterItem[];
//   specializations?: FilterItem[];
//   programModes?: FilterItem[];
//   fees?: CourseFeesItem[];
// }
// const FILTER_SECTIONS: { key: keyof CombinedFilterResponse; label: string }[] =
//   [
//     { key: "states", label: "State" },
//     { key: "cities", label: "City" },
//     { key: "streams", label: "Stream" },
//     { key: "ownerships", label: "Ownership" },
//     { key: "exams", label: "Exams Accepted" },
//     { key: "approvals", label: "Approvals" },
//     { key: "affiliatedBy", label: "Affiliated By" },
//     { key: "categories", label: "Course Category" },
//     { key: "specializations", label: "Specialization" },
//     { key: "programModes", label: "Program Mode" },
//   ];
// export default function FilterSidebarNew({
//   filters,
//   selectedFilters = {},
//   onFilterChange,
// }: {
//   filters: CombinedFilterResponse;
//   selectedFilters?: { [key: string]: string[] };
//   onFilterChange: (filters: { [key: string]: string[] }) => void;
// }) {
//   const router = useRouter();
//   const [selected, setSelected] = useState<{ [key: string]: Set<string> }>({});
//   // Sync from URL (only when selectedFilters change)
//   useEffect(() => {
//     const converted: { [key: string]: Set<string> } = {};
//     for (const key in selectedFilters) {
//       converted[key] = new Set(selectedFilters[key]);
//     }
//     setSelected(converted);
//   }, [selectedFilters]);
//   const toggleSelect = (
//     section: string,
//     value: string,
//     parentState?: string,
//   ) => {
//     setSelected((prev) => {
//       const newSet = new Set(prev[section] || []);
//       if (newSet.has(value)) {
//         newSet.delete(value);
//       } else {
//         newSet.add(value);
//       }
//       const updated = { ...prev, [section]: newSet };
//       if (section === "cities" && parentState) {
//         const stateSet = new Set(updated.states || []);
//         stateSet.add(parentState);
//         updated.states = stateSet;
//       }
//       // Construct plain object to pass up
//       const filterObj: { [key: string]: string[] } = {};
//       Object.entries(updated).forEach(([key, set]) => {
//         if (set.size > 0) filterObj[key] = Array.from(set);
//       });
//       // Trigger only on user interaction
//       onFilterChange(filterObj);
//       return updated;
//     });
//   };
//   const clearFilters = () => {
//     setSelected({});
//     onFilterChange({});
//     router.push("/college");
//   };
//   if (!filters) return <div className="p-4">Loading filters...</div>;
//   const hasActiveFilters = Object.values(selected).some((set) => set.size > 0);
//   const getListClassName = (length: number) =>
//     length > 5
//       ? "space-y-1 max-h-48 overflow-y-auto border-t border-gray-100 pt-2 scrollbar-thin scrollbar-thumb-gray-300"
//       : "space-y-1 max-h-48 overflow-y-auto border-t border-gray-100 pt-2 scrollbar-thin scrollbar-thumb-gray-300";
//   return (
//     <aside className="w-full lg:w-[300px] max-w-sm bg-white p-6 rounded-2xl border border-gray-200 space-y-6 overflow-y-auto max-h-[calc(310vh-50px)] shadow-lg lg:sticky lg:top-6">
//       <div className="flex items-center justify-between mb-4">
//         <h2 className="text-lg font-semibold">Filters</h2>
//         {hasActiveFilters && (
//           <button
//             onClick={clearFilters}
//             className="text-sm text-blue-600 hover:underline"
//           >
//             Clear All
//           </button>
//         )}
//       </div>
//       <div className="space-y-6">
//         {FILTER_SECTIONS.map(({ key, label }) =>
//           filters[key] && Array.isArray(filters[key]) ? (
//             <div key={key}>
//               <h3 className="font-medium text-gray-700 mb-2">{label}</h3>
//               <ul
//                 className={`${getListClassName(
//                   (filters[key] as FilterItem[]).length,
//                 )} pl-0 space-y-2`}
//               >
//                 {(filters[key] as FilterItem[]).map((item, index) => {
//                   const isSelected = selected[key]?.has(item.name) || false;
//                   return (
//                     <li
//                       key={`${key}-${item.name}-${index}`}
//                       onClick={() =>
//                         toggleSelect(
//                           key,
//                           item.name,
//                           key === "cities" ? item.state : undefined,
//                         )
//                       }
//                       className={`flex cursor-pointer items-center justify-between py-0.8 font-semibold border px-3 text-sm text-gray-600 transition bg-[#eaeaea]/20 ${
//                         isSelected
//                           ? "border-[#7a6be7] bg-[#f0edff] text-[#2f2479]"
//                           : "border-transparent bg-transparent text-gray-700"
//                       }`}
//                     >
//                       <label className="flex flex-1 cursor-pointer items-center gap-2">
//                         <input
//                           type="checkbox"
//                           checked={isSelected}
//                           onClick={(e) => e.stopPropagation()}
//                           onChange={(e) => {
//                             e.stopPropagation();
//                             toggleSelect(
//                               key,
//                               item.name,
//                               key === "cities" ? item.state : undefined,
//                             );
//                           }}
//                           className="h-4 w-4 rounded border-gray-300 accent-[#635dc1] focus:ring-[#635dc1]"
//                         />
//                         <span>
//                           {item.name}{" "}
//                           <span className="text-gray-500">({item.count})</span>
//                         </span>
//                       </label>
//                     </li>
//                   );
//                 })}
//               </ul>
//             </div>
//           ) : null,
//         )}
//         {filters.fees && filters.fees.length > 0 && (
//           <div>
//             <h3 className="font-medium text-gray-700 mb-2">Fees</h3>

//             <ul
//               className={`${getListClassName(filters.fees.length)} pl-0 space-y-2`}
//             >
//               {filters.fees.map((item, index) => {
//                 const isSelected = selected["fees"]?.has(item.range) || false;

//                 return (
//                   <li
//                     key={`fees-${item.range}-${index}`}
//                     onClick={() => toggleSelect("fees", item.range)}
//                     className={`flex cursor-pointer items-center justify-between py-0.8 font-semibold border px-3 text-sm text-gray-600 transition bg-[#eaeaea]/20 ${
//                       isSelected
//                         ? "border-[#7a6be7] bg-[#f0edff] text-[#2f2479]"
//                         : "border-transparent bg-transparent text-gray-700"
//                     }`}
//                   >
//                     <label className="flex flex-1 cursor-pointer items-center gap-2">
//                       <input
//                         type="checkbox"
//                         checked={isSelected}
//                         onClick={(e) => e.stopPropagation()}
//                         onChange={(e) => {
//                           e.stopPropagation();
//                           toggleSelect("fees", item.range);
//                         }}
//                         className="h-4 w-4 rounded border-gray-300 accent-[#635dc1] focus:ring-[#635dc1]"
//                       />

//                       <span>
//                         {item.range}{" "}
//                         <span className="text-gray-500">({item.count})</span>
//                       </span>
//                     </label>
//                   </li>
//                 );
//               })}
//             </ul>
//           </div>
//         )}
//       </div>
//     </aside>
//   );
// }
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SlidersHorizontal, X, ChevronDown, ChevronUp } from "lucide-react";

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

// ── Mobile skeleton ──────────────────────────────────────────────
function MobileFilterSkeleton() {
  return (
    <div className="lg:hidden animate-pulse">
      <div className="flex items-center gap-2 mb-3">
        {/* Filter button skeleton */}
        <div className="h-10 w-28 rounded-xl bg-gray-200" />
      </div>
    </div>
  );
}

// ── Desktop skeleton ─────────────────────────────────────────────
function DesktopFilterSkeleton() {
  return (
    <aside className="hidden lg:block w-full lg:w-[300px] max-w-sm bg-white p-6 rounded-2xl border border-gray-200 shadow-lg lg:sticky lg:top-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="h-5 w-16 bg-gray-200 rounded-full" />
      </div>

      {/* Filter sections */}
      <div className="space-y-6">
        {[5, 4, 6, 3, 4].map((itemCount, si) => (
          <div key={si}>
            {/* Section label */}
            <div className="h-4 w-24 bg-gray-200 rounded-full mb-3" />
            <div className="border-t border-gray-100 pt-2 space-y-2">
              {Array.from({ length: itemCount }).map((_, i) => (
                <div key={i} className="flex items-center gap-2 px-1 py-1">
                  <div className="h-4 w-4 rounded bg-gray-200 shrink-0" />
                  <div
                    className="h-3 rounded-full bg-gray-100"
                    style={{ width: `${55 + (i * 13) % 35}%` }}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

function FilterContent({
  filters,
  selected,
  toggleSelect,
  clearFilters,
  hasActiveFilters,
}: {
  filters: CombinedFilterResponse;
  selected: { [key: string]: Set<string> };
  toggleSelect: (section: string, value: string, parentState?: string) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = (key: string) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const renderItems = (
    key: string,
    items: FilterItem[] | CourseFeesItem[],
    getValue: (item: any) => string,
    getState?: (item: any) => string | undefined,
  ) => {
    const isOpen = openSections[key] !== false;
    return (
      <div key={key} className="border-b border-gray-100 pb-3">
        <button
          onClick={() => toggleSection(key)}
          className="flex w-full items-center justify-between py-2 text-sm font-semibold text-gray-700"
        >
          <span>
            {FILTER_SECTIONS.find((s) => s.key === key)?.label ??
              (key === "fees" ? "Fees" : key)}
          </span>
          <span className="flex items-center gap-1.5">
            {(selected[key]?.size ?? 0) > 0 && (
              <span className="h-4 w-4 rounded-full bg-[#635dc1] text-white text-[9px] flex items-center justify-center font-bold">
                {selected[key].size}
              </span>
            )}
            {isOpen ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </span>
        </button>

        {isOpen && (
          <ul
            className="space-y-1 max-h-48 overflow-y-auto pt-1"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {items.map((item: any, index: number) => {
              const val = getValue(item);
              const isSelected = selected[key]?.has(val) || false;
              return (
                <li
                  key={`${key}-${val}-${index}`}
                  onClick={() => toggleSelect(key, val, getState?.(item))}
                  className={`flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-sm transition
                    ${isSelected
                      ? "bg-[#f0edff] border border-[#7a6be7] text-[#2f2479] font-semibold"
                      : "bg-gray-50 border border-transparent text-gray-600 hover:bg-gray-100"
                    }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => {
                      e.stopPropagation();
                      toggleSelect(key, val, getState?.(item));
                    }}
                    suppressHydrationWarning
                    className="h-4 w-4 rounded border-gray-300 accent-[#635dc1] shrink-0"
                  />
                  <span className="flex-1 truncate">
                    {val}{" "}
                    <span className={isSelected ? "text-[#7a6be7]" : "text-gray-400"}>
                      ({item.count})
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-1">
      {FILTER_SECTIONS.map(({ key }) =>
        filters[key] && Array.isArray(filters[key])
          ? renderItems(
              key,
              filters[key] as FilterItem[],
              (item) => item.name,
              key === "cities" ? (item) => item.state : undefined,
            )
          : null,
      )}
      {filters.fees && filters.fees.length > 0 &&
        renderItems("fees", filters.fees, (item) => item.range)}
    </div>
  );
}

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
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Detect if filters have loaded yet
  const isLoading = !filters || Object.keys(filters).length === 0;

  const NON_FILTER_KEYS_SET = new Set(["page", "search", "limit", "sort"]);
  useEffect(() => {
    const converted: { [key: string]: Set<string> } = {};
    for (const key in selectedFilters) {
      if (!NON_FILTER_KEYS_SET.has(key)) {
        converted[key] = new Set(selectedFilters[key]);
      }
    }
    setSelected(converted);
  }, [selectedFilters]);

  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  const toggleSelect = (section: string, value: string, parentState?: string) => {
    setSelected((prev) => {
      const newSet = new Set(prev[section] || []);
      if (newSet.has(value)) { newSet.delete(value); } else { newSet.add(value); }
      const updated = { ...prev, [section]: newSet };
      const filterObj: { [key: string]: string[] } = {};
      Object.entries(updated).forEach(([key, set]) => {
        if (set.size > 0) filterObj[key] = Array.from(set);
      });
      onFilterChange(filterObj);
      return updated;
    });
  };

  const clearFilters = () => {
    setSelected({});
    onFilterChange({});
    router.push("/college");
  };

  const NON_FILTER_KEYS = new Set(["page", "search", "limit", "sort"]);
  const hasActiveFilters = Object.entries(selected).some(
    ([key, set]) => !NON_FILTER_KEYS.has(key) && set.size > 0
  );
  const totalActive = Object.entries(selected).reduce(
    (acc, [key, s]) => acc + (NON_FILTER_KEYS.has(key) ? 0 : s.size),
    0
  );

  // ── Show skeletons while filters load ──
  if (isLoading) {
    return (
      <>
        <MobileFilterSkeleton />
        <DesktopFilterSkeleton />
      </>
    );
  }

  return (
    <>
      {/* ══════════════════════════════════════════
          MOBILE: floating filter button + slide-in drawer
      ══════════════════════════════════════════ */}
      <div className="lg:hidden">

        {/* Filter trigger bar */}
        <div className="flex items-center gap-2 mb-3">
          <button
            onClick={() => setDrawerOpen(true)}
            suppressHydrationWarning
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 shadow-sm text-sm font-semibold text-gray-700 hover:border-[#635dc1] transition"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#635dc1]" />
            Filters
            {totalActive > 0 && (
              <span className="h-5 w-5 rounded-full bg-[#635dc1] text-white text-[10px] flex items-center justify-center font-bold">
                {totalActive}
              </span>
            )}
          </button>
          {hasActiveFilters && (
            <button onClick={clearFilters} suppressHydrationWarning className="text-xs text-blue-600 hover:underline">
              Clear All
            </button>
          )}
        </div>

        {/* Active filter chips */}
        {hasActiveFilters && (
          <div
            className="flex gap-2 overflow-x-auto pb-2 mb-3"
            style={{ scrollbarWidth: "none" }}
          >
            {Object.entries(selected).flatMap(([key, set]) =>
              Array.from(set)
                .filter((val) => typeof val === "string" && val.trim().length > 0 && isNaN(Number(val.trim())))
                .map((val) => (
                  <span
                    key={`${key}-${val}`}
                    className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#f0edff] border border-[#7a6be7] text-[11px] font-semibold text-[#2f2479]"
                  >
                    {val}
                    <button
                      onClick={() => toggleSelect(key, val)}
                      className="ml-0.5 text-[#7a6be7] hover:text-[#2f2479]"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))
            )}
          </div>
        )}

        {/* Backdrop */}
        {drawerOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-[998]"
            onClick={() => setDrawerOpen(false)}
          />
        )}

        {/* Slide-in drawer */}
        <div className={`fixed top-0 left-0 h-full w-[82vw] max-w-[320px] bg-white z-[999] shadow-2xl flex flex-col transition-transform duration-300 ease-in-out
          ${drawerOpen ? "translate-x-0" : "-translate-x-full"}
        `}>
          {/* Drawer header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#635dc1]" />
              <h2 className="text-base font-bold text-gray-900">Filters</h2>
              {totalActive > 0 && (
                <span className="h-5 w-5 rounded-full bg-[#635dc1] text-white text-[10px] flex items-center justify-center font-bold">
                  {totalActive}
                </span>
              )}
            </div>
            <button
              onClick={() => setDrawerOpen(false)}
              suppressHydrationWarning
              className="p-1.5 rounded-lg hover:bg-gray-100 transition"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Scrollable filter content */}
          <div
            className="flex-1 overflow-y-auto px-4 py-3"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <FilterContent
              filters={filters}
              selected={selected}
              toggleSelect={toggleSelect}
              clearFilters={clearFilters}
              hasActiveFilters={hasActiveFilters}
            />
          </div>

          {/* Drawer footer */}
          <div className="px-4 py-4 border-t border-gray-100 flex gap-3 shrink-0">
            {hasActiveFilters && (
              <button
                onClick={() => { clearFilters(); setDrawerOpen(false); }}
                suppressHydrationWarning
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
              >
                Clear All
              </button>
            )}
            <button
              onClick={() => setDrawerOpen(false)}
              suppressHydrationWarning
              className="flex-1 py-2.5 rounded-xl bg-[#635dc1] text-white text-sm font-bold shadow hover:bg-[#4c46a4] transition"
            >
              Show Results
            </button>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          DESKTOP: original sticky sidebar — unchanged
      ══════════════════════════════════════════ */}
      <aside className="hidden lg:block w-full lg:w-[300px] max-w-sm bg-white p-6 rounded-2xl border border-gray-200 space-y-6 overflow-y-auto max-h-[calc(310vh-50px)] shadow-lg lg:sticky lg:top-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Filters</h2>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="text-sm text-blue-600 hover:underline">
              Clear All
            </button>
          )}
        </div>
        <div className="space-y-6">
          {FILTER_SECTIONS.map(({ key, label }) =>
            filters[key] && Array.isArray(filters[key]) ? (
              <div key={key}>
                <h3 className="font-medium text-gray-700 mb-2">{label}</h3>
                <ul className="space-y-1 max-h-48 overflow-y-auto border-t border-gray-100 pt-2 scrollbar-thin scrollbar-thumb-gray-300 pl-0">
                  {(filters[key] as FilterItem[]).map((item, index) => {
                    const isSelected = selected[key]?.has(item.name) || false;
                    return (
                      <li
                        key={`${key}-${item.name}-${index}`}
                        onClick={() => toggleSelect(key, item.name, key === "cities" ? item.state : undefined)}
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
                            onChange={(e) => { e.stopPropagation(); toggleSelect(key, item.name, key === "cities" ? item.state : undefined); }}
                            className="h-4 w-4 rounded border-gray-300 accent-[#635dc1] focus:ring-[#635dc1]"
                          />
                          <span>{item.name} <span className="text-gray-500">({item.count})</span></span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : null,
          )}
          {filters.fees && filters.fees.length > 0 && (
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Fees</h3>
              <ul className="space-y-1 max-h-48 overflow-y-auto border-t border-gray-100 pt-2 scrollbar-thin scrollbar-thumb-gray-300 pl-0">
                {filters.fees.map((item, index) => {
                  const isSelected = selected["fees"]?.has(item.range) || false;
                  return (
                    <li
                      key={`fees-${item.range}-${index}`}
                      onClick={() => toggleSelect("fees", item.range)}
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
                          onChange={(e) => { e.stopPropagation(); toggleSelect("fees", item.range); }}
                          className="h-4 w-4 rounded border-gray-300 accent-[#635dc1] focus:ring-[#635dc1]"
                        />
                        <span>{item.range} <span className="text-gray-500">({item.count})</span></span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
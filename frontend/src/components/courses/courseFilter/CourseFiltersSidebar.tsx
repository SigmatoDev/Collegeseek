// "use client";

// import { useEffect, useState } from "react";
// import { Loader2, SlidersHorizontal } from "lucide-react";
// import { api_url } from "@/utils/apiCall";
// import {
//   FilterRangeOption,
//   feeRangeOptions,
//   durationRangeOptions,
// } from "./filterOptions";

// interface StreamOption {
//   _id: string;
//   name: string;
// }

// interface ProgramModeOption {
//   _id: string;
//   name: string;
// }
// interface StateOption {
//   _id: string;
//   name: string;
// }

// interface CityOption {
//   _id: string;
//   name: string;
// }
// interface CourseFiltersSidebarProps {
//   selectedStreams: string[];
//   onStreamsChange: (ids: string[]) => void;
//   selectedFeeRanges: string[];
//   onFeeRangeChange: (ids: string[]) => void;
//   selectedCourseTypes: string[];
//   onCourseTypeChange: (ids: string[]) => void;
//   selectedDurations: string[];
//   onDurationChange: (ids: string[]) => void;
//   // ✅ NEW
//   selectedStates: string[];
//   onStatesChange: (ids: string[]) => void;

//   selectedCities: string[];
//   onCitiesChange: (ids: string[]) => void;
//   onClearFilters: () => void;
// }

// const CourseFiltersSidebar: React.FC<CourseFiltersSidebarProps> = ({
//   selectedStreams,
//   onStreamsChange,
//   selectedFeeRanges,
//   onFeeRangeChange,
//   selectedCourseTypes,
//   onCourseTypeChange,
//   selectedDurations,
//   onDurationChange,

//   selectedStates,
//   onStatesChange,
//   selectedCities,
//   onCitiesChange,
//   onClearFilters,
// }) => {
//   const [streams, setStreams] = useState<StreamOption[]>([]);
//   const [programModes, setProgramModes] = useState<ProgramModeOption[]>([]);
//   const [states, setStates] = useState<StateOption[]>([]);
//   const [cities, setCities] = useState<CityOption[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [hasMounted, setHasMounted] = useState(false); // ✅ Hydration safety

//   useEffect(() => {
//     setHasMounted(true); // Only render actual content after client mounts
//   }, []);

//   useEffect(() => {
//     const fetchFilters = async () => {

//       try {
//         const [streamsRes, programModeRes, locationRes] = await Promise.all([
//           fetch(`${api_url}get2/streams`),
//           fetch(`${api_url}get/program/`),
//           fetch(`${api_url}filters/location`),
//         ]);

//         const streamsData = await streamsRes.json();
//         const modesData = await programModeRes.json();
//         const locationData = await locationRes.json();

     

//         const resolvedStreams = Array.isArray(streamsData)
//           ? streamsData
//           : Array.isArray(streamsData?.data)
//             ? streamsData.data
//             : [];

//         const resolvedModes = Array.isArray(modesData)
//           ? modesData
//           : Array.isArray(modesData?.data)
//             ? modesData.data
//             : [];


//         setStreams(resolvedStreams);
//         setProgramModes(resolvedModes);
//         setStates(
//           (locationData.states || []).map((state: string) => ({
//             _id: state,
//             name: state,
//           })),
//         );

//         setCities(
//           (locationData.cities || []).map((city: string) => ({
//             _id: city,
//             name: city,
//           })),
//         );
//       } catch (error) {
//         console.error("❌ Failed to load course filters", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFilters();
//   }, []);

//   const toggleSelection = (
//     currentValues: string[],
//     setter: (next: string[]) => void,
//     value: string,
//   ) => {
//     const updatedValues = currentValues.includes(value)
//       ? currentValues.filter((item) => item !== value)
//       : [...currentValues, value];

//     console.log("🔁 Toggled value:", value);
//     console.log("📦 Updated values:", updatedValues);

//     setter(updatedValues);
//   };

//   const renderCheckboxList = (
//     options: { _id: string; name: string }[],
//     selectedValues: string[],
//     onChange: (value: string) => void,
//   ) => {
//     if (loading) {
//       return (
//         <div className="flex items-center gap-2 text-xs text-slate-500">
//           <Loader2 className="h-4 w-4 animate-spin" /> Loading options
//         </div>
//       );
//     }

//     if (!options.length) {
//       console.log("⚠️ No options available for checkbox list");
//       return (
//         <p className="text-xs text-slate-500">No options available yet.</p>
//       );
//     }

//     return (
//       <div className="space-y-1.5">
//         {options.map((option) => (
//           <label
//             key={option._id}
//             className="flex cursor-pointer items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700 transition hover:bg-[#ede9fe]"
//           >
//             <input
//               type="checkbox"
//               className="h-4 w-4 cursor-pointer rounded border-slate-300 text-[#6a4de7] focus:ring-[#6a4de7]"
//               checked={selectedValues.includes(option._id)}
//               onChange={() => {
//                 console.log("☑️ Checkbox clicked:", option);
//                 onChange(option._id);
//               }}
//             />
//             <span>{option.name}</span>
//           </label>
//         ))}
//       </div>
//     );
//   };

//   const renderRangeOptions = (
//     options: FilterRangeOption[],
//     selectedValues: string[],
//     onChange: (value: string) => void,
//   ) => (
//     <div className="space-y-1.5">
//       {options.map((option) => (
//         <label
//           key={option.id}
//           className={`flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
//             selectedValues.includes(option.id)
//               ? "bg-[#ede9fe] text-[#4c1d95]"
//               : "bg-slate-50 text-slate-700"
//           }`}
//         >
//           <input
//             type="checkbox"
//             className="h-4 w-4 cursor-pointer rounded border-slate-300 text-[#6a4de7] focus:ring-[#6a4de7]"
//             checked={selectedValues.includes(option.id)}
//             onChange={() => {
//               console.log("📏 Range option selected:", option);
//               onChange(option.id);
//             }}
//           />
//           <span>{option.label}</span>
//         </label>
//       ))}
//     </div>
//   );

//   // ✅ Only render actual filters after client mounts
//   if (!hasMounted) {
//     return (
//       <aside className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm lg:sticky lg:top-24">
//         <p className="text-xs text-slate-500">Loading filters...</p>
//       </aside>
//     );
//   }

//   return (
//     <aside className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm lg:sticky lg:top-24">
//       <div className="mb-3 flex items-center justify-between">
//         <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
//           <SlidersHorizontal className="h-4 w-4 text-[#635dc1]" />
//           Refine Results
//         </div>
//         <button
//           type="button"
//           onClick={() => {
//             console.log("🧹 Clear all filters clicked");
//             onClearFilters();
//           }}
//           className="text-xs font-medium text-[#635dc1] underline-offset-2 hover:underline"
//         >
//           Clear all
//         </button>
//       </div>

//       <div className="space-y-4">
//         <section>
//           <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
//             Stream
//           </p>
//           <div className="max-h-44 space-y-2 overflow-y-auto pr-1">
//             {renderCheckboxList(streams, selectedStreams, (value) =>
//               toggleSelection(selectedStreams, onStreamsChange, value),
//             )}
//           </div>
//         </section>
//         <section>
//           <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
//             State
//           </p>

//           <div className="max-h-44 space-y-2 overflow-y-auto pr-1">
//             {renderCheckboxList(states, selectedStates, (value) =>
//               toggleSelection(selectedStates, onStatesChange, value),
//             )}
//           </div>
//         </section>
//         <section>
//           <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
//             City
//           </p>

//           <div className="max-h-44 space-y-2 overflow-y-auto pr-1">
//             {renderCheckboxList(cities, selectedCities, (value) =>
//               toggleSelection(selectedCities, onCitiesChange, value),
//             )}
//           </div>
//         </section>
//         <section>
//           <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
//             Avg Fee / Year
//           </p>
//           {renderRangeOptions(feeRangeOptions, selectedFeeRanges, (value) =>
//             toggleSelection(selectedFeeRanges, onFeeRangeChange, value),
//           )}
//         </section>

//         <section>
//           <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
//             Course Type
//           </p>

//           <div className="max-h-44 space-y-2 overflow-y-auto pr-1">
//             {renderCheckboxList(programModes, selectedCourseTypes, (value) =>
//               toggleSelection(selectedCourseTypes, onCourseTypeChange, value),
//             )}
//           </div>
//         </section>

//         <section>
//           <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
//             Course Duration
//           </p>
//           {renderRangeOptions(
//             durationRangeOptions,
//             selectedDurations,
//             (value) =>
//               toggleSelection(selectedDurations, onDurationChange, value),
//           )}
//         </section>
//       </div>
//     </aside>
//   );
// };

// export default CourseFiltersSidebar;
"use client";

import { useEffect, useState } from "react";
import { Loader2, SlidersHorizontal, X, ChevronDown, ChevronUp } from "lucide-react";
import { api_url } from "@/utils/apiCall";
import {
  FilterRangeOption,
  feeRangeOptions,
  durationRangeOptions,
} from "./filterOptions";

interface StreamOption { _id: string; name: string; }
interface ProgramModeOption { _id: string; name: string; }
interface StateOption { _id: string; name: string; }
interface CityOption { _id: string; name: string; }

interface CourseFiltersSidebarProps {
  selectedStreams: string[];
  onStreamsChange: (ids: string[]) => void;
  selectedFeeRanges: string[];
  onFeeRangeChange: (ids: string[]) => void;
  selectedCourseTypes: string[];
  onCourseTypeChange: (ids: string[]) => void;
  selectedDurations: string[];
  onDurationChange: (ids: string[]) => void;
  selectedStates: string[];
  onStatesChange: (ids: string[]) => void;
  selectedCities: string[];
  onCitiesChange: (ids: string[]) => void;
  onClearFilters: () => void;
}

// ── Mobile skeleton ──────────────────────────────────────────────
function MobileSkeleton() {
  return (
    <div className="lg:hidden animate-pulse">
      <div className="h-10 w-28 rounded-xl bg-gray-200" />
    </div>
  );
}

// ── Desktop skeleton ─────────────────────────────────────────────
function DesktopSkeleton() {
  return (
    <aside className="hidden lg:block rounded-2xl border border-slate-100 bg-white p-4 shadow-sm lg:sticky lg:top-24 animate-pulse">
      <div className="mb-4 flex items-center justify-between">
        <div className="h-4 w-28 rounded-full bg-gray-200" />
        <div className="h-3 w-12 rounded-full bg-gray-100" />
      </div>
      <div className="space-y-5">
        {[4, 5, 3, 4, 3, 4].map((count, si) => (
          <div key={si}>
            <div className="h-3 w-20 rounded-full bg-gray-200 mb-3" />
            <div className="space-y-2">
              {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50">
                  <div className="h-4 w-4 rounded bg-gray-200 shrink-0" />
                  <div className="h-3 rounded-full bg-gray-100" style={{ width: `${50 + (i * 17) % 40}%` }} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

const CourseFiltersSidebar: React.FC<CourseFiltersSidebarProps> = ({
  selectedStreams, onStreamsChange,
  selectedFeeRanges, onFeeRangeChange,
  selectedCourseTypes, onCourseTypeChange,
  selectedDurations, onDurationChange,
  selectedStates, onStatesChange,
  selectedCities, onCitiesChange,
  onClearFilters,
}) => {
  const [streams, setStreams] = useState<StreamOption[]>([]);
  const [programModes, setProgramModes] = useState<ProgramModeOption[]>([]);
  const [states, setStates] = useState<StateOption[]>([]);
  const [cities, setCities] = useState<CityOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  useEffect(() => { setHasMounted(true); }, []);

  useEffect(() => {
    if (drawerOpen) { document.body.style.overflow = "hidden"; }
    else { document.body.style.overflow = ""; }
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [streamsRes, programModeRes, locationRes] = await Promise.all([
          fetch(`${api_url}get2/streams`),
          fetch(`${api_url}get/program/`),
          fetch(`${api_url}filters/location`),
        ]);
        const streamsData = await streamsRes.json();
        const modesData = await programModeRes.json();
        const locationData = await locationRes.json();

        setStreams(Array.isArray(streamsData) ? streamsData : streamsData?.data || []);
        setProgramModes(Array.isArray(modesData) ? modesData : modesData?.data || []);
        setStates((locationData.states || []).map((s: string) => ({ _id: s, name: s })));
        setCities((locationData.cities || []).map((c: string) => ({ _id: c, name: c })));
      } catch (error) {
        console.error("Failed to load course filters", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFilters();
  }, []);

  const toggleSection = (key: string) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const isOpen = (key: string) => openSections[key] !== false; // default open

  const toggleSelection = (current: string[], setter: (v: string[]) => void, value: string) => {
    setter(current.includes(value) ? current.filter((i) => i !== value) : [...current, value]);
  };

  const totalActive =
    selectedStreams.length + selectedFeeRanges.length + selectedCourseTypes.length +
    selectedDurations.length + selectedStates.length + selectedCities.length;

  const renderCheckboxList = (
    options: { _id: string; name: string }[],
    selectedValues: string[],
    onChange: (v: string) => void,
  ) => {
    if (loading) return (
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading options
      </div>
    );
    if (!options.length) return <p className="text-xs text-slate-500">No options available yet.</p>;
    return (
      <div className="space-y-1.5">
        {options.map((option) => (
          <label key={option._id} className="flex cursor-pointer items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700 transition hover:bg-[#ede9fe]">
            <input
              type="checkbox"
              className="h-4 w-4 cursor-pointer rounded border-slate-300 text-[#6a4de7] focus:ring-[#6a4de7]"
              checked={selectedValues.includes(option._id)}
              onChange={() => onChange(option._id)}
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
    onChange: (v: string) => void,
  ) => (
    <div className="space-y-1.5">
      {options.map((option) => (
        <label key={option.id} className={`flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${selectedValues.includes(option.id) ? "bg-[#ede9fe] text-[#4c1d95]" : "bg-slate-50 text-slate-700"}`}>
          <input
            type="checkbox"
            className="h-4 w-4 cursor-pointer rounded border-slate-300 text-[#6a4de7] focus:ring-[#6a4de7]"
            checked={selectedValues.includes(option.id)}
            onChange={() => onChange(option.id)}
          />
          <span>{option.label}</span>
        </label>
      ))}
    </div>
  );

  // Collapsible section used inside mobile drawer
  const DrawerSection = ({
    id, label, children,
  }: { id: string; label: string; children: React.ReactNode }) => (
    <div className="border-b border-gray-100 pb-3">
      <button
        onClick={() => toggleSection(id)}
        className="flex w-full items-center justify-between py-2 text-sm font-semibold text-gray-700"
      >
        <span className="uppercase tracking-wide text-xs text-slate-500">{label}</span>
        {isOpen(id)
          ? <ChevronUp className="w-4 h-4 text-gray-400" />
          : <ChevronDown className="w-4 h-4 text-gray-400" />
        }
      </button>
      {isOpen(id) && (
        <div className="pt-1 max-h-44 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
          {children}
        </div>
      )}
    </div>
  );

  // Show skeletons while not mounted yet
  if (!hasMounted) {
    return (
      <>
        <MobileSkeleton />
        <DesktopSkeleton />
      </>
    );
  }

  return (
    <>
      {/* ══════════════════════════════════════════
          MOBILE: trigger button + slide-in drawer
      ══════════════════════════════════════════ */}
      <div className="lg:hidden">

        {/* Trigger row */}
        <div className="flex items-center gap-2">
          <button
            suppressHydrationWarning
            onClick={() => setDrawerOpen(true)}
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
          {totalActive > 0 && (
            <button
              suppressHydrationWarning
              onClick={onClearFilters}
              className="text-xs text-[#635dc1] hover:underline font-medium"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Backdrop */}
        {drawerOpen && (
          <div className="fixed inset-0 bg-black/40 z-[998]" onClick={() => setDrawerOpen(false)} />
        )}

        {/* Slide-in drawer */}
        <div className={`fixed top-0 left-0 h-full w-[82vw] max-w-[320px] bg-white z-[999] shadow-2xl flex flex-col transition-transform duration-300 ease-in-out
          ${drawerOpen ? "translate-x-0" : "-translate-x-full"}
        `}>
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#635dc1]" />
              <h2 className="text-base font-bold text-gray-900">Refine Results</h2>
              {totalActive > 0 && (
                <span className="h-5 w-5 rounded-full bg-[#635dc1] text-white text-[10px] flex items-center justify-center font-bold">
                  {totalActive}
                </span>
              )}
            </div>
            <button suppressHydrationWarning onClick={() => setDrawerOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100 transition">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto px-4 py-3" style={{ scrollbarWidth: "none" }}>
            <div className="space-y-1">
              <DrawerSection id="stream" label="Stream">
                {renderCheckboxList(streams, selectedStreams, (v) => toggleSelection(selectedStreams, onStreamsChange, v))}
              </DrawerSection>
              <DrawerSection id="state" label="State">
                {renderCheckboxList(states, selectedStates, (v) => toggleSelection(selectedStates, onStatesChange, v))}
              </DrawerSection>
              <DrawerSection id="city" label="City">
                {renderCheckboxList(cities, selectedCities, (v) => toggleSelection(selectedCities, onCitiesChange, v))}
              </DrawerSection>
              <DrawerSection id="fee" label="Avg Fee / Year">
                {renderRangeOptions(feeRangeOptions, selectedFeeRanges, (v) => toggleSelection(selectedFeeRanges, onFeeRangeChange, v))}
              </DrawerSection>
              <DrawerSection id="type" label="Course Type">
                {renderCheckboxList(programModes, selectedCourseTypes, (v) => toggleSelection(selectedCourseTypes, onCourseTypeChange, v))}
              </DrawerSection>
              <DrawerSection id="duration" label="Course Duration">
                {renderRangeOptions(durationRangeOptions, selectedDurations, (v) => toggleSelection(selectedDurations, onDurationChange, v))}
              </DrawerSection>
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 py-4 border-t border-gray-100 flex gap-3 shrink-0">
            {totalActive > 0 && (
              <button
                suppressHydrationWarning
                onClick={() => { onClearFilters(); setDrawerOpen(false); }}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
              >
                Clear All
              </button>
            )}
            <button
              suppressHydrationWarning
              onClick={() => setDrawerOpen(false)}
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
      <aside className="hidden lg:block rounded-2xl border border-slate-100 bg-white p-4 shadow-sm lg:sticky lg:top-24">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
            <SlidersHorizontal className="h-4 w-4 text-[#635dc1]" />
            Refine Results
          </div>
          <button
            type="button"
            onClick={onClearFilters}
            className="text-xs font-medium text-[#635dc1] underline-offset-2 hover:underline"
          >
            Clear all
          </button>
        </div>

        <div className="space-y-4">
          <section>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Stream</p>
            <div className="max-h-44 space-y-2 overflow-y-auto pr-1">
              {renderCheckboxList(streams, selectedStreams, (v) => toggleSelection(selectedStreams, onStreamsChange, v))}
            </div>
          </section>
          <section>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">State</p>
            <div className="max-h-44 space-y-2 overflow-y-auto pr-1">
              {renderCheckboxList(states, selectedStates, (v) => toggleSelection(selectedStates, onStatesChange, v))}
            </div>
          </section>
          <section>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">City</p>
            <div className="max-h-44 space-y-2 overflow-y-auto pr-1">
              {renderCheckboxList(cities, selectedCities, (v) => toggleSelection(selectedCities, onCitiesChange, v))}
            </div>
          </section>
          <section>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Avg Fee / Year</p>
            {renderRangeOptions(feeRangeOptions, selectedFeeRanges, (v) => toggleSelection(selectedFeeRanges, onFeeRangeChange, v))}
          </section>
          <section>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Course Type</p>
            <div className="max-h-44 space-y-2 overflow-y-auto pr-1">
              {renderCheckboxList(programModes, selectedCourseTypes, (v) => toggleSelection(selectedCourseTypes, onCourseTypeChange, v))}
            </div>
          </section>
          <section>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Course Duration</p>
            {renderRangeOptions(durationRangeOptions, selectedDurations, (v) => toggleSelection(selectedDurations, onDurationChange, v))}
          </section>
        </div>
      </aside>
    </>
  );
};

export default CourseFiltersSidebar;
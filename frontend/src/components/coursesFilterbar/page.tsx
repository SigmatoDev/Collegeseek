import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { api_url } from "@/utils/apiCall";

interface FilterSidebarProps {
  onFilterChange: (newFilters: string[]) => void;
}

const CoursesFilterSidebar = ({ onFilterChange }: FilterSidebarProps) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    duration: true,
    mode: true,
  });

  const [search, setSearch] = useState<Record<string, string>>({
    duration: "",
    mode: "",
  });

  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [isClient, setIsClient] = useState(false);

  const [filtersData, setFiltersData] = useState<Record<string, string[]>>({
    duration: [],
    mode: [],
  });

  useEffect(() => {
    setIsClient(true);

    const fetchFilters = async () => {
      try {
        const res = await fetch(`${api_url}get/courses/filters`);
        const data = await res.json();
        setFiltersData({
          duration: data.durations || [],
          mode: data.modes || [],
        });
      } catch (error) {
        console.error("Failed to fetch filter data", error);
      }
    };

    fetchFilters();
  }, []);

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleFilterClick = (value: string) => {
    const newSelectedFilters = selectedFilters.includes(value)
      ? selectedFilters.filter((item) => item !== value)
      : [...selectedFilters, value];
  
    console.log("Selected Filters:", newSelectedFilters); // 👈 Log the selected filters
  
    setSelectedFilters(newSelectedFilters);
    onFilterChange(newSelectedFilters);
  };
  

  if (!isClient) return null;

  return (
    <aside className="w-80 bg-white p-3 shadow-lg border border-gray-300 overflow-y-auto h-[800px]">
      {Object.keys(filtersData).map((filterType) => (
        <div key={filterType} className="mb-4">
          <div
            className="flex justify-between items-center cursor-pointer py-3 border-b border-gray-300"
            onClick={() => toggleSection(filterType)}
          >
            <h3 className="text-lg font-semibold capitalize text-gray-800">
              {filterType}
            </h3>
            {openSections[filterType] ? (
              <ChevronUp className="w-6 h-6 text-gray-600" />
            ) : (
              <ChevronDown className="w-6 h-6 text-gray-600" />
            )}
          </div>
          {openSections[filterType] && (
            <div className="mt-3 max-h-56 overflow-y-auto space-y-2 custom-scrollbar">
              {filtersData[filterType]
                .filter((item) =>
                  item
                    .toLowerCase()
                    .includes(search[filterType].toLowerCase())
                )
                .map((value) => (
                  <div
                    key={value}
                    className={`flex items-center space-x-3 py-2 px-2 rounded-lg cursor-pointer transition text-[15px] ${
                      selectedFilters.includes(value)
                        ? "bg-blue-100 text-blue-600"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => handleFilterClick(value)}
                  >
                    <div
                      className={`w-5 h-5 border rounded-full flex items-center justify-center transition ${
                        selectedFilters.includes(value)
                          ? "bg-blue-500 border-blue-500"
                          : "border-gray-400"
                      }`}
                    >
                      {selectedFilters.includes(value) && (
                        <div className="w-2.5 h-2.5 bg-white rounded-full" />
                      )}
                    </div>
                    <span>{value}</span>
                  </div>
                ))}
            </div>
          )}
        </div>
      ))}
    </aside>
  );
};

export default CoursesFilterSidebar;

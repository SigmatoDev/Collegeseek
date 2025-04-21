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
    <aside className="w-80 max-w-sm bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-6">
      <h1 className="text-xl font-semibold text-gray-800">Filter Courses</h1>

      <div className="space-y-5 overflow-y-auto max-h-[calc(150vh-50px)] pr-2">
        {Object.keys(filtersData).map((filterType) => (
          <FilterSectionWrapper key={filterType} title={filterType}>
          <div className="max-h-40 overflow-y-auto">
            {filtersData[filterType]
              .filter((item) =>
                item.toLowerCase().includes(search[filterType].toLowerCase())
              )
              .map((value) => (
                <label
                  key={value}
                  className="flex items-center space-x-3 py-2 px-2 rounded-lg cursor-pointer transition text-[15px]"
                >
                  <input
                    type="checkbox"
                    checked={selectedFilters.includes(value)}
                    onChange={() => handleFilterClick(value)}
                    className="accent-blue-600 h-4 w-4 rounded"
                  />
                  <span
                    className={`${
                      selectedFilters.includes(value)
                        ? "text-blue-600"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {value}
                  </span>
                </label>
              ))}
          </div>
        </FilterSectionWrapper>
        
        ))}
      </div>
    </aside>
  );
};

export default CoursesFilterSidebar;
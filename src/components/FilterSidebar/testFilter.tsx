import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { api_url } from "@/utils/apiCall";

const filtersData: Record<string, string[]> = {
  degrees: [
    "B.Tech. (Bachelor of Technology)",
    "M.Com. (Master of Commerce)",
    "B.Arch. (Bachelor of Architecture)",
    "M.Arch. (Master of Architecture)",
    "Ph.D. (Doctor of Philosophy)",
    "M.D.S. (Master of Dental Surgery)",
  ],
  states: [
    "Maharashtra",
    "Karnataka",
    "Tamil Nadu",
    "Uttar Pradesh",
    "Gujarat",
    "ANDHRA PRADESH",
  ],
  cities: [
    "Mumbai",
    "Bangalore",
    "Chennai",
    "Lucknow",
    "Ahmedabad",
    "Kolkata",
    "Sri City",
  ],
  fees: [
    "₹0 - ₹8,00,000",
    "₹8,00,000 - ₹16,00,000",
    "₹16,00,000 - ₹24,00,000",
    "₹24,00,000 - ₹32,00,000",
    "₹32,00,000 - ₹40,00,000",
    "₹40,00,000+",
  ],
  specializations: [
    "Computer Science",
    "Mechanical Engineering",
    "Civil Engineering",
    "Electrical Engineering",
    "Marketing",
    "Finance",
  ],
  ranking: ["Top 10", "Top 50", "Top 100", "Top 200", "Top 500", "Unranked"],
};

interface FilterSidebarProps {
  onFilterChange: (newFilters: string[]) => void;
}

const FilterSidebar = ({ onFilterChange }: FilterSidebarProps) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    degrees: true,
    states: true,
    cities: true,
    fees: true,
    specializations: true,
    ranking: true,
  });

  const [search, setSearch] = useState<Record<string, string>>({
    degrees: "",
    states: "",
    cities: "",
    fees: "",
    specializations: "",
    ranking: "",
  });

  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleFilterClick = (value: string) => {
    const newSelectedFilters = selectedFilters.includes(value)
      ? selectedFilters.filter((item) => item !== value)
      : [...selectedFilters, value];

    setSelectedFilters(newSelectedFilters);
    onFilterChange(newSelectedFilters);
  };

  useEffect(() => {
    if (!isClient) return;

    const fetchFilteredData = async () => {
      try {
        const res = await fetch(`${api_url}filtered-colleges`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ filters: selectedFilters }),
        });

        const data = await res.json();
        console.log("Filtered Data:",data);
        // You can update your UI with the filtered data here if needed.
      } catch (error) {
        console.error("API call failed:", error);
      }
    };

    fetchFilteredData();
  }, [selectedFilters, isClient]);

  if (!isClient) return null;

  return (
    <aside className="w-80 bg-white p-3 shadow-lg rounded-2xl border-[1px] border-gray-300 overflow-y-auto">
      {Object.keys(filtersData).map((filterType) => (
        <div key={filterType} className="mb-4">
          <div
            className="flex justify-between items-center cursor-pointer py-3 border-gray-300"
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
            <div className="mt-3">
              <input
                type="text"
                placeholder="Search..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                value={search[filterType] || ""}
                onChange={(e) =>
                  setSearch((prev) => ({
                    ...prev,
                    [filterType]: e.target.value,
                  }))
                }
              />
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
            </div>
          )}
        </div>
      ))}
    </aside>
  );
};

export default FilterSidebar;

import { useState } from "react";

interface Location {
  display_name: string;
  lat: string;
  lon: string;
}

interface LocationAutocompleteProps {
  onLocationSelect: (lat: number, lng: number, place: string) => void;
}

const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({ onLocationSelect }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Location[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const fetchLocations = async (searchQuery: string) => {
    if (searchQuery.length < 3) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&addressdetails=1&limit=5`
      );
      const data = await response.json();
      setSuggestions(data);
      setShowDropdown(true);
    } catch (error) {
      console.error("Error fetching location data:", error);
    }
  };

  const handleSelect = (location: Location) => {
    setQuery(location.display_name);
    setSuggestions([]);
    setShowDropdown(false);
    onLocationSelect(parseFloat(location.lat), parseFloat(location.lon), location.display_name);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          fetchLocations(e.target.value);
        }}
        placeholder="Search location..."
        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
      />
      {showDropdown && suggestions.length > 0 && (
        <ul className="absolute w-full bg-white border border-gray-300 rounded-xl mt-1 max-h-60 overflow-auto shadow-lg z-10">
          {suggestions.map((location, index) => (
            <li
              key={index}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(location)}
            >
              {location.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocationAutocomplete;

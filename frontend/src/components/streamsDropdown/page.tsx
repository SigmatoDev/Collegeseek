// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { api_url } from "@/utils/apiCall";

// interface DropdownProps {
//   name: string;
//   value: string;
//   onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
//   label: string;
// }


// const Dropdown: React.FC<DropdownProps> = ({ name, value, onChange, label, }) => {
//   const [streams, setStreams] = useState<{ _id: string; name: string }[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchStreams = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get(`${api_url}get/streams`);
//         setStreams(response.data); // Use setStreams to update state with the fetched data
//         setLoading(false);
//       } catch (err) {
//         console.error("Error fetching streams:", err);
//         setError("Failed to load streams.");
//         setLoading(false);
//       }
//     };

//     fetchStreams();
//   }, []); // Optional: add `apiUrl` as a dependency if it might change

//   return (
//     <div className="mb-4">
//       <label htmlFor={name} className="block text-sm font-semibold text-gray-700">
//         {label}
//       </label>
//       {loading && <p>Loading options...</p>}
//       {error && <p className="text-red-500">{error}</p>}
//       {!loading && !error && (
//         <select
//           name={name}
//           value={value}
//           onChange={onChange}
//           className="p-2 border rounded w-full mt-2"
//         >
//           <option value="">Select {label}</option>
//           {streams.map((option) => (
//             <option key={option._id} value={option._id}>
//               {option.name}
//             </option>
//           ))}
//         </select>
//       )}
//     </div>
//   );
// };

// export default Dropdown;

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { api_url } from "@/utils/apiCall";

// Rename `Stream` to `StreamType`
export interface StreamType {
  _id: string;
  name: string;
  description?: string;
}

interface Props {
  defaultSelected: string[] | { _id: string }[]; // Array of selected stream IDs or objects
  onSelectionChange: (selectedStreams: StreamType[]) => void;
}

const StreamDropdown: React.FC<Props> = ({ onSelectionChange, defaultSelected = [] }) => {
  const [streams, setStreams] = useState<StreamType[]>([]);
  const [selectedStreams, setSelectedStreams] = useState<StreamType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  // Fetch all streams
  useEffect(() => {
    const fetchStreams = async () => {
      try {
        const { data } = await axios.get(`${api_url}get2/streams`);
        if (Array.isArray(data)) {
          setStreams(data);
        }
      } catch (error) {
        console.error("Error fetching streams:", error);
      }
    };

    fetchStreams();
  }, []);

  // Update selectedStreams if defaultSelected changes
  useEffect(() => {
    if (streams.length > 0) {
      const ids = defaultSelected.map((item) =>
        typeof item === "string" ? item : item._id
      );

      const defaultStreamObjects = ids
        .map((id) => streams.find((stream) => stream._id === id))
        .filter((stream): stream is StreamType => stream !== undefined);

      setSelectedStreams(defaultStreamObjects);
    }
  }, [defaultSelected, streams]);

  // Handle selection
  const handleSelect = useCallback(
    (stream: StreamType) => {
      if (!selectedStreams.some((s) => s._id === stream._id)) {
        const updated = [...selectedStreams, stream];
        setSelectedStreams(updated);
        onSelectionChange(updated);
      }
      setSearchQuery("");
      setIsFocused(false); // close dropdown after selection
    },
    [selectedStreams, onSelectionChange]
  );

  // Handle remove
  const handleRemove = (id: string) => {
    const updated = selectedStreams.filter((s) => s._id !== id);
    setSelectedStreams(updated);
    onSelectionChange(updated);
  };

  // Filtered results excluding already selected
  const filteredStreams = streams
    .filter((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter((s) => !selectedStreams.some((sel) => sel._id === s._id));

  return (
    <div className="w-full max-w-[800px] mx-auto">
      <div className="border p-3 rounded-lg">
        {/* Selected tags */}
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedStreams.map((stream) => (
            <span
              key={stream._id}
              className="bg-blue-500 text-white px-3 py-1 rounded-lg flex items-center"
            >
              {stream.name}
              <button
                className="ml-2 text-white hover:text-gray-300"
                onClick={() => handleRemove(stream._id)}
              >
                ✕
              </button>
            </span>
          ))}
        </div>

        {/* Input */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder="Search and add streams..."
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Dropdown */}
        {isFocused && filteredStreams.length > 0 && (
          <div className="border mt-2 rounded-lg max-h-40 overflow-y-auto bg-white shadow-md z-10 relative">
            {filteredStreams.map((stream) => (
              <div
                key={stream._id}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelect(stream)}
              >
                {stream.name}
                {stream.description && (
                  <span className="text-sm text-gray-500 ml-2">
                    - {stream.description}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StreamDropdown;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { api_url } from "@/utils/apiCall";

interface DropdownProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  label: string;
}


const StreamsDropdown: React.FC<DropdownProps> = ({ name, value, onChange, label, }) => {
  const [streams, setStreams] = useState<{ _id: string; name: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStreams = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${api_url}get2/streams`);
        setStreams(response.data); // Use setStreams to update state with the fetched data
        setLoading(false);
      } catch (err) {
        console.error("Error fetching streams:", err);
        setError("Failed to load streams.");
        setLoading(false);
      }
    };

    fetchStreams();
  }, []); // Optional: add `apiUrl` as a dependency if it might change

  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-semibold text-gray-700">
        {label}
      </label>
      {loading && <p>Loading options...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="p-2 border rounded w-full"
        >
          <option value="">Select {label}</option>
          {streams.map((option) => (
            <option key={option._id} value={option._id}>
              {option.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default StreamsDropdown;
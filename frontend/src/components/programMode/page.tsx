import React, { useState, useEffect } from "react";
import axios from "axios";
import { api_url } from "@/utils/apiCall";

interface ProgramModeDropdownProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  label: string;
  required?: boolean;  // add this
}

const ProgramModeDropdown: React.FC<ProgramModeDropdownProps> = ({
  name,
  value,
  onChange,
  label,
  required = false, // default to false if not passed
}) => {
  const [programModes, setProgramModes] = useState<{ _id: string; name: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProgramModes = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${api_url}get/Program`);
        setProgramModes(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching program modes:", err);
        setError("Failed to load program modes.");
        setLoading(false);
      }
    };

    fetchProgramModes();
  }, []);

  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-semibold text-gray-700">
        {label}
      </label>
      {loading && <p>Loading options...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}  // <-- here you go
          className="p-2 border rounded w-full mt-2"
        >
          <option value="">Select {label}</option>
          {programModes.map((option) => (
            <option key={option._id} value={option._id}>
              {option.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default ProgramModeDropdown;

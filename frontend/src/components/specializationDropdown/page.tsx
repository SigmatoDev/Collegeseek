import React, { useState, useEffect } from "react";
import axios from "axios";
import { api_url } from "@/utils/apiCall";

interface SpecializationDropdownProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;  // added here
  label: string;
}

const SpecializationDropdown: React.FC<SpecializationDropdownProps> = ({
  name,
  value,
  onChange,
  label,
  required = false,  // default false
}) => {
  const [specializations, setSpecializations] = useState<{ _id: string; name: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${api_url}get/Specialization`);
        setSpecializations(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching specializations:", err);
        setError("Failed to load specializations.");
        setLoading(false);
      }
    };

    fetchSpecializations();
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
          id={name}               // associate label with select
          name={name}
          value={value}
          onChange={onChange}
          required={required}      // pass required here
          className="p-2 border rounded w-full mt-2"
        >
          <option value="">Select {label}</option>
          {specializations.map((option) => (
            <option key={option._id} value={option._id}>
              {option.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default SpecializationDropdown;
